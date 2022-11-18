# Example 6 Transfer Object

In this example we will transfer the sword created in [Example 5](Example_5_Function_Call) with the <a href="https://docs.sui.io/sui-jsonrpc#sui_transferObject">sui_transferObject</a>.<br/>
This call works with any object (reminder: by object we mean a struct instance with ID, which makes it ownable), so you can follow along and use another object without having to go through `Example 5` first.<br/>

## Getting started

First we bind our address and the rpc url to variables, also we will bind the sword ntf object's id. The latter can be found by checking our address through the <a href="explorer.devnet.sui.io/">explorer</a> or with the 
<a href="https://docs.sui.io/sui-jsonrpc#sui_getObjectsOwnedByAddress">sui_getObjectsOwnedByAddress</a> call.

```sh
rpc="https://fullnode.devnet.sui.io:443"
# get our address
sui client active-address
 # 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
 address="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
 sword_id="0x36e8443ea817223639ef6bdd5400d2bfa1b673f2"
```
Since we want to send the object to another address we will bind that too to a variable:

```sh
friend_address="0x788a511738ad4ab1d7f769b49076d9c7b272826c"
```

## Call and execute

This call is pretty straightforward, the arguments are `signer, object_id, gas, gas_budget, recipient` where `signer` is our address and `recipient` is the address of the one who will get the object. After we get the tx_bytes from the `sui_transferObject` call we immediately proceed with the `sui_executeTransaction` call which is the procedure for any call that writes to the ledger.

```sh
# prepare the data params: [<signer>, <object_id>, <gas>, <gas_budget>, <recipient>]
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_transferObject\", \"params\": [\"$address\", \"$sword_id\", \"$gas_id\", 10000, \"$friend_address\"]}"

# send our transaction to be validated
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json

# get the tx_bytes from result.json
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAAHiKURc4rUqx1/dptJB22ceycoJsNuhEPqgXIjY572vdVADSv6G2c/IBAAAAAAAAACBOjXerDK6T7OAWyQXlo3ws63jDtwcSiypnz1k7fngnzfwIv478w9s2IYqaMV/2x6C/DT0S+hHI//7tsdRGSLOd1i2lOV/VNsoDAAAAAAAAACDh08xwMUIlEXznVO/kW9uVptN+cK351OvieMgvhlB3vgEAAAAAAAAAECcAAAAAAAA="

# get the signature
sui keytool sign --address "$address" --data "$tx_bytes"

signature="LXDnYcjFQU6boMyp+ZBbeYr1dSjcwjnXu9mEtu/yDApf/edHyNzUT4xGW6umDnc7IW539qP04wihrkyjKVF1CA=="
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="
# scheme is either ED255519 or Secp256k1 you can check with `sui keytool list`
scheme="ED25519"

# data for the execution
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# execute
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

## Success

The output in `result.json` confirms our success:

```JSON
//...
"mutated": [
    {
        "owner": {
            "AddressOwner": "0x788a511738ad4ab1d7f769b49076d9c7b272826c"
        },
        "reference": {
            "objectId": "0x36e8443ea817223639ef6bdd5400d2bfa1b673f2",
            "version": 2,
            "digest": "oNqMlWH+Eslz+7ZLVtEKddWw1UlPmPj0tQAwWRoRzYg="
        }
    }, //...
]
//...
```

The `AddressOwner` is our `$friend_address` for the sword (`object_id` same as `$sword_id`). Also the sword's version got bumped up to 2, meaning it has 
experienced two transactions. We can confirm that is correct, first transaction was when it was sent to our address when it was created (in Example 5), and 
the second transaction being this transfer just now.
