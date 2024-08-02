const { ethers } = require("hardhat");
const readline = require("readline");
const fs = require("fs");
const { log } = require("console");


const titlesOnSale = new Set();
let userRegistered = false;
async function main() {
    // get seller details
    const [_, __, ___, seller] = await ethers.getSigners();
    
    // collect userFunctionality contract abi
    const userData = fs.readFileSync('artifacts/contracts/user.sol/userFunctionality.json', 'utf8');
    const userJson = JSON.parse(userData);
    const userABI = userJson.abi;
    // get address of userFunctionality contract from terminal
    const userAddress = process.env.address1

    // connect to userFunctionality contract deployed
    const userContract = new ethers.Contract(userAddress, userABI, seller);

    // initiate user verification for seller
    const txRegister = await userContract.userRegistration();
    await txRegister.wait();

    // listen to userVerified event to know if seller is verified
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
    // listen to TitleOnSale event to check if sellers land has been put for sale
    userContract.on("TitleOnSale", async (titleId, userAddress) => {
            console.log(`Title with titleId ${titleId} is on Sale!`);
    });
    // listen to LandVerified to know if land details got verified
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
    // listen to LandDetails to get land details when on sale
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
    // listen to TitleSold event to know when users title is sold
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
    // listen to TitleNotOnSale to know if a title is on Sale when trying to buy
    userContract.on("TitleNotOnSale", async (buyerId) => {
        const myUserId = await userContract.getUserId(seller.address);
        if(myUserId == buyerId){
            if (verified){
                console.log('Title Not on Sale');
            }
        }

    });
    // listen to TitlePurchased for the buyer to know when the transaction has been completed 
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
}

main()




