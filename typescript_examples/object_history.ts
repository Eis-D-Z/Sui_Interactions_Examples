import {
  JsonRpcProvider,
  mainnetConnection,
  testnetConnection,
} from "@mysten/sui.js";

const provider = new JsonRpcProvider(mainnetConnection);

const getPastOwner = async (block: string, objectId: string) => {
  const result: any = await provider.getTransactionBlock({
    digest: block,
    options: {
      showEffects: true,
    },
  });

  let objItem;

  // new object
  [objItem] = result.effects?.created?.filter((item: any) => {
    return item?.reference?.objectId === objectId;
  });

  if (!objItem) {
    // existing object
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
  const [dynamicFieldItem] = result.effects?.created?.filter((item: any) => {
    return item?.reference?.objectId === parent;
  });
  if (dynamicFieldItem) {
    const kioskId = dynamicFieldItem?.owner?.ObjectOwner;
    return getObjectOwner(kioskId);
  }

  // the owner is just a shared object (that is not a kiosk)
  return objItem.owner.ObjectOwner;
};

const getObjectOwner = async (objectId: string, res: any = undefined) => {
  if (!res) res = await getObj(objectId);
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

const getTableOwner = async (objectId: string, tableId: string) => {
  const res: any = await provider.getObject({
    id: objectId,
    options: {
      showContent: true,
      showType: true,
      showOwner: true
    }
  });
  
  const hasTable = JSON.stringify(res).includes(tableId);
  if (!hasTable) return;
  getObjectOwner(objectId, res);
}

// getPastOwner(
//   "4heqtbXjNGhpSMCWZ74mCbSZqfktooXHrcgj65UYsgX1",
//   "0x06402601a11a33e839695e9e889bb73db5abd5de291d34d1ae1934c9d689af45"
// ).then((owner) => {
//   console.log(owner);
// });

// getObjectOwner("0xc2878feb9b8a0c573dbcc4334989b49684e03475adc6b9bedefeaba914a9ba47");

// do it in one call
const getPastOwner_v2 = async (block: string, objectId: string) => {
  const result: any = await provider.getTransactionBlock({
    digest: block,
    options: {
      showEffects: true,
      showInput: true,
    },
  });

  // console.log(JSON.stringify(result));
  // new object
  let [objItem] = result.effects?.created?.filter((item: any) => {
    return item?.reference?.objectId === objectId;
  });

  if (!objItem) {
    // existing object
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
    wasDeleted
      ? (msg = "Object was deleted during this transaction")
      : (msg = "Cannot find owner");
    return msg;
  }

  // the owner can be address
  if (objItem?.owner?.AddressOwner) {
    return objItem.owner.AddressOwner;
  }

  // the owner can be a dynamic field, which means that either it is inside a table or a bag
  // or directly under an object provided as input or created in the same transaction
  const parent = objItem?.owner?.ObjectOwner;
  const [dynamicFieldItem] = result.effects?.created?.filter((item: any) => {
    return item?.reference?.objectId === parent;
  });
  if (dynamicFieldItem) {
    const dynFieldOwner = dynamicFieldItem?.owner?.ObjectOwner;
    
    // may be an object in the inputs
    const [inputObj] = result?.transaction?.data?.transaction?.inputs.filter((item: any) => {
      return item.objectId === dynFieldOwner;
    });

    // case where it is an owned object that holds the nft
    if (inputObj) {
      
      if (inputObj.objectType === "immOrOwnedObject") {
        return result?.transaction?.data?.sender;
      }
    }

    let isTable = true;
   
    // may be an object that was just created
    isTable = !(result?.effects?.created?.some((item: any) => {
      return item?.reference?.objectId === dynFieldOwner
    }));

    if(!isTable) {
      return getObjectOwner(dynFieldOwner);
    }

    // if it is a table then we need to check the inputs one by one
    for(let item of result?.transaction?.data?.transaction?.inputs) {
      const response = getTableOwner(item.objectId, dynFieldOwner);
      if (response) return response;
    }  
  }
  return "Owner Not Found";
};

getPastOwner_v2(
  "4heqtbXjNGhpSMCWZ74mCbSZqfktooXHrcgj65UYsgX1",
  "0x00bbb9cb641c6a29fbe29de42af578d2272bda65e293c50cbd1002d81d6b444c"
).then(resp => {console.log(resp)});
