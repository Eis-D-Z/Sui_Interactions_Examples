# Example 4 Publishing a Package on Sui

Modules that we have written can be published via the JSON rpc calls. The name of the call is 
<a href="https://docs.sui.io/sui-jsonrpc#sui_publish">`sui_publish`</a>.

## Getting started

As with [Example 3](Example_3_Split_Coin.md) we will first bind the address and rpc web address to variables.

```sh
rpc="https://fullnode.devnet.sui.io:443"

# get our address
sui client active-address
 # 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
 address="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
```
We will need a module to upload. For this example we shall use the package `move_tutorial` from  the <a href="https://github.com/MystenLabs/sui/tree/main/sui_programmability/examples/move_tutorial">Sui repo</a>.</br>

et's get our move package, we will clone the whole sui repo and use the module `move_tutorial` in `sui/sui_programmability/examples`. (We clone the whole repo hoping that it will help you get started to explore and play with sui, we'll take it a step further and suggest you fork the repo in your github account first and clone your fork).

```sh
# clone the repo in the work or home directory
git clone https://github.com/MystenLabs/sui.git
```

In order to publish a module, first it needs to be built. If we try it directly an error will pop up so proactively let's first alter the `Move.toml` file inside `sui/sui_programmability/examples/move_tutorial/`. We need to change the following line:

```
[dependencies]
Sui = { local = "../../../crates/sui-framework" }
```

to

```
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework", rev = "devnet" }
```

Also, at the end of the `Move.toml` file add the following line:

```
sui =  "0000000000000000000000000000000000000002"
```

Now the module is ready to be built, inside the `sui/sui_programmability/examples/move_tutorial/` run:

```sh
# inside sui/sui_programmability/examples/move_tutorial/
sui move build
```

A new `build/` directory will appear, inside it we can see  the `build/MyFirstPackage/bytecode_modules/my_module.mv` file which the one desired.

Last step is to encode its contents with the tool `sui move build --dump-bytecode-as-base64`:

```sh
# inside sui/sui_programmability/examples/move_tutorial/
sui move build --dump-bytecode-as-base64
# ["oRzrCwUAAAAKAQAIAggQAxgpBEEEBUUsB3F9CO4BKAqWAhIMqAJyDZoDBgAAAQEBAgEDAAQIAAAFDAADBgIAAQ0EAAAHAAEAAAgCAwAACQIDAAAKBAEAAAsFAwABDgAHAAMPCAkAAgIKAQEIBwYHCwEHCAIAAQYIAQEDBQcIAAMDBQcIAgEGCAABCAABCAMBBggCAQUCCQAFAQgBCW15X21vZHVsZQZvYmplY3QIdHJhbnNmZXIKdHhfY29udGV4dAVGb3JnZQVTd29yZAlUeENvbnRleHQEaW5pdAVtYWdpYwhzdHJlbmd0aAxzd29yZF9jcmVhdGUOc3dvcmRzX2NyZWF0ZWQCaWQDVUlEA25ldwZzZW5kZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAICDAgDCwMBAgMMCAMIAwkDAAAAAAYLCgARBQYAAAAAAAAAABIADAELAQsALhEGOAACAQEAAAEECwAQABQCAgEAAAEECwAQARQCAwEEAAsSCwQRBQsBCwISAQwFCwULAzgBCgAQAhQGAQAAAAAAAAAWCwAPAhUCBAEAAAEECwAQAhQCAQEBAgABAA=="]

# bind the base64 output without the []
module_base64="oRzrCwUAAAAKAQAIAggQAxgpBEEEBUUsB3F9CO4BKAqWAhIMqAJyDZoDBgAAAQEBAgEDAAQIAAAFDAADBgIAAQ0EAAAHAAEAAAgCAwAACQIDAAAKBAEAAAsFAwABDgAHAAMPCAkAAgIKAQEIBwYHCwEHCAIAAQYIAQEDBQcIAAMDBQcIAgEGCAABCAABCAMBBggCAQUCCQAFAQgBCW15X21vZHVsZQZvYmplY3QIdHJhbnNmZXIKdHhfY29udGV4dAVGb3JnZQVTd29yZAlUeENvbnRleHQEaW5pdAVtYWdpYwhzdHJlbmd0aAxzd29yZF9jcmVhdGUOc3dvcmRzX2NyZWF0ZWQCaWQDVUlEA25ldwZzZW5kZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAICDAgDCwMBAgMMCAMIAwkDAAAAAAYLCgARBQYAAAAAAAAAABIADAELAQsALhEGOAACAQEAAAEECwAQABQCAgEAAAEECwAQARQCAwEEAAsSCwQRBQsBCwISAQwFCwULAzgBCgAQAhQGAQAAAAAAAAAWCwAPAhUCBAEAAAEECwAQAhQCAQEBAgABAA=="
```

We bound to the `module_base64` because `sui_publish` requires `sender, compiled_modules, gas, gas_budget` as arguments. `sender` is our address and `compiled_modules` is an array holding the base64 encoding of the bytecode of the packages we want to publish. This means we can publish more than one package at the same time. In this example we will stick to one package.

## Initial request and execution

```sh
# prepare the data
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_publish\", \"params\": [\"$address\", [\"$module_base64\"], \"$gas_id\", 10000]}"

# fire the request
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

From the result we will keep the tx_bytes. (If you are unsure what is happening check [Example 3](Example_3_Split_Coin.md)).
We need to call `sui_executeTransaction` now that we have the `tx_bytes` in order to finalize the process.
Remember that `sig_scheme` is either `ED25519` or `Secp256k1`, depending on what you chose when you created your address and it can be checked with `sui keytool list`.

```sh
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAAQHMA6Ec6wsFAAAACgEACAIIEAMYKQRBBAVFLAdxfQjuASgKlgISDKgCcg2aAwYAAAEBAQIBAwAECAAABQwAAwYCAAENBAAABwABAAAIAgMAAAkCAwAACgQBAAALBQMAAQ4ABwADDwgJAAICCgEBCAcGBwsBBwgCAAEGCAEBAwUHCAADAwUHCAIBBggAAQgAAQgDAQYIAgEFAgkABQEIAQlteV9tb2R1bGUGb2JqZWN0CHRyYW5zZmVyCnR4X2NvbnRleHQFRm9yZ2UFU3dvcmQJVHhDb250ZXh0BGluaXQFbWFnaWMIc3RyZW5ndGgMc3dvcmRfY3JlYXRlDnN3b3Jkc19jcmVhdGVkAmlkA1VJRANuZXcGc2VuZGVyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgACAgwIAwsDAQIDDAgDCAMJAwAAAAAGCwoAEQUGAAAAAAAAAAASAAwBCwELAC4RBjgAAgEBAAABBAsAEAAUAgIBAAABBAsAEAEUAgMBBAALEgsEEQULAQsCEgEMBQsFCwM4AQoAEAIUBgEAAAAAAAAAFgsADwIVAgQBAAABBAsAEAIUAgEBAQIAAQD8CL+O/MPbNiGKmjFf9segvw09EunIWn9JwNBlJoVpDb1VL+F6g70uAwAAAAAAAAAgzMc4fVHWOg4vVMa8l1JM4erSJKxz7I8BlluS5dWKoZEBAAAAAAAAABAnAAAAAAAA"

# get the signature and pub_key
sui keytool sign --address "$address" --data "$tx_bytes"
# INFO sui::keytool: Address : 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
# INFO sui::keytool: Flag Base64: AA==
# INFO sui::keytool: Public Key Base64: R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY=
# INFO sui::keytool: Signature : 73nBz+KZ3ppddt/gc4KBWePE6maYlwgpIgqozSkd4V6HkyFJt2NRy/oD82to8HnlDzzDECNgATSM2YyNDx9fBw==

signature="73nBz+KZ3ppddt/gc4KBWePE6maYlwgpIgqozSkd4V6HkyFJt2NRy/oD82to8HnlDzzDECNgATSM2YyNDx9fBw=="
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="
# scheme is either ED25519 or Secp256k1
scheme="ED25519"

# prepare data
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# fire
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

## Response

Success!:

```JSON
{
    // ...
    "created": [
                {
                    "owner": {
                        "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                    },
                    "reference": {
                        "objectId": "0xeb8e4a532d09c596564f1c48b17f8ca4b339dbda", // our new Forge Object
                        "version": 1,
                        "digest": "Bp1deLh2HeD/m0CdW659evPsE8Hr/ynxQMGfFq9+Aaw="
                    }
                },
                {
                    "owner": "Immutable",
                    "reference": {
                        "objectId": "0x9238689c6c14db84519686958643bf47de13e54e", // our new package
                        "version": 1,
                        "digest": "xXms6tXr52jaiHfCeVeUmgjTqPGWGrUan8cFzHjw3NA="
                    }
                }
    ]
    // ...
}
```

A new object and a new package appeared on the Sui ledger. As explained by the comments in the JSON above, with one glance we can tell which is the Forge object and which is the package. The package contains the functions to create swords and get sword info, the Forge object was created because the package's init function instructed to do so. The init function is run only once, right after our successful publish.

# What's next

Next let's [mint](Example_5_Function_Call.md) some swords to raise some mayhem! 
