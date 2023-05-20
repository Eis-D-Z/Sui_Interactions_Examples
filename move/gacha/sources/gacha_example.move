module gacha::gacha_example {
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::ecvrf;
    use sui::object::{Self, UID};
    use sui::sui::SUI;
    use sui::transfer;

    use sui::tx_context::{Self, TxContext};


    use std::string::{Self,String};
    use std::vector;

    // consts

    // errors
    const EInsufficientFunds: u64 = 0;
    const ECannotVerifyLuckyNumber: u64 = 1;
    const EPicksLengthNot16: u64 = 2;

    // hardcoded prices for demo purposes
    const PRICE_NORMAL: u64 = 10;
    const PRICE_RARE: u64 = 30;
    const PRICE_SR: u64 = 70;
    const PRICE_SSR: u64 = 120;
    const MIST: u64 = 1_000_000_000;
    const PICKS_LENGTH: u64 = 16;

    const PUBLIC_KEY: vector<u8> = x"e2a3d23220c7087a943e3235ac3d6c9dafb579cb871df579772f3b6e8320a62b";


    struct Earth has drop {}
    struct Fire has drop {}
    struct Water has drop {}
    struct Wind has drop {}

 
    struct Treasury<phantom SUI> has key, store {
        id: UID,
        fund: Balance<SUI>,
    }

    // picks could be preminted object ids
    // or unique identifiers like NFT name with a redeem ticket
    struct GachaBox<phantom T> has key, store {
        id: UID,
        picks: vector<String>, // length is power of 2, arbitrarily chose 16
        rarity: String
    }
    
    // The user will get this from a gacha box so he can get an NFT minted,
    // other implementations are also possible
    // this struct does not have store so it is not tradable
    struct RedeemTicket<phantom T> has key {
        id: UID,
        result: String,
        lucky_number: vector<u8>,
        gacha_box_id: address
    }

    fun init(ctx: &mut TxContext) {

        let treasury = Treasury<SUI> {
            id: object::new(ctx),
            fund: balance::zero<SUI>()
        };

        transfer::public_share_object(treasury);
    }


     public fun mint<T: drop> (
        treasury: &mut Treasury<SUI>,
        rarity: vector<u8>,
        picks: vector<String>,
        fee: Coin<SUI>,
        ctx: &mut TxContext): GachaBox<T> {
        assert!(vector::length(&picks) == PICKS_LENGTH, EPicksLengthNot16);
        let value = coin::value(&fee);

        if (rarity == b"normal") {
            assert!(value == PRICE_NORMAL*MIST, EInsufficientFunds);
        } else if (rarity == b"rare"){
            assert!(value == PRICE_RARE*MIST, EInsufficientFunds);
        } else if (rarity == b"sr") {
            assert!(value == PRICE_SR*MIST, EInsufficientFunds);
        } else {
            assert!(value == PRICE_SSR*MIST, EInsufficientFunds);
        }; 
        balance::join(&mut treasury.fund, coin::into_balance(fee));
        let new_box = GachaBox<T> {
            id: object::new(ctx),
            picks,
            rarity: string::utf8(rarity)
        };
        new_box
     }

     public fun open<T>(
        gacha: GachaBox<T>,
        lucky_number: vector<u8>,
        lucky_input: vector<u8>,
        proof: vector<u8>,
        ctx: &mut TxContext): RedeemTicket<T> {
        assert!(ecvrf::ecvrf_verify(&lucky_number, &lucky_input, &PUBLIC_KEY, &proof), ECannotVerifyLuckyNumber);

        // since there are only 16 picks we will take the first u8 of lucky_number
        let random_number = *vector::borrow<u8>(&lucky_number, 0);
        let pick: u64 = (random_number as u64);
        pick = pick % 16;
        
        let GachaBox {id, picks, rarity: _} = gacha;
        let result = vector::remove<String>(&mut picks, pick);

        let gacha_box_id = object::uid_to_address(&id);
        // delete id
        object::delete(id);
        // return a redeem ticket for the player to get his NFT based on the result
        RedeemTicket<T> {
            id: object::new(ctx),
            result,
            lucky_number,
            gacha_box_id
        }
     }
    // --------------- getters ---------------------------
    public fun get_ticket_result<T>(ticket: &RedeemTicket<T>): &String {
        &ticket.result
    }
    public fun get_ticket_lucky_number<T>(ticket: &RedeemTicket<T>): &vector<u8> {
        &ticket.lucky_number
    }
    public fun get_ticket_gacha_box_id<T>(ticket: &RedeemTicket<T>): &address {
        &ticket.gacha_box_id
    }
    // -------------- Helper Funs -------------------------

    // Here I could have asked for address of recipient instead of TxContext.
    // I chose TxContext because I want the ticket to go to the address that called open<T>
    public fun transfer_ticket<T>(ticket: RedeemTicket<T>, ctx: &mut TxContext) {
        transfer::transfer(ticket, tx_context::sender(ctx));
     }

     // for tests
     #[test_only]
     public fun new_treasury(ctx: &mut TxContext): Treasury<SUI> {
        Treasury<SUI> {
            id: object::new(ctx),
            fund: balance::zero<SUI>()
        }
     }
}

