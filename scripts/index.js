// scripts/deployContracts.js
const { ethers } = require("hardhat");

async function main() {
    const [oracle] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", oracle.address);

    const LandTitle = await ethers.getContractFactory("LandTitle");
    const landContract = await LandTitle.deploy(oracle.address, 
        1721138512);
    await landContract.waitForDeployment();
    const landAddress = await landContract.getAddress();
    console.log("LandTitle contract deployed to:", landAddress);

    const UserFunctionality = await ethers.getContractFactory("userFunctionality");
    const userContract = await UserFunctionality.deploy(landContract.getAddress());
    await userContract.waitForDeployment();
    const userAddress = await userContract.getAddress();
    console.log("UserFunctionality contract deployed to:", userAddress);

    // // Save contract addresses for later use
    // console.log({
    //     landTitleAddress: landAddress,
    //     userFunctionalityAddress: userAddress,
    // });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


