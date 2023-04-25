import {TransactionBlock, Ed25519Keypair, fromB64, JsonRpcProvider, RawSigner, testnetConnection} from "@mysten/sui.js";

// change the next four to values that are relevant for you
const b64PrivateKey = "ACGrHNXjXYqasmhChBDTvItmj6eDFhBNVwF1cYiGsTmA";
const pkg = "0xfb2549870c356356dc59af8efa529f2cee3a40f88451a63f60a2402aec3b3680";
const treasury = "0x25059b45f6611c4c679caf381224ad31182993aa848e31dfc11794e48d3f5963";
const recipient = "0x42993f8d97e701ab2555a7389afd3230afddca049387f20ae73f1f90941113b7";

const usdx_type = `${pkg}::usdx::USDX`;

const send_coin = async () => {
  const privkey: number[] = Array.from(fromB64(b64PrivateKey));
  const schemeByte = privkey.shift(); // this will be needed to form a signature
  const privateKey = Uint8Array.from(privkey);
  const keypair = Ed25519Keypair.fromSecretKey(privateKey);

  // our address
  const address = `${keypair.getPublicKey().toSuiAddress()}`;
  console.log(address);
  // In order to eventually execute a transaction we need a provider
  const provider = new JsonRpcProvider(testnetConnection);

  // if we want the digest before execution we need a signer
  const signer = new RawSigner(keypair, provider);

  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${pkg}::usdx::mint_and_send`,
    arguments: [tx.object(treasury), tx.pure("10000000", "u64"), tx.pure(recipient, "address")],
  });

  const res = await signer.signAndExecuteTransactionBlock({transactionBlock: tx, options:{showEffects: true}, requestType: "WaitForLocalExecution"});
  console.log(res);
}

send_coin();

