# Walkthrough

Welcome to the JSON RPC example walkthrough. We assume you already have an empty address. We will be using curl and of course, if javascript is more comfortable, you can easilly follow the examples with it through fetch calls or axios (or something similar).

Sui will be the network and SUI will mean the token.

All the commands that follow are meant for a bash terminal.
Let's first make sure the address exists and add it to a variable so we can type a bit a less:

```bash
 sui client active-address
 # 0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12
 address="0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"
```

Here `0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12` is the address we will use, if the sui command does not return an address please follow the instructions <a href="https://docs.sui.io/build/devnet">here</a> to connect to the Sui network and get one. If you choose a local installation then proceed to also get some SUI.

Let's fill the address with some SUI. Join our discord channel <a href="https://discord.gg/sui">https://discord.gg/sui</a> and after the verification is done check the faucet channel <a href="https://discord.com/channels/916379725201563759/971488439931392130">devnet-faucet</a> and type `!faucet <address>` in the channel where address is your new address.

Lastly we will also bind the devnet rpc server URL to a variable:

```bash
rpc="https://fullnode.devnet.sui.io:443"
```

Now we are ready to do our first call and see the coins we own.

## 1st call, check the objects our address owns

In Sui everything is an object. Sui is object-centric and every item (object) owns a UID. We will soon see that we own 5 objects which contain an ammount of SUI tokens. In case of SUI tokens it is easy to think of each COIN object as SUI banknotes, so we actually have 5 banknotes and we will later check their denomination. It is worth noting that there are some implications. If we want to tranfer a SUI amount that is less than the denominated value we have to get change, that is to split our banknote in smaller denominations. If we want to send 20.000 SUI but we have 5 banknotes of 10.000.000, then we must split a 10.000.000 banknote into a 980.000 SUI banknote and 20.000 SUI banknote. We then can transfer the latter, but in the process we created two new Sui objects (and deleted the initial) In many cases this happens automatically but it is very usefull to keep in mind.

We are ready now to check how many SUI we have. This will be the first RPC call, the method is called `sui_getObjectsOwnedByAddress`.
We will first write the JSON and save it into a variable and after that we will make the call to see what we get.

```bash
data="{\"jsonrpc\": \"2.0\", \"method\": \"sui_getObjectsOwnedByAddress\", \"id\": 1, \"params\": [\"$address\"]}"
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc
```

The JSON response should look like:

```JSON
{"jsonrpc":"2.0",
"result":[
    {
        "objectId":"0x11aee1d5736683a2285251306b83068983119d96",
        "version":1,
        "digest":"Bu5RPYiVWDDX4IshFqB8vsUdzBptTkhNK/Hm/b06wEA=",
        "type":"0x2::coin::Coin<0x2::sui::SUI>",
        "owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},
        "previousTransaction":"8Dpc1+03kCviQRrB4hMUDT1z3bF+ZhlHtkG3RXHKuBg="
    },{
        "objectId":"0x3f20cc6615c199496a6ff1528a8a23823a3ba3e2",
        "version":1,
        "digest":"bBaJ31nkAS4Swy9mwDmWCrR5fFeVMufteAJkQTjAH38=",
        "type":"0x2::coin::Coin<0x2::sui::SUI>",
        "owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},
        "previousTransaction":"crQ008Z2bRbJGW3fWGYJQ21Hn3XryEj/idtk/Z7CASE="
    },{
        "objectId":"0x47effe51732d0b70e1a2c6b04c7fe1150fcc925d",
        "version":1,
        "digest":"XYqAK1YseJWTEcOO62ysZ5jOgCtYiuH1ggl1TfGlw7M=",
        "type":"0x2::coin::Coin<0x2::sui::SUI>",
        "owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},
        "previousTransaction":"MhhwQnI0F2lsZi8jllPgZ8Vg4+LQdx2k8CFzK0uElWM="
    },{
        "objectId":"0x52dc4b2cbda2f25aa16abce3fa601590ffb4460d",
        "version":1,
        "digest":"L5Nli5HyIM2slXS0/10mfCLhRlz8mwLa4po39PiFchE=",
        "type":"0x2::coin::Coin<0x2::sui::SUI>",
        "owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},
        "previousTransaction":"I9gs5Mg99iRVZoDqHOac2dov5UZLeBlHHBpBKYy2aKA="
    },{
        "objectId":"0x5c0540ad3c3b5baf0b7b06cb4d8b0f8189bcc95a",
        "version":1,
        "digest":"KPCGtTtKC07fGHSUUtqplAqHiH1b5yE+VMpJb7fr05Q=",
        "type":"0x2::coin::Coin<0x2::sui::SUI>",
        "owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},
        "previousTransaction":"lKtBzvqCts//AkEj+HtmGV0meI+thttgWwHkbWrnK7M="
    }
],
"id":1}
```

Here we formatted the output a bit, the initial one is quite hard to read. From now on we will save the output to a temporary JSON file to get it formatted and readable.

We the big output we can reach several conclusions. We can see that each object in the result has an `objectId`. This `objectId` is the UID mentioned previously. It is unique for each object in the Sui network. We can see the type `0x2::coin::Coin<0x2::sui::SUI`, `0x2` address contains ??? packages that are native to Sui like the SUI Coin module, the transfer function, the TxContext global object etc... Thus `0x2::sui::SUI` is a SUI token. The owner is the address and every object has a `previousTransaction` field. The number of transactions an object has been through can be seen from `"version": 1`, all our coins are freshly minted by faucet so their version is 1, they have experienced a single transaction so far.

## 2nd Example, check the details of an Object

Now let's check the `objectId` for one of the previously returned coins and check more details about it using the `sui_getObject` method.

```bash
# set the id as a variable
id="0x11aee1d5736683a2285251306b83068983119d96"
# create the JSON
data="{\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"sui_getObject\", \"params\": ["$id"]}"
# fire the request and save the result in a tmp file
curl -X POST -H 'Content-type: application/json' --data-raw "$data" $rpc > tmp.json
```
