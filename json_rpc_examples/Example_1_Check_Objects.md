# Example 1 - Check Objects owned by address

We will check the objects under an address in this example.<br/>
This is a simple example with just one read call that does not require gas.

In order to get started lets bind some variables we will need, the rpc server address and the our address we will be using. The latter will differ for you so make sure you use your own. We can check it using `sui client active-address`.

```sh
rpc="https://fullnode.devnet.sui.io:443"
# get our address
sui client active-address
 # 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
 address="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
```

## Fill up with test SUI Coins 
Let's fill the address with some SUI, in case you lack them. Join our discord channel <a href="https://discord.gg/sui">https://discord.gg/sui</a> and after the verification is done check the faucet channel <a href="https://discord.com/channels/916379725201563759/971488439931392130">devnet-faucet</a> and type `!faucet <address>` in the channel where address is your new address.

## Make the call

We are ready now to check how many SUI we have. The RPC call is named <a href="https://docs.sui.io/sui-jsonrpc#sui_getObjectsOwnedByAddress">`sui_getObjectsOwnedByAddress`</a>. <br/>
We will first write the JSON and save it into a variable and after that we will make the call to see what we get.

```sh
data="{\"jsonrpc\": \"2.0\", \"method\": \"sui_getObjectsOwnedByAddress\", \"id\": 1, \"params\": [\"$address\"]}"
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

We saved the result in a random `result.json` file so we can inspect it more easily. It will be more convenient if you use a JSON formatter.

## Inspect the result

The result in our case is:

```JSON
{
    "jsonrpc": "2.0",
    "result": [
        {
            "objectId": "0x91be7b2c011125f748c308872d00c8f200cabe15",
            "version": 1,
            "digest": "Zusbw800Wk4+vpkei8JQD+EJiQEf8PvmdIQokHwX0N0=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "B2015vW4kYmFXLsBw/njGWUOQHdmszg8jsdygrUFTPw="
        },
        {
            "objectId": "0x9f0afe6a6c3d72d281003b6f87ea84703113744c",
            "version": 1,
            "digest": "m0M5XSe4MLQWsz1mAPFAH8iztx8VHnZPNqYtCb4fc1k=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "3DEKooZaVHWiMrdjMb8e1h2kx2J+M9Yu5uJy2CHmgJ4="
        },
        {
            "objectId": "0xb2a2f77bbddb5c9c84a2abbfdd282d609274f96b",
            "version": 1,
            "digest": "w3U7ZJsnpcLB+NPiFTGrOz58I/a9TRz0YPGFRPdjm6o=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "E5CGmStqkRq7fB6MPwLx5MBbR8MNtzFEiNVRnfNL3s8="
        },
        {
            "objectId": "0xbb2d9b82ecc54012640d3cef122de4f394f8aa15",
            "version": 1,
            "digest": "dvRriMle+XIC9WHN0nEj+KD5rPWhLYBeXeFLAeCDSu8=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "bKioOVWJBniAlT1SlVUsspIiDDZABS+nvROSu3/RZmA="
        },
        {
            "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
            "version": 1,
            "digest": "BptpMcUxbtjN0D9CGvtqSwS9odmEfW9pho+aIF/MiA4=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "lBnZ6OXExGfd0C5EzCLlR2gXAT/aTn0EnOvwF5KJEOU="
        }
    ],
    "id": 1
}
```
## Observations

With the big output we can reach several conclusions. We can see that each object in the result has an `objectId`. This `objectId` is the UID mentioned previously. It is unique for each object in the Sui network. We can see the type `0x2::coin::Coin<0x2::sui::SUI`, `0x2` address contains packages that are helpful to Sui like the SUI Coin module, the transfer function, the tx_context module etc...

Thus `0x2::sui::SUI` is a SUI token. It is worthwhile to note that any user can make a SUI Token, but that token will have the package it was created from in its type, eg: `0xe9c85a7f49c0d0111185690dbd552fe17a83bd2e:sui:SUI`. This token, of course cannot be used for gas, only the type `0x2::sui::SUI` can.

The owner is our address and every object has a `previousTransaction` field. The number of transactions an object has been through can be seen from `"version": 1`, all our coins are freshly minted by faucet so their version is 1, they have experienced a single transaction so far.

## What's next

In [Example 2](Example_2_Check_Object_Details) we will look into a coin object to get more information about it,
