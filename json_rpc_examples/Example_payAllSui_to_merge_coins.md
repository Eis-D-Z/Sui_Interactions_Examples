# Example Use sui_payAllSui to merge coins

The  <a href="https://docs.sui.io/sui-jsonrpc#sui_payAllSui">sui_payAllSui</a> call is a special call for the fact that it does not need a gas SUI Coin object. <br/>

Naturally it only works with `0x2::coin::SUI` type of coins.
This makes it handy in many different scenarios, in this example we will look at how to merge three coins using this method. This method differs from `sui_paySui` in the fact that it accepts only one recipient.

## Getting started

We first bind our address and the node URL to variables.

```sh
# our address
signer="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
rpc="https://fullnode.devnet.sui.io:443"
```

Next we have to check our coins, an easy way to do that is `sui client gas` in order to find the id's of the coins we are going to merge. In this case we pick the coins with id: `0xd894d43748a3caebb075ec33bd67aa463000414e`, `0xb3826bf1eab4e4a05c98600fb4f243adf6ed6564` and `0x7fb7e3a108d8f1d6022388ff81aadb295face54a`.

```sh
coin1="0xd894d43748a3caebb075ec33bd67aa463000414e"
coin2="0xb3826bf1eab4e4a05c98600fb4f243adf6ed6564"
coin3="0x7fb7e3a108d8f1d6022388ff81aadb295face54a"
```

## Call and execute

The call needs `signer, input_coins, recipient, gas_budget` as arguments. It makes one coin with total value the value of the coins inside `input_coins` and sends it to the recipient.
- `signer` is our address
- `input_coins` is an array with the id's of the coins we want
- `recipient` is the address of the receiver of the total amount of the above coins (minus gas), in this case ourselves
- `gas_budget` is an integer denoting the maximum gas we are willing to offer for this transaction

```sh
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
scheme="ED25519" # this was chosen when first creating the address, `sui keytool list` will remind you your choice
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="

data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# execute
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

## Result 

We can easily check with `sui client gas` that the three initial coins disappeared and a single coin with almost their total value apperead instead.

The resulting JSON also confirms that:

```JSON
//...
"effects": {
    "status": {
        "status": "success"
    },
    "gasUsed": {
        "computationCost": 57,
        "storageCost": 32,
        "storageRebate": 64
    },
    "transactionDigest": "MFvF9fr0iVh4FxvBOBQQZFer5Lvw8OVkJ8o/vmerMJ0=",
    "mutated": [
        {
            "owner": {
                "AddressOwner": "0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
            },
            "reference": {
                "objectId": "0xd894d43748a3caebb075ec33bd67aa463000414e",
                "version": 3,
                "digest": "20sSyY77lgdob7JgDIXZTA961tU2erPVJj1XsOu9ufI="
            }
        }
    ],
    "deleted": [
        {
            "objectId": "0x7fb7e3a108d8f1d6022388ff81aadb295face54a",
            "version": 4,
            "digest": "Y2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2M="
        },
        {
            "objectId": "0xb3826bf1eab4e4a05c98600fb4f243adf6ed6564",
            "version": 3,
            "digest": "Y2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2M="
        }
    ] //...
}
```

We can see that one object has been mutated, this is the first coin in `input_coins`, and two objects have been deleted, these are the other two coins. Their `objectId` also matches the ones we have bound to the `coin1, coin2` and `coin3` variables.

## Observations

This is a very handy method, especially if your address is full of coins with value lower than the average gas cost, since this method will remove gas from the input, you can send merge+send these coins. Also this will award you some rebate since this methods deletes three objects.

## Similar Method

`sui_payAllSui` is similar to `sui_paySui` in the fact that they both don't require a gas object. In the [sui_PaySui Example](Example_paySui_to_split_coin.md) we look at how we can use that method to split a coin.