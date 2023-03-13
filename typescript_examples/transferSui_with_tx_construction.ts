import {
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
  Connection,
  RpcTxnDataSerializer,
} from "@mysten/sui.js";
// types
import { UnserializedSignableTransaction } from "@mysten/sui.js";

/* In order to do any transaction a signer of type RawSigner object is required.
   The RawSigner requires a keypair object that can be derived either from a mnemonic or a private key (32 bytes long Uint8Array)
*/

// our address
const address = "0xa38bc2aa63c34e37821f7abb34dbbe97b7ab2ea2";

// The provider object holds all the read methods and governs rpc client->server communication
// we use devnet here but this is customizable
const connection = new Connection({
  fullnode: "https://fullnode.devnet.sui.io",
  faucet: "https://faucet.devnet.sui.io/gas",
});
const provider = new JsonRpcProvider(connection);

// This is an example on how to define a RawSigner when knowing the mnemonic
const getSignerFromMnemonic = (
  provider: JsonRpcProvider,
  mnemonic: string
): RawSigner => {
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const signer = new RawSigner(keypair, provider);
  return signer;
};
const mnemonic =
  "giant piano scene gas dance unlock initial brass calm brisk west space";
let signer = getSignerFromMnemonic(provider, mnemonic);

// This is an example on how to define a RawSigner when the private key is known
const getSignerFromPrivateKey = (
  provider: JsonRpcProvider,
  privKey: Uint8Array
): RawSigner => {
  const keypair = Ed25519Keypair.fromSecretKey(privKey);
  const signer = new RawSigner(keypair, provider);
  return signer;
};
const privKey = [
  64, 33, 18, 129, 136, 164, 29, 72, 239, 96, 52, 154, 150, 171, 75, 60, 77, 41,
  39, 97, 102, 68, 153, 22, 250, 49, 38, 5, 66, 251, 14, 128,
];

signer = getSignerFromPrivateKey(provider, Uint8Array.from(privKey));

// transaction construction of a transferSui transaction
// the procedure is tha same for any kind of transaction, the arguments differ
const constructTransaction = async () => {
  // the transferSui takes the address of a coin as input and does not require the address of another coin for gas
  // gas will be deducted from the coin in the arguments
  const coin = "0xc7e5500000000000000000000000000000000050";
  // amount is how many MIST (1 SUI = 10^9 MIST) we want to send
  const amount = 10000;
  // recipient is the address that will receive the SUI
  const recipient = "0x6d94aeff6f16f1dc326be9865aa5ec14d2fb6f36";
  const transaction: UnserializedSignableTransaction = {
    kind: "transferSui",
    data: {
      suiObjectId: coin,
      recipient,
      amount,
      gasBudget: 5000,
    },
  };
  // for the correct arguments for all possible transactions check
  // https://github.com/MystenLabs/sui/blob/main/sdk/typescript/src/signers/txn-data-serializers/txn-data-serializer.ts

  // our sdk provides a serializer to construct the transaction, it needs the URL of the full node
  const serializer = new RpcTxnDataSerializer(
    "https://fullnode.devnet.sui.io:443/"
  );
  const transactionBytes = serializer.serializeToBytes(
    address,
    transaction,
    "Commit"
  );
  return transactionBytes;
};

// how to execute a transaction
const execute = async () => {
  const trBytes = await constructTransaction();
  const res = await signer.signTransaction(trBytes);
  const signature = res.signature;
  // The third argument in the following is when should the method return
  // WaitForLocalExecution means that the full node is aware of the state change due to the transaction
  // WaitForEffectsCert means that the transaction has successfully executed, if the status is success, but the full node might not be yet aware
  const result = await provider.executeTransaction(
    trBytes,
    signature,
    "WaitForLocalExecution"
  );
  console.log(JSON.stringify(result));
};
execute();
