module coin_example::usdx {
    use std::option;

    use sui::coin::{Self, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    // consts
    const MAX_SUPPLY: u64 = 1000000000; // 1 billion max
    // errors
    const EMaxSupplyExceeded: u64 = 0;
    // structs
    struct USDX has drop {}

    fun init(witness: USDX, ctx: &mut TxContext) {
        // create a treasury
        let (treasury, metadata) = coin::create_currency(
            witness,
            4,
            b"USDX",
            b"USDX",
            b"Sample stable coin",
            option::none(),
            ctx);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
        transfer::public_transfer(metadata, tx_context::sender(ctx));
        
    }

    entry fun mint<USDX>(cap: &mut TreasuryCap<USDX>, amount: u64, ctx: &mut TxContext) {
        let new_coin = coin::mint<USDX>(cap, amount, ctx);
        transfer::public_transfer(new_coin, tx_context::sender(ctx));

    }

    entry fun mint_and_send<USDX>(cap: &mut TreasuryCap<USDX>, amount: u64, recipient: address, ctx: &mut TxContext) {
        let new_coin = coin::mint<USDX>(cap, amount, ctx);
        transfer::public_transfer(new_coin, recipient);
    }
}