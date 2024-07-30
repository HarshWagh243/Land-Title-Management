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
        titlesOnSale.add(parseInt(titleId));
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
    // {
    //     console.log("User registration initiated...!")
    //     const txRegister = await userContract.userRegistration();
    //     await txRegister.wait();
    //     // print lands on sale

    //     console.log("Land Titles on Sale...\n");
    //     for (key in titlesOnSale){
    //         console.log(key + "\t");
    //     }
    // }
}


async function userReg(){
    console.log("User registration initiated...!")
        const txRegister = await userContract.userRegistration();
        await txRegister.wait();   
}

async function initiateBuy(){
    console.log(`Transaction initiated for title ${titleId}...`);
    console.log("Waiting for oracle ");
}

main()
    // .then(() => process.exit(0))
    // .catch((error) => {
    //     console.error(error);
    //     process.exit(1);
    // });
