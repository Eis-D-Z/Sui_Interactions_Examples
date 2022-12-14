import { Ed25519Keypair, JsonRpcProvider, RawSigner } from '@mysten/sui.js';
import * as fs from "fs";


/*
    payAllSui is a special type of native Sui function that get its gas from the input, unlike all other functions which require a gas argument.
    It accepts an array of coins, it merges them all into one coin and then transfers it to an address.
    Only caveat is that the first coin in the array must have enough balance to pay for the gas.
    
    The arguments are inputCoins: array[string] | recipient: string | gasBudget: number
    The inputCoins argument is an array with all the on-chain id's of the coins we want to merge and send
    Recipient is the on-chain address of the one who will get the coin.
    
    Assuming we have some coins we want to merge we can use payAllSui and set as recipient our address.
*/

async function payAllSuiExample(signer: RawSigner) {

    // payAllSui example
    // -------------------------------------------------------------------------- //

    const address = await signer.getAddress();

    // some coins in our address, in this case freshly gotten from faucet
    const coins = [
        "0x47aca5cc60b94306054c49245b5c8faf4da48a82",
        "0x34714bb5e867f786a369e79ddaf41d64b44d18f0",
        "0x7f2c91dceb49ee6c3f245ca87cccbdff29c368bf",
        "0xb23b036f3a4e49b59d8dcde18f019acf764dbcc1",
        "0xe5fdd8134b529b7bbbacd6af81f02304e59361a0"
    ]

    return await signer.payAllSui({
        inputCoins: coins,
        recipient: address,
        gasBudget: 10000
    });
}
    // -------------------------------------------------------------------------------------------- //
    // paySui example

    /* 
        paySui is a special function that doesn't have a gas argument. It deducts the gas from the input arguments.
        The function accepts an array of coins, an array of amounts and an array of recipients.
        
        The array of coins gets merged into one coin which then it is split into coins as dictated by the amounts array,
        and then each coin is sent to the respective recipient.
        
        The amounts array and recipients array must be of equal length, the first amount will be sent to the first recipient,
        the second amount, to the second recipient etc...
        
        Whatever is left, minus the gas, remains for the caller.
        
        When using this function always take into consideration that some remainder must exist, since exact gas calulcation is impossible, it follows
        that sum(amount[]) + gas < sum(input_coins[]), the sum of all the amounts should be strictly less than the total value of the input coins.
    */

async function paySuiExample(signer: RawSigner) {

    const address = await signer.getAddress(); // 0xa3968c45418b86098ae4b32e33e4c5e3ba1caa8e

    // In this example we will use paySui to split a large coin into 4 coins with 10000 MIST value, and send one of them to another user.

    // The coin in this case will be the one that resulted from the previous payAllSui example
    // Notice that it is the same as the first id in the previous coins array
    // Both paySui and payAllSui will preserve the first coin in the inputCoins array
    const paySuiCoins = ["0x47aca5cc60b94306054c49245b5c8faf4da48a82"];
    const otherUser = "0xb38bb5d7e904c3acf6790149d50272c20fba529e"
    // The recipients array must be of length 4, each entry will be our address
    const recipients = [address, address, address, otherUser];
    // The amounts array will also be of length 4, each entry 10000
    const amounts = [10000, 10000, 10000, 10000];

    return await signer.paySui({
        inputCoins: paySuiCoins,
        recipients: recipients,
        amounts: amounts,
        gasBudget: 10000
    });


}

// pay example
// ------------------------------------------------------------------------

/* 
    pay is a more normal type of transaction in the fact that it requires a gas object.
    Like paySui it has the same inputs and works in the same manner. The difference is that the input coins won't get merged unless necessary.
    The function requires amounts, recipients and inputCoins as arguments with the first two having the same 1 to 1 relationship as paySui.
*/

async function payExample(signer: RawSigner) {

    const address = await signer.getAddress();
    const receipient1 = "0x18bc649aa5ec90c18a17fab8cad5d2a8a4ac60a5";
    const receipient2 = "0x34035116c9984490607a0c040f2eecce4dcd309b";
    const coins = [
        "0x34714bb5e867f786a369e79ddaf41d64b44d18f0",
        "0x7f2c91dceb49ee6c3f245ca87cccbdff29c368bf",
        "0xb23b036f3a4e49b59d8dcde18f019acf764dbcc1",
    ]
    const gas_coin = "0xe5fdd8134b529b7bbbacd6af81f02304e59361a0";
    const amounts = [5000, 5000];
    const recipients = [receipient1, receipient2];

    return await signer.pay({
        inputCoins: coins,
        amounts,
        recipients,
        gasPayment: gas_coin,
        gasBudget: 1000
    });

}


// getting a signer
const keypair = new Ed25519Keypair();
const provider = new JsonRpcProvider();
const signer = new RawSigner(keypair, provider);

signer.getAddress().then(address => {
    provider.requestSuiFromFaucet(address);
});

payAllSuiExample(signer).then(response => {
    console.log(response);
});
paySuiExample(signer).then(response => {
    console.log(response);
});
payExample(signer).then(response => {
    console.log(response);
});
