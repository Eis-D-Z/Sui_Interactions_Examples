const sui = require("@mysten/sui.js");

// This part is to get the private key and finally a keypair
// it can be also done with mnemonics
const pk = "AL9wfGJDGaZaUURTiPsGpjsA9Z8QV8tXFzGSpLzO7Y9K"
const privkey = Array.from(sui.fromB64(pk));
privkey.shift();
const privateKey = Uint8Array.from(privkey);
const keypair = sui.Ed25519Keypair.fromSecretKey(privateKey);

// get provider and singer
const provider = new sui.JsonRpcProvider(sui.localnetConnection);
const signer = new sui.RawSigner(keypair, provider);
const address = "0xf74aa70d29a225c2c033cb3e6a5497a08fe646a9e6f01722862a183725197673"

const paySuiSample = async (coins, amounts, recipients) => {
    const tx = new sui.Transaction();
    const coinsRef = [];
    // this is needed because we need the ref
    // an object ref is {id: <>, version: <>, digest: <>}
    for (let coin of coins) {
        const res = await provider.getObject({id: coin});
        coinsRef.push(sui.getObjectReference(res));
    }
    // this will merge all coins into coins[0]
    tx.setGasPayment(coinsRef);

    // here we use the gas payment to split the necessary coins
    recipients.map((recipient, index) => {
        const coin = tx.splitCoins(tx.gas, [tx.pure(amounts[index])]);
        tx.transferObjects([coin], tx.pure(recipient));
    })
    // we add the address that will sign
    tx.setSender(address);
    tx.setExpiration({Epoch: 123});
    // how to get the digest of the trEansaction
    const digest = await signer.getTransactionDigest(tx);
    // how to get the transation bytes
    const txBytes = await tx.build({provider});
    return {
        digest,
        bytes: txBytes
    }
}

// sample data to test
const coins = [
    "0x0819454dd36ae8a1842ec351520573dc6442ff7d4fec4d9c68099b1b753749bf", 
    "0x5e64a48caff391760440f9f0b25e5e28487248458f36b934570b1fbaf95c469b"
];
const amounts = ['10000', '444', '8899', '3301'];
const recipients = [
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54"
]
// paySuiSample(coins, amounts, recipients).then(res => {console.log(res)});

provider.requestSuiFromFaucet(address);