# Walkthrough

Welcome to the JSON RPC example walkthrough. We assume you already have an empty address. We will be using curl and of course, if javascript is more comfortable, you can easilly follow the examples with it through fetch calls or axios (or something similar).
At some point git will be needed to get some ready made code from the net.

Sui will be the network and SUI will mean the token.

All the commands that follow are meant for a bash terminal.
Let's first make sure the address exists and add it to a variable so we can type a bit a less:

```sh
 sui client active-address
 # 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
 address="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
```

Here `0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12` is the address we will use, if the sui command does not return an address please follow the instructions <a href="https://docs.sui.io/build/devnet">here</a> to connect to the Sui network and get one. If you choose a local installation then proceed to also get some SUI.

Let's fill the address with some SUI. Join our discord channel <a href="https://discord.gg/sui">https://discord.gg/sui</a> and after the verification is done check the faucet channel <a href="https://discord.com/channels/916379725201563759/971488439931392130">devnet-faucet</a> and type `!faucet <address>` in the channel where address is your new address.

Lastly we will also bind the devnet rpc server URL to a variable:

```sh
rpc="https://fullnode.devnet.sui.io:443"
```

Now we are ready to do our first call and see the coins we own.

## 1st call, check the objects our address owns

In Sui everything is an object. Sui is object-centric and every item (object) owns a UID. We will soon see that we own 5 objects which contain an ammount of SUI tokens. In case of SUI tokens it is easy to think of each COIN object as SUI banknotes, so we actually have 5 banknotes and we will later check their denomination. It is worth noting that there are some implications. If we want to tranfer a SUI amount that is less than the denominated value we have to get change, that is to split our banknote in smaller denominations. If we want to send 20.000 SUI but we have 5 banknotes of 10.000.000, then we must split a 10.000.000 banknote into a 980.000 SUI banknote and 20.000 SUI banknote. We then can transfer the latter, but in the process we created two new Sui objects (and deleted the initial) In many cases this happens automatically but it is very usefull to keep in mind.

We are ready now to check how many SUI we have. This will be the first RPC call, the method is called <a href="https://docs.sui.io/sui-jsonrpc#sui_getObjectsOwnedByAddress">`sui_getObjectsOwnedByAddress`</a>.
We will first write the JSON and save it into a variable and after that we will make the call to see what we get.

```sh
data="{\"jsonrpc\": \"2.0\", \"method\": \"sui_getObjectsOwnedByAddress\", \"id\": 1, \"params\": [\"$address\"]}"
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc
```

The JSON response should look like:

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

Here we formatted the output a bit, the initial one is quite hard to read. From now on we will save the output to a temporary JSON file to get it formatted and readable.

We the big output we can reach several conclusions. We can see that each object in the result has an `objectId`. This `objectId` is the UID mentioned previously. It is unique for each object in the Sui network. We can see the type `0x2::coin::Coin<0x2::sui::SUI`, `0x2` address contains ??? packages that are native to Sui like the SUI Coin module, the transfer function, the TxContext global object etc... Thus `0x2::sui::SUI` is a SUI token. The owner is the address and every object has a `previousTransaction` field. The number of transactions an object has been through can be seen from `"version": 1`, all our coins are freshly minted by faucet so their version is 1, they have experienced a single transaction so far.

## 2nd Example, check the details of an Object

Now let's check the <a href="https://docs.sui.io/sui-jsonrpc#sui_getObject">`objectId`</a> for one of the previously returned coins and check more details about it using the `sui_getObject` method.

```sh
# set the id as a variable
id="0x91be7b2c011125f748c308872d00c8f200cabe15"
# create the JSON
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_getObject\", \"params\": [\"$id\"]}"
# fire the request and save the result in a tmp file
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

And here is the response when we open the file:
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

As expected the standard fields are there `digest, previousTransaction, owner, version`, and some new fields, the important ones being inside `result`.
The `type` field is there, unsurprisingly, same as before, in the `fields` field we see `"balance": 10000000` which means that his SUI Coin object's value is 10.000.000 SUI's. The faucet provided us with 5 such objects and you can check each one of them to see their balance is the same.

As we mentioned, when you want to acquire another object that is priced in SUI, then you need to send a Coin Object with the exact balance as its price, plus we need to provide a Coin Object from where gas will be subtracted.

Let's see how can we prepare this manually.

## 3rd Example, split a SUI Coin object

We will use the <a href="https://docs.sui.io/sui-jsonrpc#sui_splitCoin">`sui_splitCoin`</a> method to split our Coin object into 9999 SUI and 990001 SUI, two objects. This is a transaction, as such it will require some gas to be offered. In this instance we will use another Coin Object (and we will be using this object consistently for this purpose), let's pick the one with id `0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e`. 

Binding this id to a variable:

```sh
gas_id="0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e"
```

For now we will ignore the `gas_budget` field by setting a large budget that ensures our transaction will go through. Soon we will see how we can check the gas price reference so we can fine tune our transactions.

The params for the request are `signer, coin_object_id, split_amounts, gas, gas_budget`. `gas` means the Coin object to subtract gas from.
This is our data part of the curl request:

```sh
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_splitCoin\", \"params\": [\"$address\", \"$id\", [9999], \"$gas_id\", 100000]}"
```
The call
```sh
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

