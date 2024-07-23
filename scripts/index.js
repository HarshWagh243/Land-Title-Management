// scripts/deployContracts.js
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const LandTitle = await ethers.getContractFactory("LandTitle");
    const [_, oracle] = await ethers.getSigners();
    const landContract = await LandTitle.deploy(oracle.address);
    console.log("Oracle address: ", oracle.address);
    await landContract.waitForDeployment();
    const landAddress = await landContract.getAddress();
    console.log("LandTitle contract deployed to:", landAddress);

    const UserFunctionality = await ethers.getContractFactory("userFunctionality");
    const userContract = await UserFunctionality.deploy(landContract.getAddress());
    await userContract.waitForDeployment();
    const userAddress = await userContract.getAddress();
    console.log("UserFunctionality contract deployed to:", userAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


