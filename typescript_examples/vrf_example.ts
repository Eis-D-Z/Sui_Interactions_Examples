import { TextEncoder } from "util";
import { exec } from "child_process";
import { RawSigner, TransactionBlock } from "@mysten/sui.js";
import getSigner from "./get_signer";

/*
    In order to follow along with this demo, first follow the instructions at
    https://docs.sui.io/learn/cryptography/ecvrf
    on how to clone the fastcrypto library and generate the keys below
*/
const fastcryptoPath = "~/work/fastcrypto";
// private key should always be kept hidden behind an .env or better
const privateKeyHex =
  "c70e32f27b69e954b048fc8815da66d67bd28d9a8957a30cdbab6972144fac06";
const publicKeyHex =
  "e2a3d23220c7087a943e3235ac3d6c9dafb579cb871df579772f3b6e8320a62b";

const pkg =
  "0x52d7dfa49ea376c390030c4d64b981c3c4a2b92bf37e55bbdb2f10e05a2a6ea8";
const treasury =
  "0x28aad89ec379ab0c7d001da2ee718d3454f579ff9bf98ef16b76328cc2a8b608";

// ----------- helpers --------------

const toHexString = (byteArr: Uint8Array) => {
  return Array.from(byteArr, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};
const getOutput = (randomInput: string, rarity: string, callback: any) => {
  let encoder = new TextEncoder();
  let byteArr = encoder.encode(randomInput);
  let hexStr = toHexString(byteArr);
  let result = "";
  exec(
    `cd ${fastcryptoPath} \n cargo run --bin ecvrf-cli prove --input ${hexStr} --secret-key ${privateKeyHex}`,
    (err, stdout, _stderr) => {
      if (err) {
        console.error(err);
      } else {
        callback(stdout, hexStr);
      }
    }
  );
};

const mintRareFire = async (
  coinId: string,
  picks: string[],
  address: string,
  signer: RawSigner
) => {
  const tx = new TransactionBlock();
  // const picksArray = picks.map(pick => tx.pure(pick, "vector"));
  const box = tx.moveCall({
    target: `${pkg}::gacha_example::mint`,
    typeArguments: [`${pkg}::gacha_example::Fire`],
    arguments: [
      tx.object(treasury),
      tx.pure("rare"),
      tx.pure(picks, "vector<string>"),
      tx.object(coinId),
    ],
  });
  tx.transferObjects([box], tx.pure(address));

  // this should be called with wallet.signAndExecuteTransaction in an actual aplication
  const response = signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  return response;
};

const openBox = async (
  box: string,
  output: number[],
  input: number[],
  proof: number[],
  address: string,
  signer: RawSigner
) => {
  const tx = new TransactionBlock();

  const ticket = tx.moveCall({
    target: `${pkg}::gacha_example::open`,
    typeArguments: [`${pkg}::gacha_example::Fire`],
    arguments: [
      tx.object(box),
      tx.pure(output, "vector<u8>"),
      tx.pure(input, "vector<u8>"),
      tx.pure(proof, "vector<u8>"),
    ],
  });
  tx.setSender(address);

  tx.moveCall({
    target: `${pkg}::gacha_example::transfer_ticket`,
    typeArguments: [`${pkg}::gacha_example::Fire`],
    arguments: [ticket]
  });

  const response = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  console.log(response);
};

const main = async () => {
  // create the player's signer which would mimic the wallet
  const { address, signer } = getSigner();
  const coinId =
    "0xe4f2c846b3b891e766b5eacff0a73647a1588dcd220c4280fbe70cf8f6b73d92";
  const picks = [
    "no1",
    "no2",
    "no3",
    "no4",
    "no5",
    "no6",
    "no7",
    "no8",
    "no9",
    "no10",
    "no11",
    "no12",
    "no13",
    "no14",
    "no15",
    "no16",
  ];
  const resp: any = await mintRareFire(coinId, picks, address, signer);
  const box_id = resp.effects?.created[0].reference.objectId;
  const callback = async (stdout: string, input: string) => {
    let [proof, output] = stdout.split('\n');
    proof = proof.replace("Proof:  ", "");
    output = output.replace("Output: ", "");
    const proofArray = Array.from(Uint8Array.from(Buffer.from(proof, 'hex')));
    const outputArray = Array.from(Uint8Array.from(Buffer.from(output, 'hex')));
    const inputArray = Array.from(Uint8Array.from(Buffer.from(input, 'hex')));
    const resp = await openBox(box_id, outputArray, inputArray, proofArray, address, signer);
    console.log(resp)
  }

  getOutput("Lucky me!", "rare", callback);
  // the above will always return no12 in the ticket.result
  // In a real application the "Lucky me!" should contain a unique part, eg: gacha-box id, and append to that a string chosen by the user
  // eg: getOutput(`${box_id}--user-picked-string`, "rare", callback)
};

main();
