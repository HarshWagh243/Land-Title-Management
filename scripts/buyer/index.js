// scripts/buyerScript.js
// const { ethers } = require("hardhat");

async function buyer() {
    const [_, buyer] = await ethers.getSigners();

    const userFunctionalityABI = require('../artifacts/contracts/userFunctionality.sol/userFunctionality.json').abi;
    const userFunctionalityAddress = "USER_FUNCTIONALITY_CONTRACT_ADDRESS"; // replace with actual address

    const userFunctionalityContract = new ethers.Contract(userFunctionalityAddress, userFunctionalityABI, buyer);

    const txRegister = await userFunctionalityContract.userRegistration(true);
    await txRegister.wait();
    console.log("Buyer registered!");

    const txBuy = await userFunctionalityContract.buyThisTitle(1); // Replace with the actual titleId
    await txBuy.wait();
    console.log("Land with titleId 1 bought!");
}

buyer()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
