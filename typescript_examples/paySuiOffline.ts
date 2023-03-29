import {
  Ed25519Keypair,
  JsonRpcProvider,
  devnetConnection,
  TransactionBlock,
  toB64,
  fromB64,
  RawSigner,
} from "@mysten/sui.js";
import { blake2b } from '@noble/hashes/blake2b';

// type definition

interface ObjectRef {
  objectId: string;
  version: number;
  digest: string;
}

const getTxBytes = async (
  coinRefs: ObjectRef[],
  amounts: string[],
  recipients: string[],
  sender: string
) => {
  const tx = new TransactionBlock();
  tx.setGasPayment(coinRefs);
  tx.setGasBudget(10000);
  tx.setGasOwner(sender);
  tx.setGasPrice(1);
  tx.setSender(sender);
  const pureAmounts = amounts.map((amount) => tx.pure(amount));
  const newCoins = tx.splitCoins(tx.gas, pureAmounts);
  recipients.map((recipient, index) => {
    tx.transferObjects([newCoins[index]], tx.pure(recipient));
  });
  return await tx.build();
};

const getSignature = (
  txBytes: Uint8Array,
  keypair: Ed25519Keypair,
  schemeByte: number
) => {
  const dataToSign = new Uint8Array(3 + txBytes.length);
  dataToSign.set([0, 0, 0]);
  dataToSign.set(txBytes, 3);
  const digest = blake2b(dataToSign, {dkLen: 32});
  const rawSignature = keypair.signData(digest);
  const pubKey = keypair.getPublicKey().toBytes();
  const signature = new Uint8Array(1 + rawSignature.length + pubKey.length);
  signature.set([schemeByte]);
  signature.set(rawSignature, 1);
  signature.set(pubKey, 1 + rawSignature.length);
  return signature;
};

const execute = async (
  txBytes: Uint8Array,
  signature: Uint8Array,
  provider: JsonRpcProvider
) => {
  const result = await provider.executeTransactionBlock({
    transactionBlock: txBytes,
    signature: toB64(signature),
    options: { showBalanceChanges: true, showObjectChanges: true },
    requestType: "WaitForLocalExecution",
  });
  return result;
};

const main = async () => {
  // In order to create and sing a transaction online we are going to need our private key
  const b64PrivateKey = "ACGrHNXjXYqasmhChBDTvItmj6eDFhBNVwF1cYiGsTmA";
  const privkey: number[] = Array.from(fromB64(b64PrivateKey));
  const schemeByte = privkey.shift(); // this will be needed to form a signature
  const privateKey = Uint8Array.from(privkey);
  const keypair = Ed25519Keypair.fromSecretKey(privateKey);

  // our address
  const address = `${keypair.getPublicKey().toSuiAddress()}`;
  console.log(address);
  // In order to eventually execute a transaction we need a provider
  const provider = new JsonRpcProvider(devnetConnection);

  // if we want the digest before execution we need a signer
  const signer = new RawSigner(keypair, provider);

  const coins = [
    "0x4c6e29dd0c97b78527fcd956c66a891ce797125cbe5e165a6f011cf2f1d81be8",
  ];

  // this can be gotten with provider.getObject for each coin above, or through transaction responses
  const coinRefs = [
    {
      objectId: '0x4c6e29dd0c97b78527fcd956c66a891ce797125cbe5e165a6f011cf2f1d81be8',
      version: 449,
      digest: '3qQ8nqaPUr9mWWC4gSH5RWGZTdp5aoC2fpYEMpJYYyqf'
    }
  ]

  // the amounts we want to send
  const ams = ["100", "2500"];

  // the recipient of each amount
  const recipients = [
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
  ];
  const txBytes = await getTxBytes(coinRefs, ams, recipients, address);
  const signature = getSignature(txBytes, keypair, schemeByte!);
  // this will be returned by the execution response
  const digest = await signer.getTransactionBlockDigest(txBytes);
  console.log("The transaction digest is: ", digest);

  // execution
  const result = await execute(txBytes, signature, provider);

  console.log(result);
  // check the digest
  console.log("The digest in the response match with the one we had: ", result.digest === digest);
};

main();