And the result:

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "txBytes": "VHJhbnNhY3Rpb25EYXRhOjoAAgAAAAAAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAg61Q+9Nb1tpyLqvfx3DAp0d2s+c64rNfj1WaiqXiqd08DcGF5CXNwbGl0X3ZlYwEHAAAAAAAAAAAAAAAAAAAAAAAAAAIDc3VpA1NVSQACAQCRvnssAREl90jDCIctAMjyAMq+FQEAAAAAAAAAIGbrG8PNNFpOPr6ZHovCUA/hCYkBH/D75nSEKJB8F9DdAAkBDycAAAAAAAD8CL+O/MPbNiGKmjFf9segvw09EunIWn9JwNBlJoVpDb1VL+F6g70uAQAAAAAAAAAgBptpMcUxbtjN0D9CGvtqSwS9odmEfW9pho+aIF/MiA4BAAAAAAAAAKCGAQAAAAAA",
        "gas": {
            "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
            "version": 1,
            "digest": "BptpMcUxbtjN0D9CGvtqSwS9odmEfW9pho+aIF/MiA4="
        },
        "inputObjects": [
            {
                "ImmOrOwnedMoveObject": {
                    "objectId": "0x91be7b2c011125f748c308872d00c8f200cabe15",
                    "version": 1,
                    "digest": "Zusbw800Wk4+vpkei8JQD+EJiQEf8PvmdIQokHwX0N0="
                }
            },
            {
                "MovePackage": "0x0000000000000000000000000000000000000002"
            },
            {
                "ImmOrOwnedMoveObject": {
                    "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
                    "version": 1,
                    "digest": "BptpMcUxbtjN0D9CGvtqSwS9odmEfW9pho+aIF/MiA4="
                }
            }
        ]
    },
    "id": 1
}
```
This response is a bit weird. The main point here is that our request is just a request to get the transaction bytes which the virtual machine understands and can execute.This means our initial intent to split the Coin object has not been realized yet, we just got the tx_bytes which we will supply to the `sui_executeTransaction` method, the one that will actually do the job. This is the standard procedure when using directly the RPC for any type of transaction that mutates objects (not a get request)

If we check the params for the `sui_executeTransaction` we see some new params: `sig_scheme, signature, pub_key, request_type`.
To get these we need to use the `sui keytool` from the sui CLI, the command is `sui keytool sign --address <owner_addres> --data <tx_bytes>`.

```sh
# for clarity bind the transactions bytes to a variable
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAAgAAAAAAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAg61Q+9Nb1tpyLqvfx3DAp0d2s+c64rNfj1WaiqXiqd08DcGF5CXNwbGl0X3ZlYwEHAAAAAAAAAAAAAAAAAAAAAAAAAAIDc3VpA1NVSQACAQCRvnssAREl90jDCIctAMjyAMq+FQEAAAAAAAAAIGbrG8PNNFpOPr6ZHovCUA/hCYkBH/D75nSEKJB8F9DdAAkBDycAAAAAAAD8CL+O/MPbNiGKmjFf9segvw09EunIWn9JwNBlJoVpDb1VL+F6g70uAQAAAAAAAAAgBptpMcUxbtjN0D9CGvtqSwS9odmEfW9pho+aIF/MiA4BAAAAAAAAAKCGAQAAAAAA"

sui keytool sign --address "$address" --data "$tx_bytes"
# INFO sui::keytool: Address : 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
# INFO sui::keytool: Flag Base64: AA==
# INFO sui::keytool: Public Key Base64: R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY=
# INFO sui::keytool: Signature : 6LARTREvuT81FxtJPUI9XqoWLlNUTc3yg3yG6i3va3XhDi9WlIgu1ZXmC88VUD3fMeW5EUOh81DU8bLILXoTBw==
```
The `sig_scheme` is the digital signature scheme chosen at address creation, by default is ED25519. 
The `request_type` can be one of `ImmediateReturn, WaitForTxCert, WaitForEffectsCert, WaitForLocalExecution`, and it sets how much info we want to get back in the response. If we are in a hurry (programmatically because practically everything happens very fast) we can choose `ImmediateReturn` but in this case we will choose the last `WaitForLocalExecution` with which we'll get a complete return info. 

Now we have all the necessary params' values to execute a transaction:

```sh
# bind first to variables
signature="6LARTREvuT81FxtJPUI9XqoWLlNUTc3yg3yG6i3va3XhDi9WlIgu1ZXmC88VUD3fMeW5EUOh81DU8bLILXoTBw=="
scheme="ED25519"
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="

# form the payload
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# fire the request
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