#[test_only]
module gacha::tests {
    use std::string;
    // use std::debug;

    use sui::coin;
    use sui::sui::SUI;
    use sui::test_scenario as ts;
    use sui::transfer;

    use gacha::gacha_example::{Self, Treasury, GachaBox, Fire};

    const ETicketHasWrongResult: u64 = 0;

    const INPUT: vector<u8> = x"4c75636b79206d6521";
    const OUTPUT: vector<u8> = x"cbfede0d3670583241b7a40f855e0cd4fa40aa448021ca0abe562a47b689af8df50337859d90fba5158dc8aae079aee2ac31d62a19810d146cee3b450183595d";
    const PROOF: vector<u8> = x"7614d57a0bb98e04a4c0ea45c8b5ba5d8fd9a77d97676eb32944ec63a3ce675cfca42109a273a2e95400c681143e0bae0060e05239715ed9a6b954b293932dc6692d28d7e933f5065cc1c9e320cf700d";

    const PLAYER: address = @0xACDC;

    #[test]
    fun test_flow_rare() {
        let scenario = ts::begin(PLAYER);

        let treasury = gacha_example::new_treasury(ts::ctx(&mut scenario));
        transfer::public_share_object(treasury);

        let user_coin = coin::mint_for_testing<SUI>(30_000_000_000, ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, PLAYER);
        {
            let treasury = ts::take_shared<Treasury<SUI>>(&mut scenario);
            let picks = vector[
                string::utf8(b"pick1"),
                string::utf8(b"pick2"),
                string::utf8(b"pick3"),
                string::utf8(b"pick4"),
                string::utf8(b"pick5"),
                string::utf8(b"pick6"),
                string::utf8(b"pick7"),
                string::utf8(b"pick8"),
                string::utf8(b"pick9"),
                string::utf8(b"pick10"),
                string::utf8(b"pick11"),
                string::utf8(b"pick12"),
                string::utf8(b"pick13"),
                string::utf8(b"pick14"),
                string::utf8(b"pick15"),
                string::utf8(b"pick16"),
            ];
            let gacha_box: GachaBox<Fire> = gacha_example::mint<Fire>(&mut treasury, b"rare", picks, user_coin, ts::ctx(&mut scenario));
            transfer::public_transfer(gacha_box, PLAYER);
            ts::return_shared(treasury);
        };

        ts::next_tx(&mut scenario, PLAYER);
        {
            let gacha_box = ts::take_from_sender<GachaBox<Fire>>(&mut scenario);
            let ticket = gacha_example::open<Fire>(
                gacha_box,
                OUTPUT,
                INPUT,
                PROOF,
                ts::ctx(&mut scenario)
            );

            assert!(gacha_example::get_ticket_result(&ticket) == &string::utf8(b"pick12"), ETicketHasWrongResult);
            gacha_example::transfer_ticket(ticket, ts::ctx(&mut scenario));
        };

        ts::end(scenario);
    }

}