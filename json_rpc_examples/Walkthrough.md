# Walkthrough

Welcome to the JSON RPC example walkthrough. We assume you already have an empty address. We will be using curl and of course, if javascript is more comfortable, you can easilly follow the examples with it through fetch calls or axios (or something similar).

Sui will be the network and SUI will mean the token.

All the commands that follow are meant for a bash terminal.
Let's first make sure the address exists and add it to a variable so we can type a bit a less:

```bash
 sui client active-address
 # 0xXXXXXXXXXXXXXXXXXXXXX
 address="0xXXXXXXXXXXXXXXXXXXXXX"
```

Here `0xXXXXXXXXXXXXXXXXXXXXX` is a placeholder and your address should appear, if it doesn't please follow the instructions <a href="https://docs.sui.io/build/devnet">here</a> to connect to the Sui network and get an address. If you choose a local installation then proceed to also get some SUI.

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
{"jsonrpc":"2.0","result":[{"objectId":"0x11aee1d5736683a2285251306b83068983119d96","version":1,"digest":"Bu5RPYiVWDDX4IshFqB8vsUdzBptTkhNK/Hm/b06wEA=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"8Dpc1+03kCviQRrB4hMUDT1z3bF+ZhlHtkG3RXHKuBg="},{"objectId":"0x3f20cc6615c199496a6ff1528a8a23823a3ba3e2","version":1,"digest":"bBaJ31nkAS4Swy9mwDmWCrR5fFeVMufteAJkQTjAH38=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"crQ008Z2bRbJGW3fWGYJQ21Hn3XryEj/idtk/Z7CASE="},{"objectId":"0x47effe51732d0b70e1a2c6b04c7fe1150fcc925d","version":1,"digest":"XYqAK1YseJWTEcOO62ysZ5jOgCtYiuH1ggl1TfGlw7M=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"MhhwQnI0F2lsZi8jllPgZ8Vg4+LQdx2k8CFzK0uElWM="},{"objectId":"0x52dc4b2cbda2f25aa16abce3fa601590ffb4460d","version":1,"digest":"L5Nli5HyIM2slXS0/10mfCLhRlz8mwLa4po39PiFchE=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"I9gs5Mg99iRVZoDqHOac2dov5UZLeBlHHBpBKYy2aKA="},{"objectId":"0x5c0540ad3c3b5baf0b7b06cb4d8b0f8189bcc95a","version":1,"digest":"KPCGtTtKC07fGHSUUtqplAqHiH1b5yE+VMpJb7fr05Q=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"lKtBzvqCts//AkEj+HtmGV0meI+thttgWwHkbWrnK7M="},{"objectId":"0x6e42879a647b79de721ede51f16b66bcd918cb15","version":1,"digest":"x/blew30LCSoOVa9HY8k+DZyZgWEV6jWSgcqvaUklU0=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"ehKQiB6IwupCO+yBi0qVz9HVU9n+BNJ22A9vN5f7Fsc="},{"objectId":"0x6ebf4288eb85ec536f8b57ba0730346d2e24d143","version":1,"digest":"5SpGRfPslVjlnATvKCDCmtHXmIurVpuAVF4GV9MOkds=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"m763isSnYYSCJ+CGdsa1qdHfbAleHzrZ7OQ/DrhDSVM="},{"objectId":"0x7ba3749248588815968c58e911c573992152a694","version":1,"digest":"KgXQzzyMipzi6objnv7E4rU6EUwArqVuU1JZa+VxDqw=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"YoKjKUx74O5vy1suheZrdF03vzxSv36PAGNHTXzmapI="},{"objectId":"0xd971beea67f4ced0974476d2f729592b6c02e7fd","version":1,"digest":"Py72Vj86gbtFnN8mpbPgONTbQali7lYS8E3U2Ur/y/s=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"ja4HZwtTUEmxilPLGmIVvW5YKfxRfjZBrNdxehlA4q0="},{"objectId":"0xf345d570959733323259346ac57711f4e98716a0","version":1,"digest":"FMMsQnmNKYXlnpCHZtaQ+xicr7XQ29bZuGZdB1WH+vE=","type":"0x2::coin::Coin<0x2::sui::SUI>","owner":{"AddressOwner":"0xfc08bf8efcc3db36218a9a315ff6c7a0bf0d3d12"},"previousTransaction":"oQ0V0UxrUGJpnnLoaRbf9stnZ8ruO1SRGTX7l+NM8bM="}],"id":1}
```