The response is long and verbose:

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "EffectsCert": {
            "certificate": {
                "transactionDigest": "PEGLG0dsS+4qPX6Qu77l2HauyB3eKsTfZoLExPp0GfU=",
                "data": {
                    "transactions": [
                        {
                            "Call": {
                                "package": {
                                    "objectId": "0x0000000000000000000000000000000000000002",
                                    "version": 1,
                                    "digest": "61Q+9Nb1tpyLqvfx3DAp0d2s+c64rNfj1WaiqXiqd08="
                                },
                                "module": "pay",
                                "function": "split_vec",
                                "typeArguments": [
                                    "0x2::sui::SUI"
                                ],
                                "arguments": [
                                    "0x91be7b2c011125f748c308872d00c8f200cabe15",
                                    [
                                        9999
                                    ]
                                ]
                            }
                        }
                    ],
                    "sender": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12",
                    "gasPayment": {
                        "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
                        "version": 1,
                        "digest": "BptpMcUxbtjN0D9CGvtqSwS9odmEfW9pho+aIF/MiA4="
                    },
                    "gasBudget": 100000
                },
                "txSignature": "AOiwEU0RL7k/NRcbST1CPV6qFi5TVE3N8oN8huot72t14Q4vVpSILtWV5gvPFVA93zHluRFDofNQ1PGyyC16EwdH3TggoxAdtQsYj7yDdoo2d1kdxds7cVJGhkXdCylydg==",
                "authSignInfo": {
                    "epoch": 0,
                    "signature": "kU/ZpPuirQw+UzEE2FjsAdQD70SMEYF67S0DZR2yy5Ns673/ws/RbOM8uSm3wkhQ",
                    "signers_map": [
                        58,
                        48,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        2,
                        0,
                        16,
                        0,
                        0,
                        0,
                        0,
                        0,
                        2,
                        0,
                        3,
                        0
                    ]
                }
            },
            "effects": {
                "transactionEffectsDigest": "asC3MKdc8nDhlkeMthWiSZdRRNOq4Gi0bZijA+Nlu3Y=",
                "effects": {
                    "status": {
                        "status": "success"
                    },
                    "gasUsed": {
                        "computationCost": 557,
                        "storageCost": 45,
                        "storageRebate": 30
                    },
                    "transactionDigest": "PEGLG0dsS+4qPX6Qu77l2HauyB3eKsTfZoLExPp0GfU=",
                    "created": [
                        {
                            "owner": {
                                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                            },
                            "reference": {
                                "objectId": "0x0f848b589fe7727a628359c26bf880c9efb1de3b",
                                "version": 1,
                                "digest": "FmBwMRf+r1QlTf3XXBYizElY++W4w19tjeSLmTDpgbI="
                            }
                        }
                    ],
                    "mutated": [
                        {
                            "owner": {
                                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                            },
                            "reference": {
                                "objectId": "0x91be7b2c011125f748c308872d00c8f200cabe15",
                                "version": 2,
                                "digest": "fVd5rvaR2AafWKtjLO1nemS6Qqs1xnrHPk0RStbPK50="
                            }
                        },
                        {
                            "owner": {
                                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                            },
                            "reference": {
                                "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
                                "version": 2,
                                "digest": "w0PcNy/0pKEieoWQ/4lFx8XaomMnotSltRZMMMd4KtI="
                            }
                        }
                    ],
                    "gasObject": {
                        "owner": {
                            "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                        },
                        "reference": {
                            "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
                            "version": 2,
                            "digest": "w0PcNy/0pKEieoWQ/4lFx8XaomMnotSltRZMMMd4KtI="
                        }
                    },
                    "events": [
                        {
                            "newObject": {
                                "packageId": "0x0000000000000000000000000000000000000002",
                                "transactionModule": "pay",
                                "sender": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12",
                                "recipient": {
                                    "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                                },
                                "objectId": "0x0f848b589fe7727a628359c26bf880c9efb1de3b"
                            }
                        }
                    ],
                    "dependencies": [
                        "B2015vW4kYmFXLsBw/njGWUOQHdmszg8jsdygrUFTPw=",
                        "lBnZ6OXExGfd0C5EzCLlR2gXAT/aTn0EnOvwF5KJEOU="
                    ]
                },
                "authSignInfo": {
                    "epoch": 0,
                    "signature": "gp4NdTfonxPet2v+v2gdEmBhLs7Ii7zZ6UmSjKvuv8h7KxFtWZaMqVamk9QXiL9f",
                    "signers_map": [
                        58,
                        48,
                        0,
                        0,
                        1,
                        0,
                        0,
                        0,
                        0,
                        0,
                        2,
                        0,
                        16,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        0,
                        3,
                        0
                    ]
                }
            },
            "confirmed_local_execution": true
        }
    },
    "id": 1
}
```

We can see in the `effects` field that we were successful, we can see a mutated object with the id of the initial coin, its version got bumped up to 2 meaning that it has experienced two transactions and we also have a newly created object with id: `0x0f848b589fe7727a628359c26bf880c9efb1de3b==`.
If we check it with `sui_getObject` we see:

```JSON
"result": {
        "status": "Exists",
        "details": {
            "data": {
                "dataType": "moveObject",
                "type": "0x2::coin::Coin<0x2::sui::SUI>",
                "has_public_transfer": true,
                "fields": {
                    "balance": 9999,
                    "id": {
                        "id": "0x0f848b589fe7727a628359c26bf880c9efb1de3b=="
                    }
                }
            }, // ...
        } // ...
}            
```
We can confirm that we own a 9999 worth of SUI Coin object. If we check all our owned objects (example 1) we can see the other two coins that changed with balance `9990001` SUI and the other with `9999428` SUI. The latter is the one that was used to pay for the gas.

We will explore the other `request_type`'s next and we will see how we can subscribe to events so we can know what's happening with our transactions.


## 4th example Merge two coins

In this example we will merge two coins to check the rebate we get. In the previous example, under `effects` we can see exactly how much gas we paid (the values should be taken with a grain of salt since the algorithms are yet to be finilized). It also included a `storage_rebate` value. This is the ammount we will get back when we delete this Object. For Coin objects the reasonable way to go about deleting them is merging them with other coins. This is the equivalent of exchanging our banknotes for larger denominations.
We will choose our initial coin, whose address we bound to the `$id` variable and let's pick the second in row coin which is untouched.

The end result should be that the second object is no more and we only have our first Coin object with a larger balance and the same id.

```sh
# bind the id of the second coin
id2="0x9f0afe6a6c3d72d281003b6f87ea84703113744c"
```

The method is `sui_mergeCoind` and the procedure is the same, but this time the `request_type` will be `ImmediateReturn` for when we execute the transaction. We will then use the transaction digest and the `sui_getTransaction` to further see what happened to the execution. Some outputs will be ommited since we have already seen how they look like and we will focus on the new ones mainly.

```sh
# prepare data for the sui_mergeCoins method
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_mergeCoins\", \"params\": [\"$address\", \"$id\", \"$id2\", \"$gas_id\", 1000]}"

# fire the request
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json

# get the tx_bytes from the result
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAAgAAAAAAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAg61Q+9Nb1tpyLqvfx3DAp0d2s+c64rNfj1WaiqXiqd08DcGF5BGpvaW4BBwAAAAAAAAAAAAAAAAAAAAAAAAACA3N1aQNTVUkAAgEAkb57LAERJfdIwwiHLQDI8gDKvhUCAAAAAAAAACB9V3mu9pHYBp9Yq2Ms7Wd6ZLpCqzXGesc+TRFK1s8rnQEAnwr+amw9ctKBADtvh+qEcDETdEwBAAAAAAAAACCbQzldJ7gwtBazPWYA8UAfyLO3HxUedk82pi0Jvh9zWfwIv478w9s2IYqaMV/2x6C/DT0S6chaf0nA0GUmhWkNvVUv4XqDvS4CAAAAAAAAACDDQ9w3L/SkoSJ6hZD/iUXHxdqiYyei1KW1Fkwwx3gq0gEAAAAAAAAA6AMAAAAAAAA="

