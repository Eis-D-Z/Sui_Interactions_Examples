# Example 2 Inspect the details of an Object

We will inspect a particular object to see its details using the RPC call <a href="https://docs.sui.io/sui-jsonrpc#sui_getObject">sui_getObject</a>.


## Getting started

As with [Example 1](Example_1_Check_Objects.md) we will first bind the address and rpc web address to variables.

```sh
rpc="https://fullnode.devnet.sui.io:443"
# get our address
sui client active-address
 # 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
 address="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
```

## Make the call

We will bind the JSON data into a variable and then fire the request towards the node.

```sh
# set the id as a variable
id="0x91be7b2c011125f748c308872d00c8f200cabe15"
# create the JSON
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_getObject\", \"params\": [\"$id\"]}"
# fire the request and save the result in a tmp file
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

Again we saved the result in a file to for easier inspection.

## Inspect the result

We got the following result:

```JSON
{
    "jsonrpc":"2.0",
    "result":{
        "status":"Exists",
        "details":{
            "data":{
                "dataType":"moveObject",
                "type":"0x2::coin::Coin<0x2::sui::SUI>",
                "has_public_transfer":true,
                "fields":{
                    "balance":10000000,
                    "id":{"id":"0x91be7b2c011125f748c308872d00c8f200cabe15"}
                    }
                },
        "owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},
        "previousTransaction":"8Dpc1+03kCviQRrB4hMUDT1z3bF+ZhlHtkG3RXHKuBg=",
        "storageRebate":15,
        "reference":{"objectId":"0x91be7b2c011125f748c308872d00c8f200cabe15",
        "version":1,
         "digest":"Bu5RPYiVWDDX4IshFqB8vsUdzBptTkhNK/Hm/b06wEA="}}
    },
    "id":1
}
```

## Observations

As expected the standard fields are there `digest, previousTransaction, owner, version`, and some new fields, the important ones being inside `result`.
The `type` field is there, unsurprisingly, same as before, in the `fields` field we see `"balance": 10000000` which means that his SUI Coin object's value is 10.000.000 MIST. Remember that 1 SUI = 10^9 MIST.

 The faucet provided us with 5 such objects and you can check each one of them to see their balance.

## What's next

Some modules might require a SUI Coin with an exact balance. In this case we must split a coin that we own so we can obtain one with matching balance.
In [Example 3](Example_3_Split_Coin) we check how's that done.
