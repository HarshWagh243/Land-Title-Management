// scripts/oracleListener.js
// const { ethers } = require("ethers");
const { ethers } = require("hardhat");
const readline = require("readline");
const fs = require("fs");

async function main() {
    // const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const [,oracle] = await ethers.getSigners();

    const userData = fs.readFileSync('artifacts/contracts/user.sol/userFunctionality.json', 'utf8');
    const userJson = JSON.parse(userData);
    const userABI = userJson.abi;
    const userAddress = process.env.address1
    const userContract = new ethers.Contract(userAddress, userABI, oracle);
    console.log("Oracle is listening for events...");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
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
                // console.log(`${details} land registration rejected.`);
            }
        });
    });
}

main()
    // .then(() => process.exit(0))
    // .catch((error) => {
    //     console.error(error);
    //     process.exit(1);
    // });