# get the exectute data
sui keytool sign --address "$address" --data "$tx_bytes"
# INFO sui::keytool: Address : 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
# INFO sui::keytool: Flag Base64: AA==
# INFO sui::keytool: Public Key Base64: R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY=
# INFO sui::keytool: Signature : HIP5rNVmmvlCVq6nwvd2Ls7Uu9zUGyvw8T6+1N0LAmph123cX+bG2fsqyYcVpyT0imQZooSxNsac+89HsZVcCA==

# the public key and the scheme are the same
signature="HIP5rNVmmvlCVq6nwvd2Ls7Uu9zUGyvw8T6+1N0LAmph123cX+bG2fsqyYcVpyT0imQZooSxNsac+89HsZVcCA=="

# prepare to execute the transaction
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"ImmediateReturn\"]}"

# request exectution
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```
We check the response:

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "ImmediateReturn": {
            "tx_digest": "IuqUhuwnSp1LbJvWG8X9zbdl5LdiViJucAQb+KgYh2A="
        }
    },
    "id": 1
}
```

The `tx_digest` is what we need:

```sh
tx_digest="IuqUhuwnSp1LbJvWG8X9zbdl5LdiViJucAQb+KgYh2A="

# prepare the data for the sui_getTransaction
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_getTransaction\", \"params\": [\"$tx_digest\"}"

# send the request
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

Thus we can see the outcome of our execution:

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "certificate": {
            "transactionDigest": "IuqUhuwnSp1LbJvWG8X9zbdl5LdiViJucAQb+KgYh2A=",
            "data": {
                "transactions": [
                    {
                        "Call": {
                            "package": {
                                "objectId": "0x0000000000000000000000000000000000000002",
                                "version": 1,
                                "digest": "61Q+9Nb1tpyLqvfx3DAp0d2s+c64rNfj1WaiqXiqd08="
                            },
                            "module": "pay",
                            "function": "join",
                            "typeArguments": [
                                "0x2::sui::SUI"
                            ],
                            "arguments": [
                                "0x91be7b2c011125f748c308872d00c8f200cabe15",
                                "0x9f0afe6a6c3d72d281003b6f87ea84703113744c"
                            ]
                        }
                    }
                ],
                "sender": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12",
                "gasPayment": {
                    "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
                    "version": 2,
                    "digest": "w0PcNy/0pKEieoWQ/4lFx8XaomMnotSltRZMMMd4KtI="
                },
                "gasBudget": 1000
            },
            "txSignature": "AByD+azVZpr5Qlaup8L3di7O1Lvc1Bsr8PE+vtTdCwJqYddt3F/mxtn7KsmHFack9IpkGaKEsTbGnPvPR7GVXAhH3TggoxAdtQsYj7yDdoo2d1kdxds7cVJGhkXdCylydg==",
            "authSignInfo": {
                "epoch": 0,
                "signature": "gkRkfIQWMESYbWtpiGLU45EbBvHTq8xufmp8TJkaYGYFunYWlGf1/6DMMisKrufm",
                "signers_map": [
                    58,
                    48,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    2,
                    0,
                    16,
                    0,
                    0,
                    0,
                    0,
                    0,
                    2,
                    0,
                    3,
                    0
                ]
            }
        },
        "effects": {
            "status": {
                "status": "success"
            },
            "gasUsed": {
                "computationCost": 528,
                "storageCost": 30,
                "storageRebate": 45
            },
            "transactionDigest": "IuqUhuwnSp1LbJvWG8X9zbdl5LdiViJucAQb+KgYh2A=",
            "mutated": [
                {
                    "owner": {
                        "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                    },
                    "reference": {
                        "objectId": "0x91be7b2c011125f748c308872d00c8f200cabe15",
                        "version": 3,
                        "digest": "y3YuwQfasEHD5lamA4su5+melRJWpP3s37uNX/u7F38="
                    }
                },
                {
                    "owner": {
                        "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                    },
                    "reference": {
                        "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
                        "version": 3,
                        "digest": "zMc4fVHWOg4vVMa8l1JM4erSJKxz7I8BlluS5dWKoZE="
                    }
                }
            ],
            "deleted": [
                {
                    "objectId": "0x9f0afe6a6c3d72d281003b6f87ea84703113744c",
                    "version": 2,
                    "digest": "Y2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2M="
                }
            ],
            "gasObject": {
                "owner": {
                    "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                },
                "reference": {
                    "objectId": "0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e",
                    "version": 3,
                    "digest": "zMc4fVHWOg4vVMa8l1JM4erSJKxz7I8BlluS5dWKoZE="
                }
            },
            "events": [
                {
                    "deleteObject": {
                        "packageId": "0x0000000000000000000000000000000000000002",
                        "transactionModule": "pay",
                        "sender": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12",
                        "objectId": "0x9f0afe6a6c3d72d281003b6f87ea84703113744c"
                    }
                }
            ],
            "dependencies": [
                "PEGLG0dsS+4qPX6Qu77l2HauyB3eKsTfZoLExPp0GfU=",
                "3DEKooZaVHWiMrdjMb8e1h2kx2J+M9Yu5uJy2CHmgJ4="
            ]
        },
        "timestamp_ms": null,
        "parsed_data": null
    },
    "id": 1
}
```

The Coin object used for gas and the first Coin object have been mutated, the other Coin got deleted. We got `45` SUI as rebate and the Coin object with id `$id` now has a balance of `19990001` SUI (we can check this with `sui client gas` for ease).

## Interlude

We have already seen a couple of straightforward examples. With this experience under our belt it should be pretty straightforward to experiment with other similar methods like `sui_splitCoinEqual` or `sui_getRawObject` etc... The next examples will involve publishing a move module and use it on the blockchain. Of course this assumes an existing move module, we shall use an example module, to learn more about move and how to write modules suitable for sui please check <a href="http://examples.sui.io/">this location</a>. 

