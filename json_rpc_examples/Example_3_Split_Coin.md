# Example 3 Split a SUI Coin

In this example we will create a SUI Coin with 9999 MIST balance by splitting a larger Coin. This is extremely useful when you want to send an exact balance to a contract or address. The call is <a href="https://docs.sui.io/sui-jsonrpc#sui_splitCoin">`sui_splitCoin`</a>.

## Getting started

As with [Example 1](Example_1_Check_Objects.md) we will first bind the address and rpc web address to variables.

```sh
rpc="https://fullnode.devnet.sui.io:443"
# get our address
sui client active-address
 # 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
 address="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
```

This call we are about to make will require gas since it will write on Sui, in contranst with the previous two examples which were just reading.
We will also bind the id of one of the SUI coins objects we have. We can check them either with the call from [Example 1](Example_1_Check_Objects.md) or
with the simple `sui client gas` command.

```sh
gas_id="0xe9c85a7f49c0d0652685690dbd552fe17a83bd2e"
```

## Make the call

In the same spirit as the previous examples we will first create the JSON and then fire the request with cURL.

For now we will ignore the `gas_budget` argument by setting a large budget that ensures our transaction will go through. This argument is often encountered, its purpose is to set an upper limit to the gas a transaction is allowed to spend. If the gas exceeds this upper limit, it will stop.

All the arguments for the request are `signer, coin_object_id, split_amounts, gas, gas_budget`.<br/>
`gas` means the Coin object to subtract gas from, `signer` is our address.

```sh
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_splitCoin\", \"params\": [\"$address\", \"$id\", [9999], \"$gas_id\", 10000]}"
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```
## Initial response

As we can observe the response is a bit weird, the expected result of a newly created coin and fields present in previous examples are missing:

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

This is normal. This transaction will write, it is not a simple read request like the previous two examples. In Sui, when we want to execute a call that will mutate data then the validators must first check that everything is alright and we get a response in the form of `tx_bytes`. This means that the validators consider the transaction in order, and will process it as soon as we sign it. 

Next we have to sign the transaction, this will also confirm that the `signer` argument is us, since the coin is under our address, that is it belong to us, another signer will not be able to have this transaction complete. In general every transaction that mutates data needs to be signed by the caller and then it needs to pass the checks, for example a standard check is that the SUI Coin object we will use for gas actually belongs to the signer.

## Execute the transaction

All the transactions that need to be signed will have this step that ends by calling 
<a href="https://docs.sui.io/sui-jsonrpc#sui_executeTransation">sui_executeTransaction</a>.<br/>
The arguments for this call are `tx_bytes, sig_scheme, signature, pub_key, request_type`. We already have the `tx_bytes`, the sig_scheme is either `ED25519` or `Secp256k1`, depends on what you chose when you first created the address. If you are unsure the `sui keytool list` will show the scheme for each address you created with the sui client. We will soon see how to get the `signature` and `pub_key`.<br/>
Lastly the `request_type` has 4 valid values: `ImmediateReturn, WaitForTxCert, WaitForEffectsCert, WaitForLocalExecution`. We will choose the last one which will wait until the transaction completes and we get a full output. The other values return earlier and we will have to check with subsequent calls for the effects of our transaction.

Lets use the `sui keytool sign` command in order to get the arguments for the `sui_executeTransaction`.

```sh
# for clarity bind the transactions bytes to a variable
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAAgAAAAAAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAg61Q+9Nb1tpyLqvfx3DAp0d2s+c64rNfj1WaiqXiqd08DcGF5CXNwbGl0X3ZlYwEHAAAAAAAAAAAAAAAAAAAAAAAAAAIDc3VpA1NVSQACAQCRvnssAREl90jDCIctAMjyAMq+FQEAAAAAAAAAIGbrG8PNNFpOPr6ZHovCUA/hCYkBH/D75nSEKJB8F9DdAAkBDycAAAAAAAD8CL+O/MPbNiGKmjFf9segvw09EunIWn9JwNBlJoVpDb1VL+F6g70uAQAAAAAAAAAgBptpMcUxbtjN0D9CGvtqSwS9odmEfW9pho+aIF/MiA4BAAAAAAAAAKCGAQAAAAAA"

sui keytool sign --address "$address" --data "$tx_bytes"
# INFO sui::keytool: Address : 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
# INFO sui::keytool: Flag Base64: AA==
# INFO sui::keytool: Public Key Base64: R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY=
# INFO sui::keytool: Signature : 6LARTREvuT81FxtJPUI9XqoWLlNUTc3yg3yG6i3va3XhDi9WlIgu1ZXmC88VUD3fMeW5EUOh81DU8bLILXoTBw==
```

With the output we are ready to proceed:

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

## Check the final result

Here's what we got:

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

## Observations

We can see in the `effects` field that we were successful, we can see a mutated object with the id of the initial coin, its version got bumped up to 2 meaning that it has experienced two transactions and we also have a newly created object with id: `0x0f848b589fe7727a628359c26bf880c9efb1de3b`.
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
                        "id": "0x0f848b589fe7727a628359c26bf880c9efb1de3b"
                    }
                }
            }, // ...
        } // ...
}            
```
We can confirm that we own a 9999 worth of SUI Coin object.

## What's next

The next [example](Example_4_Publish_Package) will show how to publish a package with the JSON rpc calls.
