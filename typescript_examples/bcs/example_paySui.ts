import { BCS, getSuiMoveConfig, StructTypeDefinition, EnumTypeDefinition } from "@mysten/bcs";
import { JsonRpcProvider, Connection, fromB64, toB64 } from "@mysten/sui.js";




const connection = new Connection({
    fullnode: "https://fullnode.devnet.sui.io",
    faucet: "https://faucet.devnet.sui.io/gas",
  });
const provider = new JsonRpcProvider(connection);

const t = async () => {
    const r = await provider.getObject("0xc7e5500000000000000000000000000000000063");
    console.log(JSON.stringify(r));
    const refGasprice = await provider.getReferenceGasPrice();
    console.log(refGasprice);
}
t();