Let's get our move package, we will clone the whole sui repo and use the module `move_tutorial` in `sui/sui_programmability/examples`. (We clone the whole repo hoping that it will help you get started to explore and play with sui, we'll take it a step further and suggest you fork the repo in your github account first and clone your fork).

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
sui move build --dump-bytecode-as-base64
# ["oRzrCwUAAAAKAQAIAggQAxgpBEEEBUUsB3F9CO4BKAqWAhIMqAJyDZoDBgAAAQEBAgEDAAQIAAAFDAADBgIAAQ0EAAAHAAEAAAgCAwAACQIDAAAKBAEAAAsFAwABDgAHAAMPCAkAAgIKAQEIBwYHCwEHCAIAAQYIAQEDBQcIAAMDBQcIAgEGCAABCAABCAMBBggCAQUCCQAFAQgBCW15X21vZHVsZQZvYmplY3QIdHJhbnNmZXIKdHhfY29udGV4dAVGb3JnZQVTd29yZAlUeENvbnRleHQEaW5pdAVtYWdpYwhzdHJlbmd0aAxzd29yZF9jcmVhdGUOc3dvcmRzX2NyZWF0ZWQCaWQDVUlEA25ldwZzZW5kZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAICDAgDCwMBAgMMCAMIAwkDAAAAAAYLCgARBQYAAAAAAAAAABIADAELAQsALhEGOAACAQEAAAEECwAQABQCAgEAAAEECwAQARQCAwEEAAsSCwQRBQsBCwISAQwFCwULAzgBCgAQAhQGAQAAAAAAAAAWCwAPAhUCBAEAAAEECwAQAhQCAQEBAgABAA=="]
```


## 5th Example, Publish a package

The method is `sui_publish` and the params are pretty straightforward `sender_address, compiled_modules, gas_object, gas_budget`. The `compiled_modules` will containe the base64 mouthful we got above.

```sh
# bind the base64 output without the []
module_base64="oRzrCwUAAAAKAQAIAggQAxgpBEEEBUUsB3F9CO4BKAqWAhIMqAJyDZoDBgAAAQEBAgEDAAQIAAAFDAADBgIAAQ0EAAAHAAEAAAgCAwAACQIDAAAKBAEAAAsFAwABDgAHAAMPCAkAAgIKAQEIBwYHCwEHCAIAAQYIAQEDBQcIAAMDBQcIAgEGCAABCAABCAMBBggCAQUCCQAFAQgBCW15X21vZHVsZQZvYmplY3QIdHJhbnNmZXIKdHhfY29udGV4dAVGb3JnZQVTd29yZAlUeENvbnRleHQEaW5pdAVtYWdpYwhzdHJlbmd0aAxzd29yZF9jcmVhdGUOc3dvcmRzX2NyZWF0ZWQCaWQDVUlEA25ldwZzZW5kZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAICDAgDCwMBAgMMCAMIAwkDAAAAAAYLCgARBQYAAAAAAAAAABIADAELAQsALhEGOAACAQEAAAEECwAQABQCAgEAAAEECwAQARQCAwEEAAsSCwQRBQsBCwISAQwFCwULAzgBCgAQAhQGAQAAAAAAAAAWCwAPAhUCBAEAAAEECwAQAhQCAQEBAgABAA=="

# prepare the data
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_publish\", \"params\": [\"$address\", [\"$module_base64\"], \"$gas_id\", 10000]}"

# fire the request
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

We get the tx_bytes in the response:

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "txBytes": "VHJhbnNhY3Rpb25EYXRhOjoAAQHMA6Ec6wsFAAAACgEACAIIEAMYKQRBBAVFLAdxfQjuASgKlgISDKgCcg2aAwYAAAEBAQIBAwAECAAABQwAAwYCAAENBAAABwABAAAIAgMAAAkCAwAACgQBAAALBQMAAQ4ABwADDwgJAAICCgEBCAcGBwsBBwgCAAEGCAEBAwUHCAADAwUHCAIBBggAAQgAAQgDAQYIAgEFAgkABQEIAQlteV9tb2R1bGUGb2JqZWN0CHRyYW5zZmVyCnR4X2NvbnRleHQFRm9yZ2UFU3dvcmQJVHhDb250ZXh0BGluaXQFbWFnaWMIc3RyZW5ndGgMc3dvcmRfY3JlYXRlDnN3b3Jkc19jcmVhdGVkAmlkA1VJRANuZXcGc2VuZGVyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgACAgwIAwsDAQIDDAgDCAMJAwAAAAAGCwoAEQUGAAAAAAAAAAASAAwBCwELAC4RBjgAAgEBAAABBAsAEAAUAgIBAAABBAsAEAEUAgMBBAALEgsEEQULAQsCEgEMBQsFCwM4AQoAEAIUBgEAAAAAAAAAFgsADwIVAgQBAAABBAsAEAIUAgEBAQIAAQD8CL+O/MPbNiGKmjFf9segvw09EunIWn9JwNBlJoVpDb1VL+F6g70uAwAAAAAAAAAgzMc4fVHWOg4vVMa8l1JM4erSJKxz7I8BlluS5dWKoZEBAAAAAAAAABAnAAAAAAAA"
        //...
    } 
    //...
}
```
Now to execute the transaction:

```sh
# usual binding
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAAQHMA6Ec6wsFAAAACgEACAIIEAMYKQRBBAVFLAdxfQjuASgKlgISDKgCcg2aAwYAAAEBAQIBAwAECAAABQwAAwYCAAENBAAABwABAAAIAgMAAAkCAwAACgQBAAALBQMAAQ4ABwADDwgJAAICCgEBCAcGBwsBBwgCAAEGCAEBAwUHCAADAwUHCAIBBggAAQgAAQgDAQYIAgEFAgkABQEIAQlteV9tb2R1bGUGb2JqZWN0CHRyYW5zZmVyCnR4X2NvbnRleHQFRm9yZ2UFU3dvcmQJVHhDb250ZXh0BGluaXQFbWFnaWMIc3RyZW5ndGgMc3dvcmRfY3JlYXRlDnN3b3Jkc19jcmVhdGVkAmlkA1VJRANuZXcGc2VuZGVyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgACAgwIAwsDAQIDDAgDCAMJAwAAAAAGCwoAEQUGAAAAAAAAAAASAAwBCwELAC4RBjgAAgEBAAABBAsAEAAUAgIBAAABBAsAEAEUAgMBBAALEgsEEQULAQsCEgEMBQsFCwM4AQoAEAIUBgEAAAAAAAAAFgsADwIVAgQBAAABBAsAEAIUAgEBAQIAAQD8CL+O/MPbNiGKmjFf9segvw09EunIWn9JwNBlJoVpDb1VL+F6g70uAwAAAAAAAAAgzMc4fVHWOg4vVMa8l1JM4erSJKxz7I8BlluS5dWKoZEBAAAAAAAAABAnAAAAAAAA"

