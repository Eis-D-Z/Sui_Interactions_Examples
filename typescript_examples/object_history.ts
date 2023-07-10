import {
  JsonRpcProvider,
  mainnetConnection,
} from "@mysten/sui.js";

const provider = new JsonRpcProvider(mainnetConnection);

const trblock = async (block: string, objectId: string) => {
  const result: any = await provider.getTransactionBlock({
    digest: block,
    options: {
      showEffects: true,
    },
  });

  let objItem;

  [objItem] = result.effects?.created?.filter((item: any) => {
    return item?.reference?.objectId === objectId;
  });
  if (!objItem) {
    [objItem] = result.effects?.mutated?.filter((item: any) => {
      return item?.reference?.objectId === objectId;
    });
  }

  if (!objItem) {
    // it was most probably deleted during this transaction
    const wasDeleted = result.effects?.deleted?.some((item: any) => {
      return item.objectId === objectId;
    });
    let msg = "";
    wasDeleted ? (msg = "Object was deleted") : (msg = "Cannot find owner");
    return msg;
  }

  // the owner can be address
  if (objItem?.owner?.AddressOwner) {
    return objItem.owner.AddressOwner;
  }

  // the owner can be a kiosk, then the first parent is a dynamic field which should be created in the same transaction
  const parent = objItem?.owner?.ObjectOwner;
  console.log(`Parent: ${parent}`);
  const [dynamicFieldItem] = result.effects?.created?.filter((item: any) => {
    return item?.reference?.objectId === parent;
  });
  console.log(`Dyn field: ${dynamicFieldItem}`);
  if (dynamicFieldItem) {
    const kioskId = dynamicFieldItem?.owner?.ObjectOwner;
    return getObjectOwner(kioskId);
  }

  // the owner is just a shared object (that is not a kiosk)
  return objItem.owner.AddressOwner;
};

const getObjectOwner = async (objectId: string) => {
  let res: any = await getObj(objectId);
  // owned by a kiosk
  if (res?.data?.type === "0x2::kiosk::Kiosk") {
    const own = res?.data?.content?.fields?.owner;
    console.log(`Owned by a kiosk`);
    return own;
  }
  let ownerObj: any = res.data?.owner;
  // owned directly by address
  if (ownerObj?.AddressOwner) {
    console.log("Owned by an address");
    return ownerObj.AddressOwner;
  }
  // owned by a marketplace or some other shared object
  if (ownerObj?.Shared?.initial_shared_version > 0) {
    console.log("Owned by a shared object that is not a Kiosk");
    return res?.data?.objectId;
  }
  const parent = ownerObj.ObjectOwner;
  getObjectOwner(parent);
};

const getObj = async (id: string) => {
  const res = await provider.getObject({
    id,
    options: {
      showPreviousTransaction: true,
      showOwner: true,
      showType: true,
      showContent: true,
    },
  });
  return res;
};


trblock(
  "BKyFR3ufaUSDnm8jABGiog1bNZbcEmbc1RwhUznY6Jgh",
  "0xc2878feb9b8a0c573dbcc4334989b49684e03475adc6b9bedefeaba914a9ba47"
).then((owner) => {
  console.log(owner);
});

// getObjectOwner("0xc2878feb9b8a0c573dbcc4334989b49684e03475adc6b9bedefeaba914a9ba47");
