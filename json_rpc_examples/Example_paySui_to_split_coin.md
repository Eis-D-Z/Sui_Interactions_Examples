# Example Using sui_paySui to split a SUI Coin

The  <a href="https://docs.sui.io/sui-jsonrpc#sui_paySui">sui_paySui</a> call is a special call for the fact that it does not need a gas SUI Coin object. 
<br/>
Naturally it only works with `0x2::coin::SUI` type of coins.
This makes it handy in many different scenarios, in this example we will look at how to split a coin using this method. We will aim to get a 9999 MIST worth Coin from a larger coin.

## Getting Started 

We first bind our address and the node URL to variables.

```sh
# our address
signer="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
rpc="https://fullnode.devnet.sui.io:443"
```

Next we have to check our coins, an easy way to do that is `sui client gas` in order to pick a coin to split. In our case we have the coin with id `0x7fb7e3a108d8f1d6022388ff81aadb295face54a` that has balance of 10.000.000 MIST.

```sh
coin="0x7fb7e3a108d8f1d6022388ff81aadb295face54a"
```

## The call

The arguments for the call are `signer, input_coins, recipients, amounts, gas_buget`.
 - `singer` is our address
 - `input_coins` an array of all the coins we want to use, in this case only one
 - `recipients` an array with all the addresses that will receive the amounts defined below. This a 1-1 relation, the first amount will go to the first address, the second amount will be received by the second address, so on...
 - `amounts` an array with the amounts that we want each receiver to get. It follows that the sum of the amounts should be less than the total balance of the coins in `input_coins`. The reason why they have to be stricty less is because we have to consider gas price as well.
 - `gas_budget` an integer representing the maximum gas we are willing to offer for this transaction

 ```sh
 signer="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
input_coins="[\"$coin\"]"
amounts="[9999]" # It feels easier to set the ammounts first and then the recipients
recipients="[\"$signer\"]"

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

scheme="ED25519" # this was chosen when first creating the address, `sui keytool list` will remind you your choice
pub_key="R904IKMQHbULGI+8g3aKNndZHcXbO3FSRoZF3QspcnY="
signature="csAW+59KUdeKACzfxhrcJcYqc7ZHKlKZSrwv6zzOLamqm3WHfIlRqNF1Vsyf/HJX8/qvHBRdn9r+CYkB96ZrAA=="

# prepare the data for the sui_executeTransation call
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_executeTransaction\", \"params\": [\"$tx_bytes\", \"$scheme\",\"$signature\",\"$pub_key\",\"WaitForLocalExecution\"]}"

# call to execute our coin split
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > result.json
```

# Result
We can check the json or through another rpc call or the sui CLI if we have 9999 MIST coin now:

```sh
sui client gas
#                 Object ID                  |  Gas Value 
# ----------------------------------------------------------------------
# 0x2f411abcdfa356539adaec168bc4f299d4971a38 |    9999 
# ...
```

## Observations

This call is very handy especially if we have coins with very low balance, lower than the average gas cost. We can insert them all in the `input_coins` argument and then split the total value as we see fit.

## Similar method

`sui_paySui` is similar to `sui_payAllSui` in the fact that they both don't require a gas object. In [sui_PayAllSui Example](Example_payAllSui_to_merge_coins.md) we look at how to merge multiple coins.