# get the signature
sui keytool sign --address "$address" --data "$tx_bytes"
# INFO sui::keytool: Address : 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
# INFO sui::keytool: Flag Base64: AA==
# INFO sui::keytool: Public Key Base64: R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY=
# INFO sui::keytool: Signature : 73nBz+KZ3ppddt/gc4KBWePE6maYlwgpIgqozSkd4V6HkyFJt2NRy/oD82to8HnlDzzDECNgATSM2YyNDx9fBw==

# more biding
signature="73nBz+KZ3ppddt/gc4KBWePE6maYlwgpIgqozSkd4V6HkyFJt2NRy/oD82to8HnlDzzDECNgATSM2YyNDx9fBw=="

# prepare data
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# fire
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

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

A new object and a new package appeared on the Sui ledger. As explained by the comments in the json above, with one glance we can tell which is the Forge object and which is the package. The package contains the functions to create swords and check them, the Forge object was created because the package's init function instructed to be so done. The init function is run only once, right after the bytecode got stored in Sui.

Next let's mint some swords to raise some mayhem!

## 6th Example, Mint swords

We will start by checking our module on the ledger with the `sui_getNormalizedMoveModule` method. This is a get method, as we have seen these methods are gas-less. We need the module id which we can get from the above result and the module name, `"my_module"` in this case.

```sh
module_id="0x9238689c6c14db84519686958643bf47de13e54e"
module_name="my_module"

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_getNormalizedMoveModule\", \"params\": [\"$module_id\",\"$module_name\"]}"

curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

The result:

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "file_format_version": 5,
        "address": "0x9238689c6c14db84519686958643bf47de13e54e",
        "name": "my_module",
        "friends": [],
        "structs": {
            "Forge": {
                "abilities": {
                    "abilities": [
                        "Key"
                    ]
                },
                "type_parameters": [],
                "fields": [
                    {
                        "name": "id",
                        "type_": {
                            "Struct": {
                                "address": "0x2",
                                "module": "object",
                                "name": "UID",
                                "type_arguments": []
                            }
                        }
                    },
                    {
                        "name": "swords_created",
                        "type_": "U64"
                    }
                ]
            },
            "Sword": {
                "abilities": {
                    "abilities": [
                        "Store",
                        "Key"
                    ]
                },
                "type_parameters": [],
                "fields": [
                    {
                        "name": "id",
                        "type_": {
                            "Struct": {
                                "address": "0x2",
                                "module": "object",
                                "name": "UID",
                                "type_arguments": []
                            }
                        }
                    },
                    {
                        "name": "magic",
                        "type_": "U64"
                    },
                    {
                        "name": "strength",
                        "type_": "U64"
                    }
                ]
            }
        },
        "exposed_functions": {
            "magic": {
                "visibility": "Public",
                "is_entry": false,
                "type_parameters": [],
                "parameters": [
                    {
                        "Reference": {
                            "Struct": {
                                "address": "0x9238689c6c14db84519686958643bf47de13e54e",
                                "module": "my_module",
                                "name": "Sword",
                                "type_arguments": []
                            }
                        }
                    }
                ],
                "return_": [
                    "U64"
                ]
            },
            "strength": {
                "visibility": "Public",
                "is_entry": false,
                "type_parameters": [],
                "parameters": [
                    {
                        "Reference": {
                            "Struct": {
                                "address": "0x9238689c6c14db84519686958643bf47de13e54e",
                                "module": "my_module",
                                "name": "Sword",
                                "type_arguments": []
                            }
                        }
                    }
                ],
                "return_": [
                    "U64"
                ]
            },
            "sword_create": {
                "visibility": "Public",
                "is_entry": true,
                "type_parameters": [],
                "parameters": [
                    {
                        "MutableReference": {
                            "Struct": {
                                "address": "0x9238689c6c14db84519686958643bf47de13e54e",
                                "module": "my_module",
                                "name": "Forge",
                                "type_arguments": []
                            }
                        }
                    },
                    "U64",
                    "U64",
                    "Address",
                    {
                        "MutableReference": {
                            "Struct": {
                                "address": "0x2",
                                "module": "tx_context",
                                "name": "TxContext",
                                "type_arguments": []
                            }
                        }
                    }
                ],
                "return_": []
            },
            "swords_created": {
                "visibility": "Public",
                "is_entry": false,
                "type_parameters": [],
                "parameters": [
                    {
                        "Reference": {
                            "Struct": {
                                "address": "0x9238689c6c14db84519686958643bf47de13e54e",
                                "module": "my_module",
                                "name": "Forge",
                                "type_arguments": []
                            }
                        }
                    }
                ],
                "return_": [
                    "U64"
                ]
            }
        }
    },
    "id": 1
}
```

We can get a lot of info from the result, under `structs` we see `Forge` and `Sword`, the forge creates the swords. The `exposed_functions` field has the functions we will call next like `sword_create, magic, strength`. Let's mint a magic katana with our forge and give it to ourselves, since the good things must be kept in house. The method is `sui_moveCall` and needs quite a lot of paramaters to work. Time to bind them to variables and prepare the data to have a clearer overview:

