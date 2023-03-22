const sui = require("@mysten/sui.js");


const provider = new sui.JsonRpcProvider(sui.localnetConnection);

const getObjectRefs = async (ids) => {
    const res = []
    for (let id of ids) {
        const resp = await provider.getObject({id});
        res.push(sui.getObjectReference(resp));
    }
    

    return res;
}

// the object reference needs the version this should be known from past transactions responses
// or some other place, above there is some code that could do that
const coins = [
    "0xdbb748090dd71bab04c2b8d79c51a35bec99aa260cc26656e0158d5821291eac", 
    "0x2799ee31695f8e4bfceb63683b759f1ddd3e6bdb42ee3789985f8108800e25cd"
];

const coinRefs = [
    {
      objectId: '0xdbb748090dd71bab04c2b8d79c51a35bec99aa260cc26656e0158d5821291eac',
      version: 2,
      digest: 'CkGsHHz6MucRxbmnoRTvk1xd6k2VKxmkX1G23V8WyJN2'
    },
    {
      objectId: '0x2799ee31695f8e4bfceb63683b759f1ddd3e6bdb42ee3789985f8108800e25cd',
      version: 2,
      digest: 'H99z8oDTCXhtSQt2uuAAZMRwUij9Hc6xt9L8u93hk7Ho'
    }
  ];

const paySuiTxBytes = async (coinRefs, amounts, recipients, sender) => {
    const tx = new sui.Transaction();
    // const inputs = coinRefs.map(ref => tx.object(sui.Inputs.ObjectRef(ref)));
    tx.setGasPayment(coinRefs);
    tx.setGasPrice(1);
    tx.setSender(sender);
    // optional for offline as well
    tx.setExpiration({Epoch: 123});
    tx.setGasBudget(10000);
    const pureAmounts = amounts.map (amount => tx.pure(amount, "u64"));
    const newCoins = tx.splitCoins(tx.gas, pureAmounts);
    
    recipients.map((recipient, index) => {
        tx.transferObjects([newCoins[index]], tx.pure(recipient, "string"));
    });
    return await tx.build();
}

const ams = [
    "100",
    "2500"
]
const recipients = [
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
    "0x318456e35f0099ac0487ca222cb701ad1053e049ff4a2e4a472bcb696685bf54",
]

const ourAddress = "0xf74aa70d29a225c2c033cb3e6a5497a08fe646a9e6f01722862a183725197673";

paySuiTxBytes(coinRefs, ams, recipients, ourAddress).then(res => {
    console.log(res);
});