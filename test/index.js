// import {
//     time,
//     loadFixture,
//   } from "@nomicfoundation/hardhat-toolbox/network-helpers";
//   import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
//   import { expect } from "chai";
//   import hre from "hardhat";

const {expect} = require('chai');
const { ethers } = require('hardhat');

describe('landTitle', () => {
    let landtitle, landContract, user, userContract, landTitleAddress; 
    beforeEach(async ()  => {
        [oracle, buyer, seller, dummy, _] = await ethers.getSigners();
        landtitle = await ethers.getContractFactory('LandTitle');
        landContract = await landtitle.deploy(oracle.address, 100);
        await landContract.waitForDeployment();
        landTitleAddress = await landContract.getAddress();
        // console.log(landTitleAddress);
        user = await ethers.getContractFactory('userFunctionality');
        userContract = await user.deploy(landTitleAddress);
        await userContract.waitForDeployment();
    });
    describe('Deployment', () => {
        it('Should pass address of landtitle contract as an argument to user contract!', async ()=> {
            const addressAtUser = await userContract.titleAddress();
            expect(addressAtUser).to.equal(landTitleAddress);
        });
        it('user and landtitle contract should be in use!', async () => {
            expect(userContract.isBeingUsed() == true);
            expect(landContract.inUse() == true);
        })
    }); 
});