```sh
# signer is our $address
# the package id
package_object_id="0x9238689c6c14db84519686958643bf47de13e54e"
module="my_module"
function="sword_create"
# The type arguments and arguments can be found in the previous result under the sword_create function
type_arguments="[]"
arguments="[\"0xeb8e4a532d09c596564f1c48b17f8ca4b339dbda\", \"455\", \"999\", \"$address\"]"

# dump all variables into the data object
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_moveCall\", \"params\": [\"$address\", \"$package_object_id\", \"$module\", \"$function\", $type_arguments, $arguments, \"$gas_id\", 10000]}"

# cross fingers and fire request
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

The requests succeeds. Before we go forward to execute our transaction, let's take some time to recap the parameters of the request:

- `package_object_id` is the address / UID of the package we published unto Sui. We can see it in the `sui_getNormalizedMoveModule` response in many places, most notably, it is the value of `address`, the 2nd key of the `result` json object.
- `module` is the module name, this is needed because a package may containe more than one modules.
- `function` is the name of the function we want to run
- `type_arguments` this is being given by the function itself, when we checked the module with the `sui_getNormalizedMoveModule` we could see that under `sword_create` json object, the `type_paramaters` key has value `[]`. Guided by this here we also added an empty array.
- `arguments`: here again we refer to the result we got from the `sui_getNormalizedMoveModule` and we see that for the `sword_create` function it has a few parameters. The JSON-Move subset of JSON requires that arrays are homogenous. This `arguments` array will contain only Strings (as is usual for most Arrays in JSON RPC requests). The first argument for the function is a `mutable reference to the Forge object`, this is encoded as `id of the object` so we just put the id of the Forge that has been created previously. `Magic` and `Strength`, as seen in the parameters field (inside the `sui_getNormalizedMoveModule` result) are both `U64` (unsigned integer 64 bits), but here we write `\"455\"` and `\"999\"` as Strings, this is because the array has to be homogenous. The sui Node will translate into proper types. The last required parameter is `TxContext`, this is a special one, we omitted it, as it should be done, it is filled in by Sui when it runs the function. This holds for any function that has `Mutable Reference TxContext` (or `&mut TxContext` in move source code).

The last two arguments are the usual arguments for gas deduction.

Continuing we get the `tx_bytes` and proceed to execute the transaction.

```sh
# get tx bytes from previous result
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAApI4aJxsFNuEUZaGlYZDv0feE+VOAQAAAAAAAAAg+pryAo+gALTc0mDEz9wJ3XFmmJ4IMz131namNQmzj4MJbXlfbW9kdWxlDHN3b3JkX2NyZWF0ZQAEAQDrjkpTLQnFllZPHEixf4yksznb2gEAAAAAAAAAIIq8/a2erR0ImDILYDhh3kBL5EXVUkFo5TgCvFzOBhBqAAjHAQAAAAAAAAAI5wMAAAAAAAAAFPwIv478w9s2IYqaMV/2x6C/DT0S/Ai/jvzD2zYhipoxX/bHoL8NPRL6Ecj//u2x1EZIs53WLaU5X9U2ygIAAAAAAAAAIAM0VDf2JZIbgYIbHcUCdS/RZUWF7uxa1hVW98o9wzlcAQAAAAAAAAAQJwAAAAAAAA=="

# get the signature
sui keytool sign --address "$address" --data "$tx_bytes"

signature="BXESHr1zl9p/oAegLcAwWQq/F6ljHg+a8N2+GOphlaW44GKJAvbGV6Zjs4E0Di0ZRb7O/9HrCzXY17WJU+7sDg=="

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

And we are met with success:

```JSON
// ...
    "created": [
        {
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "reference": {
                "objectId": "0x36e8443ea817223639ef6bdd5400d2bfa1b673f2",
                "version": 1,
                "digest": "To13qwyuk+zgFskF5aN8LOt4w7cHEosqZ89ZO354J80="
            }
        }
    ]
//...
```

We just created a new sword with imba stats. In the next example we will see how we can send our sword to a friend or in general another address on the ledger.


## 7th Example, Transfering an Object and Transfering Coins

The last example will involve trasfering the sword we created to another address.
The method is `sui_transferObject`.

The methods are pretty straightforward and similar to `sui_splitCoin`, we do need a recepient address, this can be a friend's or a second address we own.


```sh
# address who will receive the stuff
friend_address="0x788a511738ad4ab1d7f769b49076d9c7b272826c"

# the id of the Sword NFT
sword_id="0x36e8443ea817223639ef6bdd5400d2bfa1b673f2"

# prepare the data params: [<signer>, <object_id>, <gas>, <gas_budget>, <recipient>]
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_transferObject\", \"params\": [\"$address\", \"$sword_id\", \"$gas_id\", 10000, \"$friend_address\"]}"

# send our transaction to be validated
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json

# get the tx_bytes
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAAHiKURc4rUqx1/dptJB22ceycoJsNuhEPqgXIjY572vdVADSv6G2c/IBAAAAAAAAACBOjXerDK6T7OAWyQXlo3ws63jDtwcSiypnz1k7fngnzfwIv478w9s2IYqaMV/2x6C/DT0S+hHI//7tsdRGSLOd1i2lOV/VNsoDAAAAAAAAACDh08xwMUIlEXznVO/kW9uVptN+cK351OvieMgvhlB3vgEAAAAAAAAAECcAAAAAAAA="

# get the signature
sui keytool sign --address "$address" --data "$tx_bytes"

signature="LXDnYcjFQU6boMyp+ZBbeYr1dSjcwjnXu9mEtu/yDApf/edHyNzUT4xGW6umDnc7IW539qP04wihrkyjKVF1CA=="
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="
scheme="ED25519"

# data for the execution
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# execute
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

The result confirms our success:

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

