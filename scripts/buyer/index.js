// scripts/buyerScript.js
const { ethers } = require("hardhat");
const readline = require("readline");
const fs = require("fs");

const titlesOnSale = new Set();
async function main() {
    const [_,, buyer] = await ethers.getSigners();

    const userData = fs.readFileSync('artifacts/contracts/user.sol/userFunctionality.json', 'utf8');
    const userJson = JSON.parse(userData);
    const userABI = userJson.abi;
    const userAddress = process.env.address1
    const userContract = new ethers.Contract(userAddress, userABI, buyer);

    
    userContract.on("userVerified", async (address, verified) => {
        if(address == buyer.address){
            if (verified){
                console.log('User verification succesful');
                const myUserId = await userContract.getUserId(buyer.address);
                console.log("User ID: ", parseInt(myUserId));
                const txn = await userContract.getLandDetails(10000);
                await txn.wait();
            }
            else{
                console.log("User verification failed!");
            }
            
        }
    });
    userContract.on("LandVerified", async (userId, titleId, details, verified) => {
        titlesOnSale.add(parseInt(titleId));
        const myUserId = userContract.getUserId(buyer.address);
        if(myUserId == userId){
            if (verified){
                console.log(`Land verification ${details} succesful`);
                console.log(`titleId: ${titleId}`);
            }
            else{
                console.log(`Land verification ${details} unsuccesful`);
            }
        }
    });
    userContract.on("LandDetails", async (caller, titleId,  ownerId,  price, details) => {
        if(caller == buyer.address){
            if (price == '0'){
                console.log(`Land ${titleId} is not on sale`);
            }
            else{
                console.log(`TitleId:${titleId},\n
OwnerId: ${ownerId}, 
Price: ${price},
Details: ${details}`)
            }
            // const buyerId = await userContract.getUserId(buyer.address);
            const txn =  await userContract.buyThisTitle(titleId);
            await txn.wait();
        }
    });
    userContract.on("TitleOnSale", async (titleId, userAddress) => {
        if(userAddress == buyer.address){
            console.log(`Title with titleId ${titleId} is on Sale!`);
        }

    });
    userContract.on("TitleSold", async (titleId, sellerId, sold) => {
        const myUserId = await userContract.getUserId(buyer.address);
        if(myUserId == sellerId){
            if (sold){
                console.log(`Title ${titleId} sold!`);
            }
            else{
                console.log(`Title ${titleId} not sold!`);
            }
        }
    });
    userContract.on("TitleNotOnSale", async (buyerId) => {
        const myUserId = await userContract.getUserId(buyer.address);
        if(myUserId == buyerId){
            if (verified){
                console.log('Title Not on Sale');
            }
        }
    });
    userContract.on("TitlePurchased", async (id, buyerId, purchased) => {
        const myUserId = await userContract.getUserId(buyer.address);
        if(myUserId == buyerId){
            if (purchased){
                console.log(`Title ${id} purchased!`);
            }
            else{
                console.log(`Title ${id} not purchased!`);
            }
        }
    });
    userContract.on("PurchaseVerified", async (titleId, sellerId, sold) => {
        const myUserId = await userContract.getUserId(buyer.address);
        if(myUserId == sellerId){
            if (purchased){
                console.log(`Title ${titleId} sold!`);
            }
            else{
                console.log(`Title ${titleId} not sold!`);
            }
        }
    });
    const txn = await userContract.userRegistration();
    await txn.wait();
}

main()
    // .then(() => process.exit(0))
    // .catch((error) => {
    //     console.error(error);
    //     process.exit(1);
    // });
