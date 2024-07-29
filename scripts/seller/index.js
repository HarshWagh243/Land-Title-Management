// scripts/sellerScript.js
const { ethers } = require("hardhat");
const readline = require("readline");
const fs = require("fs");
const { log } = require("console");

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
        if(address == buyer.address){
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            if (verified){
                rl.write('User verification succesful');
            }
            else{
                    rl.write("User verification failed!");
            }
        }
    });
    userContract.on("LandVerified", async (userId, titleId, details, verified) => {
        const myUserId = userContract.getUserId(buyer.address);
        if(myUserId == userId){
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            if (verified){
                rl.write(`Land verification ${details} succesful`);
                rl.write(`titleId: ${titleId}`);
            }
            else{
                rl.write(`Land verification ${details} unsuccesful`);
            }
        }
    });
    userContract.on("LandDetails", async (caller, titleId,  ownerId,  price, details) => {
        if(caller == buyer.address){
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            if (price == '0'){
                rl.write(`Land ${titleId} is not on sale`);
            }
            else{
                rl.write(`TitleId:${titleId},\n
                    OwnerId: ${ownerId},\n  
                    Price: ${price},\n 
                    Details: ${details}\n`)
            }

        }
    });
    userContract.on("TitleSold", async (titleId, sellerId, sold) => {
        const myUserId = userContract.getUserId(buyer.address);
        if(myUserId == sellerId){
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            if (sold){
                rl.write(`Title ${titleId} sold!`);
            }
            else{
                    rl.write("Title ${titleId} not sold!");
            }
        }
    });
    userContract.on("TitleNotOnSale", async (buyerId) => {
        const myUserId = userContract.getUserId(buyer.address);
        if(myUserId == buyerId){
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            if (verified){
                rl.write('Title Not on Sale');
            }
        }
    });
    userContract.on("TitlePurchased", async (id, buyerId, purchased) => {
        const myUserId = userContract.getUserId(buyer.address);
        if(myUserId == buyerId){
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            if (purchased){
                rl.write(`Title ${id} purchased!`);
            }
            else{
                    rl.write(`Title ${id} not purchased!`);
            }
        }
    });
    userContract.on("PurchaseVerified", async (titleId, sellerId, sold) => {
        const myUserId = userContract.getUserId(buyer.address);
        if(myUserId == sellerId){
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            if (purchased){
                rl.write(`Title ${titleId} sold!`);
            }
            else{
                    rl.write(`Title ${titleId} not sold!`);
            }
        }
    });
    {
        // User Interface
        console.log("****Land Title Management\n");
        console.log("Select one option from below");
        console.log("1) Buy a Land\n2) Sell a Land\n3)View Details of a land\n4) Available lands to buy");
    }
    
}

main()
    // .then(() => process.exit(0))
    // .catch((error) => {
    //     console.error(error);
    //     process.exit(1);
    // });





