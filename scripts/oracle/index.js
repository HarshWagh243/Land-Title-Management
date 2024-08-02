const { ethers } = require("hardhat");
const readline = require("readline");
const fs = require("fs");

async function main() {
    // get oracle details
    const [,oracle] = await ethers.getSigners();

    // collect contract abi
    const userData = fs.readFileSync('artifacts/contracts/user.sol/userFunctionality.json', 'utf8');
    const userJson = JSON.parse(userData);
    const userABI = userJson.abi;

    // get contract address from terminal
    const userAddress = process.env.address1

    // connect to User contract
    const userContract = new ethers.Contract(userAddress, userABI, oracle);
    console.log("Oracle is listening for events...");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    // listen to user verification event
    userContract.on("getUserVerified", async (address) => {
        console.log(`getUserVerified event received for userId: ${address}`);
        rl.question("Approve user registration (yes/no)? ", async (answer) => {
            if (answer.toLowerCase() === "yes") {
                const txn = await userContract.verifyUser(address, true);
                await txn.wait();
                console.log(`User with address ${address} approved.`);
            } else {
                console.log(`User with address ${address} rejected.`);
            }
        }); 
    });
    // listen to verifyPurchaseOracle to verify any transaction
    userContract.on("verifyPurchaseOracle", async (titleId, buyerId) => {
        console.log(`verifyPurchaseOracle event received for titleId: ${titleId}`);
        console.log(`buyerId: ${buyerId}`);

        rl.question("Transaction complete (yes/no)? ", async (answer) => {
            if (answer.toLowerCase() === "yes") {
                const txn = await userContract.verifyPurchase(buyerId, titleId, true);
                await txn.wait();
            } else {
                const txn = await userContract.verifyPurchase(buyerId, titleId, false);
                await txn.wait();
            }
        }); 
    });
    // listen to getLandVerified to verify any landtitle and it's owner
    userContract.on("getLandVerified", async (address, details) => {
        console.log(`getLandVerified event received for userAddress: ${address}`);

        rl.question("Approve land registration (yes/no)? ", async (answer) => {
            if (answer.toLowerCase() === "yes") {
                const txn = await userContract.verifyLandDetails(details, address, true);
                await txn.wait();
                console.log(`${details} land registration approved.`);
                console.log(`Owner: ${address}`);
            } else {
                const txn = await userContract.verifyLandDetails(details, address, false);
                await txn.wait();
            }
        });
    });
}

main()
