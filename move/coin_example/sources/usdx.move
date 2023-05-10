module coin_example::usdx {
    use std::option;

    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance::{Self, Balance};
    use sui::object::{Self, UID};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    // consts
    const MAX_SUPPLY: u64 = 1000000000; // 1 billion max
    const WALLET: address = @0x6f2d5e80dd21cb2c87c80b227d662642c688090dc81adbd9c4ae1fe889dfaf71;
    // errors
    const EMaxSupplyExceeded: u64 = 0;
    const ECoinValueTooLow: u64 = 1; // at least 0.01 SUI
    const ENotEnoughBalanceInPool: u64 = 2;

    // structs
    struct USDX has drop {}

    struct Pool<phantom SUI, phantom USDX> has key, store {
        id: UID,
        balance_usdx: Balance<USDX>,
        balance_sui: Balance<SUI>
    }

    fun init(witness: USDX, ctx: &mut TxContext) {
        // create a treasury
        let (treasury, metadata) = coin::create_currency(
            witness,
            2,
            b"USDX",
            b"USDX",
            b"Sample stable coin",
            option::none(),
            ctx);
        let pool = Pool {
            id: object::new(ctx),
            balance_sui: balance::zero<SUI>(),
            balance_usdx: balance::zero<USDX>()
        };

        transfer::public_share_object<Pool<SUI, USDX>>(pool);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
        transfer::public_transfer(metadata, tx_context::sender(ctx));
        
    }

    // good practice
    public fun mint<USDX>(cap: &mut TreasuryCap<USDX>, amount: u64, ctx: &mut TxContext): Coin<USDX> {
        let new_coin = coin::mint<USDX>(cap, amount, ctx);
        new_coin

    }

    // bad practice
    entry fun mint_and_send<USDX>(cap: &mut TreasuryCap<USDX>, amount: u64, recipient: address, ctx: &mut TxContext) {
        let new_coin = coin::mint<USDX>(cap, amount, ctx);
        transfer::public_transfer(new_coin, recipient);
    }

    // this is just a function to make the example easier:
    public fun  add_usdx<USDX>(cap: &mut TreasuryCap<USDX>, pool: &mut Pool<SUI, USDX>, amount: u64) {
        let balance_in = balance::increase_supply<USDX>(coin::supply_mut(cap), amount);
        balance::join(&mut pool.balance_usdx, balance_in);
    }

    // simple swap example
    public fun buy_usdx<SUI,USDX>(pool: &mut Pool<SUI, USDX>, coin_in: Coin<SUI>,
                                  ctx: &mut TxContext): Coin<USDX>
    {
        // assume it is 1-1
        let value = coin::value<SUI>(&coin_in);
        assert!(value > 10000000, ECoinValueTooLow);
        // this is kinda reduntant since it is checked by balance::take
        // if you feel that you can afford it, it helps to have personalized error messages
        assert!(value/10000000 < balance::value<USDX>(&mut pool.balance_usdx), ENotEnoughBalanceInPool);
        let balance_in = coin::into_balance(coin_in);
        balance::join(&mut pool.balance_sui, balance_in);
        
        coin::take(&mut pool.balance_usdx, value/10000000, ctx)
    }

    #[test_only]
    public fun init_(ctx: &mut TxContext) {
        let witness = USDX {};
        // create a treasury
        let (treasury, metadata) = coin::create_currency(
            witness,
            4,
            b"USDX",
            b"USDX",
            b"Sample stable coin",
            option::none(),
            ctx);
        let pool = Pool {
            id: object::new(ctx),
            balance_usdx: balance::zero<USDX>(),
            balance_sui: balance::zero<SUI>()
        };

        transfer::public_share_object<Pool<SUI, USDX>>(pool);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
        transfer::public_transfer(metadata, tx_context::sender(ctx));
    }
}

// tests
#[test_only]
module coin_example::tests {
    use coin_example::usdx::{Self, Pool, USDX};
    
    use sui::coin::{Self, TreasuryCap};
    use sui::sui::SUI;
    use sui::test_scenario as ts;
    use sui::transfer;

    const ADMIN: address = @0xAAA;
    const USER: address = @0xBBB;

    #[test]
    fun test_pool() {
        let scenario = ts::begin(ADMIN);
        {
            usdx::init_(ts::ctx(&mut scenario));
        };

        ts::next_tx(&mut scenario, ADMIN);
        {
            let pool = ts::take_shared<Pool<SUI, USDX>>(&mut scenario);
            let cap = ts::take_from_sender<TreasuryCap<USDX>>(&mut scenario);
            usdx::add_usdx<USDX>(&mut cap,&mut pool, 20000);

            ts::return_to_sender(&mut scenario, cap);
            ts::return_shared(pool);
        };

        ts::next_tx(&mut scenario, USER);
        {
            let pool = ts::take_shared<Pool<SUI, USDX>>(&mut scenario);
            let user_coin = coin::mint_for_testing<SUI>(5_000_000_000, ts::ctx(&mut scenario));
            let usdx_coin = usdx::buy_usdx(&mut pool, user_coin, ts::ctx(&mut scenario));
            assert!(coin::value(&usdx_coin) == 500, 10);
            transfer::public_transfer(usdx_coin, USER);
            ts::return_shared(pool);
        };
        // ts::next_tx(&mut scenario, USER);
        // {
        //     let usdx_coin = ts::take_from_sender<Coin<USDX>>(&scenario);
        //     assert!(coin::value(&usdx_coin) == 500, 10);
        //     ts::return_to_sender<Coin<USDX>>(&scenario, usdx_coin);
        // };

        ts::end(scenario);
    }
}