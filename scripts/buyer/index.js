const { ethers } = require("hardhat");
const readline = require("readline");
const fs = require("fs");
const { log } = require("console");

const titlesOnSale = new Set();
async function main() {
    // get buyer details
    const [_,, buyer] = await ethers.getSigners();

    // collect userFunctionality contract abi
    const userData = fs.readFileSync('artifacts/contracts/user.sol/userFunctionality.json', 'utf8');
    const userJson = JSON.parse(userData);
    const userABI = userJson.abi;
    // get address of userFunctionality contract from terminal
    const userAddress = process.env.address1
    // connect to userFunctionality contract deployed
    const userContract = new ethers.Contract(userAddress, userABI, buyer);

    // initiate user verification for seller
    const txn = await userContract.userRegistration();
    await txn.wait();

    // listen to userVerified event to know if seller is verified
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
    // listen to LandVerified to know if land details got verified
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
    // listen to LandDetails to get land details when on sale
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
            const txn =  await userContract.buyThisTitle(titleId);
            await txn.wait();
        }
    });
    // listen to TitleOnSale event to check if sellers land has been put for sale
    userContract.on("TitleOnSale", async (titleId, userAddress) => {
        if(userAddress == buyer.address){
            console.log(`Title with titleId ${titleId} is on Sale!`);
        }

    });
    // listen to TitleSold event to know when users title is sold
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
    // listen to TitleNotOnSale to know if a title is on Sale when trying to buy
    userContract.on("TitleNotOnSale", async (buyerId) => {
        const myUserId = await userContract.getUserId(buyer.address);
        if(myUserId == buyerId){
            if (verified){
                console.log('Title Not on Sale');
            }
        }
    });
    // listen to TitlePurchased for the buyer to know when the transaction has been completed 
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
}

main()
