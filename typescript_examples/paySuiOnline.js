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
    for (let coin of coins) {
        const res = await provider.getObject({id: coin});
        coinsRef.push(sui.getObjectReference(res));
    }
    tx.setGasPayment(coinsRef);
    recipients.map((recipient, index) => {
        const coin = tx.splitCoin(tx.gas, tx.pure(amounts[index]));
        tx.transferObjects([coin], tx.pure(recipient));
    })
    tx.setSender(address);
    const digest = await signer.getTransactionDigest(tx);
    const txBytes = await tx.build({provider});
    return {
        digest,
        bytes: txBytes
    }
}

// sample data to test
const coins = ["0x0d1c61b3aa9b011c48230cc368479de4cdf527cd0f82ec4e7ddf52aa2214c9bc", "0x656333e9ef93c86de5e48a674ae7079c19a73b3857bd2129e7e91774b1ba8a0f"];
const amounts = ['10000', '444', '8899', '3301'];
const recipients = [
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54"
]
paySuiSample(coins, amounts, recipients).then(res => {console.log(res)});

// provider.requestSuiFromFaucet(address);