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

