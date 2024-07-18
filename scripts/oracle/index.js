// scripts/oracleListener.js
// const { ethers } = require("ethers");
const readline = require("readline");

async function oracle() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const oraclePrivateKey = "YOUR_ORACLE_PRIVATE_KEY";
    const oracleWallet = new ethers.Wallet(oraclePrivateKey, provider);

    const landTitleABI = require('../artifacts/contracts/LandTitle.sol/LandTitle.json').abi;
    const landTitleAddress = "LAND_TITLE_CONTRACT_ADDRESS"; // replace with actual address

    const landTitleContract = new ethers.Contract(landTitleAddress, landTitleABI, oracleWallet);

    landTitleContract.on("getUserVerified", async (userId) => {
        console.log(`getUserVerified event received for userId: ${userId}`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Approve user registration (yes/no)? ", async (answer) => {
            if (answer.toLowerCase() === "yes") {
                console.log(`User with userId ${userId} approved.`);
            } else {
                console.log(`User with userId ${userId} rejected.`);
            }
            rl.close();
        });
    });

    console.log("Oracle is listening for events...");
}

oracle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
