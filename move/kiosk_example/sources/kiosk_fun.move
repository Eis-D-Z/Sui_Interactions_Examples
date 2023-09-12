module kiosk_example::kiosk_fun {
    use sui::coin;
    use sui::kiosk::{Kiosk, KioskOwnerCap, Self};
    use sui::object::{Self, UID, ID};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::transfer_policy::{Self, TransferPolicy};
    use sui::tx_context::{Self, TxContext};


    struct KNft has key, store{
        id: UID,
        exchanged: u64,
        initial_price: u64
    }

    struct Box has key {
        id: UID,
        nft: KNft
    }

    #[allow(unused_field)]
    struct SharedObj has key, store {
        id: UID,
        empty_transfer_policy: TransferPolicy<KNft>
    }

    // Pattern to airdrop NFT's into a kiosk with lock

    public fun mint_wrapped(ctx: &mut TxContext) {
        let nft = KNft {
            id: object::new(ctx),
            exchanged: 0,
            initial_price: 10
        };

        let wrapped = Box {
            id: object::new(ctx),
            nft
        };
        transfer::transfer(wrapped, tx_context::sender(ctx));
    }

    public fun unwrap(kiosk_cap: &KioskOwnerCap, kiosk_: &mut Kiosk, policyWrapper: &SharedObj, box: Box) {
        let Box {id, nft} = box;
        kiosk::lock<KNft>(kiosk_, kiosk_cap, &policyWrapper.empty_transfer_policy, nft);
        object::delete(id);
    }

    // Pattern to unlock NFT
    // This requires an empty TransferPolicy, that is without rules.
    // Usually this TransferPolicy is wrapped in a shared object so others cannot access it.
    // This function makes sense to be guarded from arbitrary calls, in this example is left unguarded.

    public fun unlock(policyWrapper: &SharedObj, kiosk: &mut Kiosk, kiosk_cap: &KioskOwnerCap, id: ID, ctx: &mut TxContext): KNft {
        // first create a PurchaseCap that allows a single party to buy for free the NFT
        let purchase_cap = kiosk::list_with_purchase_cap<KNft>(kiosk, kiosk_cap, id, 0, ctx);
        // do the purchase
        let (nft, transfer_request) = kiosk::purchase_with_cap<KNft>(kiosk, purchase_cap, coin::zero<SUI>(ctx));
        // resolve the request hot potato
        let (_item_id, _paid, _from_id) = transfer_policy::confirm_request<KNft>(&policyWrapper.empty_transfer_policy, transfer_request);

        nft
    }

    
}