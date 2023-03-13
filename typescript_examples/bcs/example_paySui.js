// imports
const suijs = require("@mysten/sui.js");
const sha3 = require("sha3");
const bcs = require("@mysten/bcs");
const tweetnacl = require("tweetnacl");


/* Example of offline transaction building for paySui, this assumes you can get build the coin reference */


// the private key, this should be kept secret at all times
const privateKey = [
  64, 33, 18, 129, 136, 164, 29, 72, 239, 96, 52, 154, 150, 171, 75, 60, 77, 41,
  39, 97, 102, 68, 153, 22, 250, 49, 38, 5, 66, 251, 14, 128,
];
// the keypair
const keypair = suijs.Ed25519Keypair.fromSecretKey(Uint8Array.from(privateKey));
// our address
const signer = "0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2";
// the coin
const coin = "0xc7e5500000000000000000000000000000000063";
// the respective reference, this can be build with bcs or can be requested from the full node (it appeares in the getObject response)
const coinRef = {
  objectId: "0xc7e5500000000000000000000000000000000063",
  version: 1,
  digest: "U3+dNJ9v/dKfEMADN07Q3gX9ws3ebmu+wd5htCU1y5c=", // this is SHA256 of the BCS of the object data
};
// address that will get the coins
const recipients = ["0x6d94aeff6f16f1dc326be9865aa5ec14d2fb6f36"];
// how much will the recipient will get
const amounts = ["20000"]


// how to get the transaction bytes
const getTransationBytes = () => {
  const transaction = {
      PaySui: {
          coins: [coinRef],
          recipients: recipients,
          amounts: amounts
      }
  }

  const trKind = {Single: transaction};
  const toSerialize = {
      messageVersion: 1,
      kind: trKind,
      sender: signer,
      gasData: {
          payment: coinRef, // for paySui the first coin in input_coins is used for gas
          price: 1, // this is for devnet can be found with provider.getReferenceGasPrice()
          budget: 10000,
          owner: signer,
      },
      expiration: { None: null },
  }

  // this is still offline
  const transactionBytes = suijs.bcs.ser('TransactionData', toSerialize, 8192).toBytes();
  return Array.from(transactionBytes); // return an array so we can add things to it
}

// how to get the signature

const getSignature = (transactionBytes) => {
  // we have to add 0, 0, 0 in front of the transactions bytes before we sign it
  // these for now will be always 0, 0, 0 in the future with more functionality added it will change
  const bytesToSign = new Uint8Array(3 + transactionBytes.length);
  bytesToSign.set([0, 0, 0]);
  bytesToSign.set(transactionBytes, 3);
  const signedBytes = tweetnacl.sign.detached(Uint8Array.from(bytesToSign), keypair.keypair.secretKey);
  // here: keypair.signData(Uint8Array.from(bytesToSign)) yields the same result

  // signature is < flag | signedBytes | public key> where flag is 0 for ED25519 and 1 for Secp256k1
  // so its length should be 1 + 32 + whatever length the signedBytes have
  const signature = new Uint8Array(1 + signedBytes.length + 32)

  // this example uses ED25519 so flag is 0
  signature.set(0x00);
  // set the signedBytes
  signature.set(signedBytes, 1)
  // set the public key
  signature.set(Array.from(keypair.getPublicKey().toBytes()), 1 + signedBytes.length);
  // return b64 representation
  return suijs.toB64(signature);

} 

// execute the transaction
const execute = async (transactionBytes, signature) => {
  // instead of using axios create a provider that can do read calls and execute transaction
  const provider = new suijs.JsonRpcProvider(suijs.devnetConnection);
  const result = await provider.executeTransaction(transactionBytes, signature, "WaitForLocalExecution");
  return result;
}
// getting the transaction bytes
const trb = getTransationBytes();
trb.pop(); // this is due to a bug that will be fixed soon, the transaction bytes have one additional 0 at the end
const sig = getSignature(trb);


execute(Uint8Array.from(trb), sig).then(response => {
  console.log(JSON.stringify(response));
});

