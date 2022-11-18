# Example 5 Call a module's function that mints swords

This example assumes that you have followed the previous one and the `move_tutorial` package is published on Sui.<br/>
We will call <a href="https://docs.sui.io/sui-jsonrpc#sui_getNormalizedMoveModule">sui_getNormalizedMoveModule</a> to check the functions of the package, next <a href="https://docs.sui.io/sui-jsonrpc#sui_moveCall">sui_moveCall</a> with <a href="https://docs.sui.io/sui-jsonrpc#sui_executeTransaction">sui_executeTransaction</a> to mint the sword NFT.

## Getting started

We bind our Sui address and rpc server url to variables, as well as the id of the `move_tutorial` package. In [Example 4](Example_4_Publish_Package.md) we published the package and we got its id as a response. If you forgot to note it down you can check your address in the <a href="https://explorer.sui.io/">explorer</a> and check the past transactions to find the one where you published the module. In the worst case scenario you can follow the steps again to re-publish the package.

```sh
rpc="https://fullnode.devnet.sui.io:443"
# get our address
sui client active-address
 # 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
 address="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
 package_object_id="0x9238689c6c14db84519686958643bf47de13e54e"
```

## Learn about the module

First call we will use is `sui_getNormalizedMoveModule` to get an idea on how to use it to mint swords, what kind of arguments do we need, what's the name of the function. In reality it is easier to check the move source code if it is available.

```sh
module_name="my_module"

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_getNormalizedMoveModule\", \"params\": [\"$package_object_id\",\"$module_name\"]}"

curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```
and the response:

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

We can get a lot of info from the result, under `structs` we see `Forge` and `Sword`, the forge creates the swords. The `exposed_functions` field has the functions we will call next like `sword_create, magic, strength`. Let's mint a magic katana with our forge and give it to ...who else, ourselves.

## sui_moveCall

The `sui_moveCall` call has a quite a few parameters `signer, package_object_id, module, function, type_arguments, arguments, gas, gas_budget`.<br/>
 - `signer` is our address
 - `module` is the name of the module, since a package may have more than one modules
 - `function` is the name of the function of the module we want to call
 - `type_arguments` this is an array that has any type arguments a function has, it can be checked in the above response if they are needed, usually type arguments point to a struct defined in a module so each element of this array should look like `"package_id::module_name::struct"` for example `"0x9238689c6c14db84519686958111147de13e54e::weapon::SWORD"`.
 - `arguments` is an array holding the arguments the function accepts. Keep in mind that arrays must be homogenous so all elements will usually be of type string and the adapter will translate them for us. You will see this below where we input a string for the `magic` and `strength` argument of `sword_create` even though in the move source code these arguments are u64 ints.

Lets build the JSON for the request.

```sh
# signer is our $address
# the package id
package_object_id="0x9238689c6c14db84519686958643bf47de13e54e"
module="my_module"
function="sword_create"
# The type arguments and arguments can be found in the previous result under the sword_create function
type_arguments="[]"
arguments="[\"0xeb8e4a532d09c596564f1c48b17f8ca4b339dbda\", \"455\", \"999\", \"$address\"]"

# dump all variables into the data object in the correct order
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_moveCall\", \"params\": [\"$address\", \"$package_object_id\", \"$module\", \"$function\", $type_arguments, $arguments, \"$gas_id\", 10000]}"
```

Some people, who read the move source code, might have noticed that the `sword_create` function takes on more argument of type `TxContext`, but we did not provide it above. This is because this argument is special, it is inputed at runtime. We make sure we wrote everything correctly and we request:

```sh
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

Now we have the `tx_bytes` we need a signature and to execute:

```sh
# get tx bytes from previous result
tx_bytes="VHJhbnNhY3Rpb25EYXRhOjoAApI4aJxsFNuEUZaGlYZDv0feE+VOAQAAAAAAAAAg+pryAo+gALTc0mDEz9wJ3XFmmJ4IMz131namNQmzj4MJbXlfbW9kdWxlDHN3b3JkX2NyZWF0ZQAEAQDrjkpTLQnFllZPHEixf4yksznb2gEAAAAAAAAAIIq8/a2erR0ImDILYDhh3kBL5EXVUkFo5TgCvFzOBhBqAAjHAQAAAAAAAAAI5wMAAAAAAAAAFPwIv478w9s2IYqaMV/2x6C/DT0S/Ai/jvzD2zYhipoxX/bHoL8NPRL6Ecj//u2x1EZIs53WLaU5X9U2ygIAAAAAAAAAIAM0VDf2JZIbgYIbHcUCdS/RZUWF7uxa1hVW98o9wzlcAQAAAAAAAAAQJwAAAAAAAA=="

# get the signature
sui keytool sign --address "$address" --data "$tx_bytes"

signature="BXESHr1zl9p/oAegLcAwWQq/F6ljHg+a8N2+GOphlaW44GKJAvbGV6Zjs4E0Di0ZRb7O/9HrCzXY17WJU+7sDg=="
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="
# scheme is either ED25519 or Secp256k1
scheme="ED25519"

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

## Result

We are met with success:

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

We just created a new sword with imba stats. By [checking the object](Example_2_Check_Object_Details.md) we can see it indeed has the 455 magic and 999 strength.

## What's Next

In the next [example](Example_6_Transfer_Object.md) we will transfer the sword we just created to another address.
