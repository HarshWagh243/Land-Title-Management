// scripts/sellerScript.js
const { ethers } = require("hardhat");

async function main() {
    const [_, __, seller] = await ethers.getSigners();
    
    const userFunctionalityABI = require('./artifacts/contracts/user.sol/userFunctionality.json').abi;
    const userFunctionalityAddress = process.env.address1
    const userFunctionalityContract = new ethers.Contract(userFunctionalityAddress, userFunctionalityABI, seller);

    const txRegister = await userFunctionalityContract.userRegistration(true);
    await txRegister.wait();
    console.log("Seller registered!");

    const txCreate = await userFunctionalityContract.addLandDetails("Some land details");
    await txCreate.wait();
    console.log("Land created!");

    const txSell = await userFunctionalityContract.putForSale(1, 100); // Replace with the actual titleId and price
    await txSell.wait();
    console.log("Land with titleId 1 put for sale at price 100!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });





