This example will show how to mint a custom coin and send it at an address of our choice.

## Getting started

First we uploaded a <a href="https://github.com/Eis-D-Z/Sui_Interactions_Examples/tree/master/move/coin_example"> contract </a> that defines a coin named SHIVE, with the sui cli. First we move in the directory of the contract, the directory that holds the `Move.toml` file and the command is:
`sui client publish --gas-budget 4000`

The response will show us the new objects that were created, that is the package, the treasureCap which we need to mint, and metadata.

```
----- Certificate ----
Transaction Hash: TransactionDigest(Dn6488LC4VFzKpyXBfjtoGGtfuBqCHi2jsYWfWEZFA4m)
Transaction Signature: [Signature(AA==@v/iVgVbbjreSPVVB+tKL1DxnGfPysrsp4gqHazlsFL3Fq7zj0FbautqgTZrLFzVKHNC1N7UWB7iRpbdAmd0uCg==@YlOvd5XaBOxw4xjAzRqyNLMnH0gCEN8NUsUww3MtHYs=)]
Signed Authorities Bitmap: RoaringBitmap<[0, 2, 3]>
Transaction Kind : Publish
Sender: 0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2
Gas Payment: Object ID: 0xc7e5500000000000000000000000000000000000, version: 0x1, digest: o#Gx1zjcUVea+mujvR8noRXrYvyVYqYDfqUJmrjInabws=
Gas Owner: 0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2
Gas Price: 1
Gas Budget: 4000
----- Transaction Effects ----
Status : Success
Created Objects:
  - ID: 0x9fd47945c1a271d4f24d7f41a76bb547646e0576 , Owner: Immutable
  - ID: 0xa49ad0091d87c736e3de8d096a296d1c2db68ca5 , Owner: Account Address ( 0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2 )
  - ID: 0xfb71c32a2a7a36fc0fa044f6ac87276705bd8c41 , Owner: Account Address ( 0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2 )
Mutated Objects:
  - ID: 0xc7e5500000000000000000000000000000000000 , Owner: Account Address ( 0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2 )
```

The package is always an immutable object, thus we can determine that it's id is `0x9fd47945c1a271d4f24d7f41a76bb547646e0576`, the other two created objects are the treasuryCap with id `0xa49ad0091d87c736e3de8d096a296d1c2db68ca5` and the other is the metadata that holds coin info.

## Minting a coin

Next we will mint a SHIVE coin of value 3301 and send it to address `0x6d94aeff6f16f1dc326be9865aa5ec14d2fb6f36`. Remember that Sui is object-centric, so coins are distinct objects with a value attached to them, much like $ banknotes are distinct objects with a $value attached to them.

```sh
signer="0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2" # our address
rpc="https://fullnode.devnet.sui.io:443" # devnet fullnode address
recipient="0x6d94aeff6f16f1dc326be9865aa5ec14d2fb6f36"
package="0x2" # address reserved for the Sui library modules, including coin
module="coin"
function="mint_and_transfer"
type_args="[\"0x9fd47945c1a271d4f24d7f41a76bb547646e0576::shive::SHIVE\"]"
cap="0xa49ad0091d87c736e3de8d096a296d1c2db68ca5" # treasuryCap which allows only its onwer to mint
args="[\"$cap\", \"3301\", \"$recipient\"]"
gas="0xc7e5500000000000000000000000000000000050" # gas object id

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_moveCall\", \"params\": [\"$signer\", \"$package\", \"$module\", \"$function\", $type_args, $args, \"$gas\", 5000]}"

curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

The result we get is:

```JSON
{
  "jsonrpc": "2.0",
  "result": {
    "txBytes": "AAIAAAAAAAAAAAAAAAAAAAAAAAAAAgRjb2luEW1pbnRfYW5kX3RyYW5zZmVyAQef1HlFwaJx1PJNf0Gna7VHZG4FdgVzaGl2ZQVTSElWRQADAQCkmtAJHYfHNuPejQlqKW0cLbaMpQIAAAAAAAAAIJbRtXxz8ea1TKZ7G2aMD247p1Bby81/GHonlwJRP/YgAAjlDAAAAAAAAAAUbZSu/28W8dwya+mGWqXsFNL7bzaji8KqY8NON4Ifers0276Xt6suosflUAAAAAAAAAAAAAAAAAAAAABQAQAAAAAAAAAggfDN66kW6QGu/zyFEOupOCvefJZk2V+hcOuzzWME0juji8KqY8NON4Ifers0276Xt6suogEAAAAAAAAAiBMAAAAAAAA=",
    "gas": {
      "objectId": "0xc7e5500000000000000000000000000000000050",
      "version": 1,
      "digest": "gfDN66kW6QGu/zyFEOupOCvefJZk2V+hcOuzzWME0js="
    },
    "inputObjects": [
      {
        "ImmOrOwnedMoveObject": {
          "objectId": "0xa49ad0091d87c736e3de8d096a296d1c2db68ca5",
          "version": 2,
          "digest": "ltG1fHPx5rVMpnsbZowPbjunUFvLzX8YeieXAlE/9iA="
        }
      },
      { "MovePackage": "0x0000000000000000000000000000000000000002" },
      { "MovePackage": "0x9fd47945c1a271d4f24d7f41a76bb547646e0576" },
      {
        "ImmOrOwnedMoveObject": {
          "objectId": "0xc7e5500000000000000000000000000000000050",
          "version": 1,
          "digest": "gfDN66kW6QGu/zyFEOupOCvefJZk2V+hcOuzzWME0js="
        }
      }
    ]
  },
  "id": 1
}
```

In order to complete the transaction we need the txBytes, sign them and then use the `sui_executeTransaction` call.

```bash
tx_bytes="AAIAAAAAAAAAAAAAAAAAAAAAAAAAAgRjb2luEW1pbnRfYW5kX3RyYW5zZmVyAQef1HlFwaJx1PJNf0Gna7VHZG4FdgVzaGl2ZQVTSElWRQADAQCkmtAJHYfHNuPejQlqKW0cLbaMpQIAAAAAAAAAIJbRtXxz8ea1TKZ7G2aMD247p1Bby81/GHonlwJRP/YgAAjlDAAAAAAAAAAUbZSu/28W8dwya+mGWqXsFNL7bzaji8KqY8NON4Ifers0276Xt6suosflUAAAAAAAAAAAAAAAAAAAAABQAQAAAAAAAAAggfDN66kW6QGu/zyFEOupOCvefJZk2V+hcOuzzWME0juji8KqY8NON4Ifers0276Xt6suogEAAAAAAAAAiBMAAAAAAAA="

# get the signature
sui keytool sign --address "$signer" --data "$tx_bytes"
# Signer address: 0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2
# Raw tx_bytes to execute: AAIAAAAAAAAAAAAAAAAAAAAAAAAAAgRjb2luEW1pbnRfYW5kX3RyYW5zZmVyAQef1HlFwaJx1PJNf0Gna7VHZG4FdgVzaGl2ZQVTSElWRQADAQCkmtAJHYfHNuPejQlqKW0cLbaMpQIAAAAAAAAAIJbRtXxz8ea1TKZ7G2aMD247p1Bby81/GHonlwJRP/YgAAjlDAAAAAAAAAAUbZSu/28W8dwya+mGWqXsFNL7bzaji8KqY8NON4Ifers0276Xt6suosflUAAAAAAAAAAAAAAAAAAAAABQAQAAAAAAAAAggfDN66kW6QGu/zyFEOupOCvefJZk2V+hcOuzzWME0juji8KqY8NON4Ifers0276Xt6suogEAAAAAAAAAiBMAAAAAAAA=
# Intent: Intent { scope: TransactionData, version: V0, app_id: Sui }
# Intent message to sign: "AAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAgRjb2luEW1pbnRfYW5kX3RyYW5zZmVyAQef1HlFwaJx1PJNf0Gna7VHZG4FdgVzaGl2ZQVTSElWRQADAQCkmtAJHYfHNuPejQlqKW0cLbaMpQIAAAAAAAAAIJbRtXxz8ea1TKZ7G2aMD247p1Bby81/GHonlwJRP/YgAAjlDAAAAAAAAAAUbZSu/28W8dwya+mGWqXsFNL7bzaji8KqY8NON4Ifers0276Xt6suosflUAAAAAAAAAAAAAAAAAAAAABQAQAAAAAAAAAggfDN66kW6QGu/zyFEOupOCvefJZk2V+hcOuzzWME0juji8KqY8NON4Ifers0276Xt6suogEAAAAAAAAAiBMAAAAAAAA="
# Serialized signature (`flag || sig || pk` in Base64): "AEmArFOb9o+WfBpKl3fWDJxkluw0dsZDHwbz7cd/Vg9rBv+4ozKzmAt10FDeGK3GX3rs1AK+6mcvAIzaMPfBtQJiU693ldoE7HDjGMDNGrI0sycfSAIQ3w1SxTDDcy0diw=="

# we get the serialized signature from the response above
signature="AEmArFOb9o+WfBpKl3fWDJxkluw0dsZDHwbz7cd/Vg9rBv+4ozKzmAt10FDeGK3GX3rs1AK+6mcvAIzaMPfBtQJiU693ldoE7HDjGMDNGrI0sycfSAIQ3w1SxTDDcy0diw=="
request_type="WaitForLocalExecution"

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\",\"$signature\",\"$request_type\"]}"

curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result1.json
```

From the response we can see in `created` that a new object was created with id `0xb1587d6a42632b8e90f5811ba86cb23c1ff7f425`, this is the newly minted SHIVE coin. A check in the explorer will confirm that its value is 3301.

```JSON
"created": [
          {
            "owner": {
              "AddressOwner": "0x6d94aeff6f16f1dc326be9865aa5ec14d2fb6f36"
            },
            "reference": {
              "objectId": "0xb1587d6a42632b8e90f5811ba86cb23c1ff7f425",
              "version": 3,
              "digest": "3+vSZ+S/Pe3gBM4dGi0GPVhsmlla+7OgJkYVdp9lsDw="
            }
          }
        ],
```

