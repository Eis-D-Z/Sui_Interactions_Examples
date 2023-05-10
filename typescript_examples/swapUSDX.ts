import { Ed25519Keypair, fromB64, JsonRpcProvider, TransactionBlock, devnetConnection, getObjectReference, RawSigner } from "@mysten/sui.js";

// type definition
interface ObjectRef {
    objectId: string;
    version: string | number;
    digest: string;
  }

const pkg = "0x994f550ad748696b4cc5abfa9eae11a5908ae31f139af161bd0ce5ed7224fd77";
const module_ = "usdx";
const poolId = "0x01beb3c6b44f155397cb31e46ed61d883182167091030e53b57a0c6f7ada82e9";

// helper function, irrelevant to the example but needed to work
const fillPool = async (singer: RawSigner) => {
    const treasuryCap = "0x03961db63acb2182c2ad695850b9f1ac20c9a281b4cf609be5008aa8680b5319";

    const tx = new TransactionBlock();

    // add usdx to the pool
    let amount = "50000000"
    tx.moveCall({
        target: `${pkg}::${module_}::add_usdx`,
        typeArguments: [`${pkg}::${module_}::USDX`],
        arguments: [tx.object(treasuryCap), tx.object(poolId), tx.pure(amount, "u64")]
    });
    singer.signAndExecuteTransactionBlock({transactionBlock: tx});
}

const provider = new JsonRpcProvider(devnetConnection);

const getRefs = async (objects: string[]) => {
    const result: ObjectRef[] = [];
    for (let obj of objects) {
        const resp = await provider.getObject({id: obj});
        const ref = getObjectReference(resp);
        if(ref != null) result.push(ref);
    }
    return result;
}

const swapSUIForUSDX = async (amount: string, suiCoinRefs: ObjectRef[], callerAddress: string, signer: RawSigner) => {
    const tx = new TransactionBlock();
    tx.setGasPayment(suiCoinRefs);
    // create a coin with the exact amount
    const coin = tx.splitCoins(tx.gas, [tx.pure(amount)]);
    // call the move function and get the result
    const usdxCoin = tx.moveCall({
        target: `${pkg}::${module_}::buy_usdx`,
        typeArguments: ["0x2::sui::SUI", `${pkg}::${module_}::USDX`],
        arguments: [tx.object(poolId), coin]
    });
    // transfer the result to the caller
    tx.transferObjects([usdxCoin], tx.pure(callerAddress));
    tx.setGasBudget(100000000);
    return await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {showBalanceChanges: true},
        requestType: "WaitForLocalExecution"
    });
}


const example = async () => {
  // getting the signer
  const b64PrivateKey = "ACGrHNXjXYqasmhChBDTvItmj6eDFhBNVwF1cYiGsTmA";
  const privkey: number[] = Array.from(fromB64(b64PrivateKey));
  privkey.shift();
  const privateKey = Uint8Array.from(privkey);
  const keypair = Ed25519Keypair.fromSecretKey(privateKey);
  const address = `${keypair.getPublicKey().toSuiAddress()}`;
  const signer = new RawSigner(keypair, provider);
  
  // a coin we have
  const coins = ["0x8c3ceba1f38ea7d26ce3293901f40fc968bf08b2d2aaa1667b2454b5cc8eb229"];

  const coinRefs = await getRefs(coins);
  // we want 5 USDX, thus 5 SUI
  const amount = "5000000000";
  const response = await swapSUIForUSDX(amount, coinRefs, address, signer);
  console.log(JSON.stringify(response));
}
example();