The `AddressOwner` is our `$friend_address` for the sword (`object_id` same as `$sword_id`). Also the sword's version got bumped up to 2, meaning it has experienced two transactions. We can confirm that is correct, first transaction being its forging (actually it is the transfer to our address after it is created, if you check the source code for the <a href="https://github.com/MystenLabs/sui/blob/main/sui_programmability/examples/move_tutorial/sources/my_module.move">`sword_create`</a> function.), and the second transaction being this one just now.


## Example use sui_paySui to split or merge coins

SUI coins have a single method to operate on them. The name of the method is `sui_paySui`, its main function can be extrapolated from its name. With this method, beside sending SUI to another address we can also merge or split coins. The method's inputs are :
- `signer`,  our address
- `input_coins` a list/array of SUI Coin objects id's (in case we want to merge we need two at least, if we want to split a coin, we need it's id only)
- `recipients` a list with addresses to receive the ammounts described next, in case of a split or merge the recipient is the same as the signer
- `ammounts` a list with the new coins that will result after the method executed, the recipients above should match this list.
- `gas_budget`, the max ammount of MIST we are willing to offer for the transaction

### Split Coin Scenario

Lets assume we want a 9.999 SUI Coin object, and we have a 10.000.000 SUI Coin.

```sh
signer="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
input_coins="[\"0x7fb7e3a108d8f1d6022388ff81aadb295face54a\"]"
amounts="[9999]" # It feels easier to set the ammounts first and then the recipients
recipients="[\"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12\"]"

# compose the requests' data
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_paySui\", \"params\": [\"$signer\", $input_coins, $recipients, $amounts, 10000]}"

# fire the request for validation
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json

# get the tx bytes from the result
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoABQF/t+OhCNjx1gIjiP+BqtspX6zlSgEAAAAAAAAAIKGJqEWh2HzAzTZsr7NSgFKYmRyWMCFac9bqIpsE8ec/AfwIv478w9s2IYqaMV/2x6C/DT0SAQ8nAAAAAAAA/Ai/jvzD2zYhipoxX/bHoL8NPRJ/t+OhCNjx1gIjiP+BqtspX6zlSgEAAAAAAAAAIKGJqEWh2HzAzTZsr7NSgFKYmRyWMCFac9bqIpsE8ec/AQAAAAAAAAAQJwAAAAAAAA=="

# get the signature with the keytool
sui keytool sign --address "$signer" --data "$tx_bytes"
# INFO sui::keytool: Address : 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
# INFO sui::keytool: Flag Base64: AA==
# INFO sui::keytool: Public Key Base64: R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY=
# INFO sui::keytool: Signature : csAW+59KUdeKACzfxhrcJcYqc7ZHKlKZSrwv6zzOLamqm3WHfIlRqNF1Vsyf/HJX8/qvHBRdn9r+CYkB96ZrAA==

scheme="ED25519" # this was chosen when first creating the address 
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="
signature="csAW+59KUdeKACzfxhrcJcYqc7ZHKlKZSrwv6zzOLamqm3WHfIlRqNF1Vsyf/HJX8/qvHBRdn9r+CYkB96ZrAA=="

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# call to execute our coin split
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

And we can check either through another rpc call or the sui CLI the result:
```sh
sui client gas
#                 Object ID                  |  Gas Value 
# ----------------------------------------------------------------------
# 0x2f411abcdfa356539adaec168bc4f299d4971a38 |    9999 
# ...
```

### Merge Coins Scenario

Let's merge three coins, our address has two 10.000.000 coins and one from the previous example with ~9.998k 
The way the method works is that it adds up all the input coins into one coin and then use that coin to send the ammounts to the recipient.
We will leave the amounts empty so the method will just do the merging it always does and exit. This will leave us with a coin with all the previous balances added minus the gas.

```sh
# bind the SUI Coin addresses
coin1="0xd894d43748a3caebb075ec33bd67aa463000414e"
coin2="0xb3826bf1eab4e4a05c98600fb4f243adf6ed6564"
coin3="0x7fb7e3a108d8f1d6022388ff81aadb295face54a"

signer="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
input_coins="[\"$coin1\", \"$coin2\", \"$coin3\"]"
recipient=$signer

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_payAllSui\", \"params\": [\"$signer\", $input_coins, \"$recipient\", 10000]}"

    curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json

# get the tx bytes from the above
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoABgPYlNQ3SKPK67B17DO9Z6pGMABBTgIAAAAAAAAAIGnAapRb+duPpIVyQC79bVso1BSmKYmsIzz7zZFc+z68s4Jr8eq05KBcmGAPtPJDrfbtZWQCAAAAAAAAACAV9s47DX+lcx0EWyRpbXkGo1MQvT5BPnUcosqU27pkjn+346EI2PHWAiOI/4Gq2ylfrOVKAwAAAAAAAAAgZECWdz/M/p2t+A3vwLO/SiW5yMxv4aAplg4wZqG2hpb8CL+O/MPbNiGKmjFf9segvw09EvwIv478w9s2IYqaMV/2x6C/DT0S2JTUN0ijyuuwdewzvWeqRjAAQU4CAAAAAAAAACBpwGqUW/nbj6SFckAu/W1bKNQUpimJrCM8+82RXPs+vAEAAAAAAAAAECcAAAAAAAA="

sui keytool sign --address "$signer" --data "$tx_bytes"
# ...
# INFO sui::keytool: Public Key Base64: R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY=
# INFO sui::keytool: Signature : W1LFeMr1DXz8MSaMEDJ9at8ZjjN94+EeBgZKgfZ3qZ1a8zYX7ZRb2mzElsailE3qJ4tqxk2z7T5lGBuYu8w3DQ==

signature="W1LFeMr1DXz8MSaMEDJ9at8ZjjN94+EeBgZKgfZ3qZ1a8zYX7ZRb2mzElsailE3qJ4tqxk2z7T5lGBuYu8w3DQ=="

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# execute
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

