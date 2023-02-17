module coin_example::shive {
    use std::option;

    use sui::coin::{Self, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    // consts
    const MAX_SUPPLY: u64 = 1000000000; // 1 billion max
    // errors
    const EMaxSupplyExceeded: u64 = 0;
    // structs
    struct SHIVE has drop {}

    fun init(witness: SHIVE, ctx: &mut TxContext) {
        // create a treasury
        let (treasury, metadata) = coin::create_currency(
            witness,
            18,
            b"SHIVE",
            b"SuiHive",
            b"A very cool coin",
            option::none(),
            ctx);
        transfer::transfer(treasury, tx_context::sender(ctx));
        transfer::transfer(metadata, tx_context::sender(ctx));
        
    }

    entry fun mint_shive<SHIVE>(cap: &mut TreasuryCap<SHIVE>, amount: u64, ctx: &mut TxContext) {
        assert!(amount + coin::total_supply<SHIVE>(cap) < MAX_SUPPLY, EMaxSupplyExceeded);
        let new_coin = coin::mint<SHIVE>(cap, amount, ctx);
        transfer::transfer(new_coin, tx_context::sender(ctx));

    }
}