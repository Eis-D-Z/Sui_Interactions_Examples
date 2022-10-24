# Walkthrough

Welcome to the JSON RPC example walkthrough. We assume you already have an empty address. We will be using curl and of course, if javascript is more comfortable, you can easilly follow the examples with it through fetch calls or axios (or something similar).

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
            "objectId": "0x01fdc6369b1a351114ae208a5f76cd8a974f528e",
            "version": 1,
            "digest": "DQMmxQRRb/yE6no9vI4sALKusT8u6h680wka+skNDgc=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "OwkO+cDnneBjAK0dwMsRWJG729aB/1dxLJPjkEA+El8="
        },
        {
            "objectId": "0x1e25818441ac850364e890a162d8b0296a393e65",
            "version": 1,
            "digest": "DLXUtRmL9edZLmNIW0PX1wVLWQjFGDRmhCt3YW0hMUk=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "6NsFi/c0OPMIl/1BXBdKb8wp5C6wYeerPP8ksJ0o5IY="
        },
        {
            "objectId": "0x4ccaa3d6a09dee91e0dad55b9718625fd62364bc",
            "version": 1,
            "digest": "BhjmF7C3EUhnOVZzX0fxqoWsUtLvIN6Jf/4rlL4ssFA=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "sjkMRqVaZbQVjiGgsNA9KuQ/j6DmdDOdrop/tCaBalw="
        },
        {
            "objectId": "0x536b27e0dd74113f76ed441277ed73341266c5a5",
            "version": 1,
            "digest": "wZKmsL5y1gJZYosjwgqxlbcMVQl2fTR+b8zU6ICpChk=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "VFbdF6O/I9yQqlzwEBwj7ZIFGwb0kpwAUcHtk3iA5g0="
        },
        {
            "objectId": "0x8852e991c9e3e9a07b3834621e4f938dad4ea57b",
            "version": 1,
            "digest": "RxCttY6vVKQhyZw4/TXfihdFaLikz/vzpPpSdru54e0=",
            "type": "0x2::coin::Coin<0x2::sui::SUI>",
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "previousTransaction": "oZze1GxIHo97+Cx8NiIjUiQE6B7oGrDXV9BN7mE3n8k="
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
id="0x01fdc6369b1a351114ae208a5f76cd8a974f528e"
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
                    "id":{"id":"0x01fdc6369b1a351114ae208a5f76cd8a974f528e"}
                    }
                },
        "owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},
        "previousTransaction":"8Dpc1+03kCviQRrB4hMUDT1z3bF+ZhlHtkG3RXHKuBg=",
        "storageRebate":15,
        "reference":{"objectId":"0x01fdc6369b1a351114ae208a5f76cd8a974f528e",
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

We will use the <a href="https://docs.sui.io/sui-jsonrpc#sui_splitCoin">`sui_splitCoin`</a> method to split our Coin object into 9999 SUI and 990001 SUI, two objects. This is a transaction, as such it will require some gas to be offered. In this instance we will use another Coin Object (and we will be using this object consistently for this purpose), let's pick the one with id `0x8852e991c9e3e9a07b3834621e4f938dad4ea57b`. 

Binding this id to a variable:

```sh
gas_id="0x8852e991c9e3e9a07b3834621e4f938dad4ea57b"
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
        "txBytes": "VHJhbnNhY3Rpb25EYXRhOjoAAgAAAAAAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAg61Q+9Nb1tpyLqvfx3DAp0d2s+c64rNfj1WaiqXiqd08DcGF5CXNwbGl0X3ZlYwEHAAAAAAAAAAAAAAAAAAAAAAAAAAIDc3VpA1NVSQACAQAB/cY2mxo1ERSuIIpfds2Kl09SjgEAAAAAAAAAIA0DJsUEUW/8hOp6PbyOLACyrrE/LuoevNMJGvrJDQ4HAAkBDycAAAAAAAD8CL+O/MPbNiGKmjFf9segvw09EohS6ZHJ4+mgezg0Yh5Pk42tTqV7AQAAAAAAAAAgRxCttY6vVKQhyZw4/TXfihdFaLikz/vzpPpSdru54e0BAAAAAAAAAKCGAQAAAAAA",
        "gas": {
            "objectId": "0x8852e991c9e3e9a07b3834621e4f938dad4ea57b",
            "version": 1,
            "digest": "RxCttY6vVKQhyZw4/TXfihdFaLikz/vzpPpSdru54e0="
        },
        "inputObjects": [
            {
                "ImmOrOwnedMoveObject": {
                    "objectId": "0x01fdc6369b1a351114ae208a5f76cd8a974f528e",
                    "version": 1,
                    "digest": "DQMmxQRRb/yE6no9vI4sALKusT8u6h680wka+skNDgc="
                }
            },
            {
                "MovePackage": "0x0000000000000000000000000000000000000002"
            },
            {
                "ImmOrOwnedMoveObject": {
                    "objectId": "0x8852e991c9e3e9a07b3834621e4f938dad4ea57b",
                    "version": 1,
                    "digest": "RxCttY6vVKQhyZw4/TXfihdFaLikz/vzpPpSdru54e0="
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
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAAgAAAAAAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAg61Q+9Nb1tpyLqvfx3DAp0d2s+c64rNfj1WaiqXiqd08DcGF5CXNwbGl0X3ZlYwEHAAAAAAAAAAAAAAAAAAAAAAAAAAIDc3VpA1NVSQACAQAB/cY2mxo1ERSuIIpfds2Kl09SjgEAAAAAAAAAIA0DJsUEUW/8hOp6PbyOLACyrrE/LuoevNMJGvrJDQ4HAAkBDycAAAAAAAD8CL+O/MPbNiGKmjFf9segvw09EohS6ZHJ4+mgezg0Yh5Pk42tTqV7AQAAAAAAAAAgRxCttY6vVKQhyZw4/TXfihdFaLikz/vzpPpSdru54e0BAAAAAAAAAKCGAQAAAAAA"

sui keytool sign --address "$address" --data "$tx_bytes"
# INFO sui::keytool: Address : 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
# INFO sui::keytool: Flag Base64: AA==
# INFO sui::keytool: Public Key Base64: R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY=
# INFO sui::keytool: Signature : NN73LLJad0zTuCspcxInYmXV5ZTZQ9320e6NR8iyxepZ2hlsnYURbHmH0ytbukedwN5gLtp8ne8ur3myLsC4Cg==
```
The `sig_scheme` is the digital signature scheme chosen at address creation, by default is ED25519. 
The `request_type` can be one of `ImmediateReturn, WaitForTxCert, WaitForEffectsCert, WaitForLocalExecution`, and it sets how much info we want to get back in the response. If we are in a hurry (programmatically because practically everything happens very fast) we can choose `ImmediateReturn` but in this case we will choose the last `WaitForLocalExecution` with which we'll get a complete return info. 

Now we have all the necessary params' values to execute a transaction:

```sh
# bind first to variables
signature="NN73LLJad0zTuCspcxInYmXV5ZTZQ9320e6NR8iyxepZ2hlsnYURbHmH0ytbukedwN5gLtp8ne8ur3myLsC4Cg=="
scheme="ED25519"
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="

# form the payload
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$sig\",\"$pub_key\",\"WaitForLocalExecution\"]}"

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
                "transactionDigest": "rdxfHaL2B5Y9ANZR0w5s+AhZt0iAbSGfG/roVrXJX4w=",
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
                                    "0x1fdc6369b1a351114ae208a5f76cd8a974f528e",
                                    [
                                        9999
                                    ]
                                ]
                            }
                        }
                    ],
                    "sender": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12",
                    "gasPayment": {
                        "objectId": "0x8852e991c9e3e9a07b3834621e4f938dad4ea57b",
                        "version": 1,
                        "digest": "RxCttY6vVKQhyZw4/TXfihdFaLikz/vzpPpSdru54e0="
                    },
                    "gasBudget": 100000
                },
                "txSignature": "ADTe9yyyWndM07grKXMSJ2Jl1eWU2UPd9tHujUfIssXqWdoZbJ2FEWx5h9MrW7pHncDeYC7afJ3vLq95si7AuApH3TggoxAdtQsYj7yDdoo2d1kdxds7cVJGhkXdCylydg==",
                "authSignInfo": {
                    "epoch": 0,
                    "signature": "gPE4X6uYz6D9lbJzVsdoJ/ftc7ZQU7Kvo8c2IpglTEls5A9w/MBzJVTFOmYiM1x/",
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
                        2,
                        0
                    ]
                }
            },
            "effects": {
                "transactionEffectsDigest": "Zqvz3aGHfVPOqPkdI1xnKFOM57xROLTFJiDdKBUdVhA=",
                "effects": {
                    "status": {
                        "status": "success"
                    },
                    "gasUsed": {
                        "computationCost": 557,
                        "storageCost": 45,
                        "storageRebate": 30
                    },
                    "transactionDigest": "rdxfHaL2B5Y9ANZR0w5s+AhZt0iAbSGfG/roVrXJX4w=",
                    "created": [
                        {
                            "owner": {
                                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                            },
                            "reference": {
                                "objectId": "0xeb25c93ba7b886817b7dca5a151e201b73e4e59a",
                                "version": 1,
                                "digest": "E0FC4IL0nxALmVwcepb5jzmT/Y+yYIUbdbF1RyIbBX4="
                            }
                        }
                    ],
                    "mutated": [
                        {
                            "owner": {
                                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                            },
                            "reference": {
                                "objectId": "0x01fdc6369b1a351114ae208a5f76cd8a974f528e",
                                "version": 2,
                                "digest": "OP3HfqR9xYidQ2O0bReOg7MDBe5cJI/un1OQScVRPSI="
                            }
                        },
                        {
                            "owner": {
                                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                            },
                            "reference": {
                                "objectId": "0x8852e991c9e3e9a07b3834621e4f938dad4ea57b",
                                "version": 2,
                                "digest": "D7NqwSHbgS2mkBBMES2hoxBW9LxCXDBwkMQ7h4IqnVg="
                            }
                        }
                    ],
                    "gasObject": {
                        "owner": {
                            "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
                        },
                        "reference": {
                            "objectId": "0x8852e991c9e3e9a07b3834621e4f938dad4ea57b",
                            "version": 2,
                            "digest": "D7NqwSHbgS2mkBBMES2hoxBW9LxCXDBwkMQ7h4IqnVg="
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
                                "objectId": "0xeb25c93ba7b886817b7dca5a151e201b73e4e59a"
                            }
                        }
                    ],
                    "dependencies": [
                        "OwkO+cDnneBjAK0dwMsRWJG729aB/1dxLJPjkEA+El8=",
                        "oZze1GxIHo97+Cx8NiIjUiQE6B7oGrDXV9BN7mE3n8k="
                    ]
                },
                "authSignInfo": {
                    "epoch": 0,
                    "signature": "rILEjAAFiwMkyNTbnuZZYq6wo71UIzKcIbOSI8H3NntL+djQ8Kb80lTm5iyCNjf2",
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

We can see in the `effects` field that we were successful, we can see a mutated object with the id of the initial coin, its version got bumped up to 2 meaning that it has experienced two transactions and we also have a newly created object with id: `0xeb25c93ba7b886817b7dca5a151e201b73e4e59a`.
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
                        "id": "0xeb25c93ba7b886817b7dca5a151e201b73e4e59a"
                    }
                }
            }, // ...
        } // ...
}            
```
We can confirm that we own a 9999 worth of SUI Coin object. If we check all our owned objects (example 1) we can see the other two coins that changed with balance `9990001` SUI and the other with `9999428` SUI. The latter is the one that was used to pay for the gas.

We will explore the other `request_type`'s next and we will see how we can subscribe to events so we can know what's happening with our transactions.