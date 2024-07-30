// scripts/sellerScript.js




// address1=0x0B306BF915C4d645ff596e518fAf3F9669b97016 yarn hardhat --network localhost run 
const { ethers } = require("hardhat");
const readline = require("readline");
const fs = require("fs");
const { log } = require("console");


const titlesOnSale = new Set();
let userRegistered = false;
async function main() {
    const [_, __, ___, seller] = await ethers.getSigners();
    
    const userData = fs.readFileSync('artifacts/contracts/user.sol/userFunctionality.json', 'utf8');
    const userJson = JSON.parse(userData);
    const userABI = userJson.abi;
    const userAddress = process.env.address1
    const userContract = new ethers.Contract(userAddress, userABI, seller);

    const txRegister = await userContract.userRegistration();
    await txRegister.wait();


    userContract.on("userVerified", async (address, verified) => {
        if(address == seller.address){
            if (verified){
                console.log('User verification successful!');
                userRegistered = true;
                const myUserId = await userContract.getUserId(seller.address);
                console.log("User ID: ", parseInt(myUserId));
                const addTitle = await userContract.sendLandDetails("pembroke st.");
                await addTitle.wait();
            }
            else{
                console.log("User verification failed!");
            }
        }
    });
    userContract.on("TitleOnSale", async (titleId, userAddress) => {
            console.log(`Title with titleId ${titleId} is on Sale!`);
    });
    userContract.on("LandVerified", async (userId, titleId, details, verified) => {
        const myUserId = await userContract.getUserId(seller.address);
        titlesOnSale.add(parseInt(titleId));
        if(myUserId == userId){
            if (verified){
                console.log(`Land verification ${details} succesful`);
                console.log(`titleId: ${titleId}`);
            }
            else{
                console.log(`Land verification ${details} unsuccesful`);
            }
            const txn = await userContract.putForSale(titleId, 100);
            await txn.wait();
        }
    });
    userContract.on("LandDetails", async (caller, titleId,  ownerId,  price, details) => {
        if(caller == seller.address){
            if (price == '0'){
                console.log(`Land ${titleId} is not on sale`);
            }
            else{
                console.log(`TitleId:${titleId},
OwnerId: ${ownerId},
Price: ${price},
Details: ${details}`)
            }
        }
        

    });
    userContract.on("TitleSold", async (titleId, sellerId, sold) => {
        const myUserId = await userContract.getUserId(seller.address);
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
        const myUserId = await userContract.getUserId(seller.address);
        if(myUserId == buyerId){
            if (verified){
                console.log('Title Not on Sale');
            }
        }

    });
    userContract.on("TitlePurchased", async (id, buyerId, purchased) => {
        const myUserId = await userContract.getUserId(seller.address);
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





