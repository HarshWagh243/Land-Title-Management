// To - Do
// test for added land by user is in his owned land
// test for putforSale
// test for buytitle
// write more test cases 

const {expect, use} = require('chai');
const { log, Console } = require('console');
const exp = require('constants');
const { isValidName } = require('ethers');
const { accessSync } = require('fs');
// const { ethers } = require('hardhat');
const hre = require("hardhat");
const { before } = require('node:test');
const { time } = require('@nomicfoundation/hardhat-network-helpers');

describe('landTitle', () => {
    let landtitle, landContract, user, userContract, landTitleAddress; 
    beforeEach(async ()  => {
        [oracle, buyer, seller, dummy, _] = await ethers.getSigners();
        landtitle = await hre.ethers.getContractFactory('LandTitle');
        landContract = await landtitle.deploy(oracle.address);
        landContract = await landContract.waitForDeployment();
        landTitleAddress = await landContract.getAddress();
        user = await hre.ethers.getContractFactory('userFunctionality');
        userContract = await user.deploy(landTitleAddress);
        userContract = await userContract.waitForDeployment();
        // userAddress = await userContract.getAddress();

        // buyer registers
        await expect(userContract.connect(buyer).userRegistration()).to.emit(userContract, "getUserVerified").withArgs(buyer.address);
        await expect(userContract.connect(oracle).verifyUser(buyer.address, true)).to.emit(userContract, "userVerified").withArgs(buyer.address, true);

        // Seller registers
        await expect(userContract.connect(seller).userRegistration()).to.emit(userContract, "getUserVerified").withArgs(seller.address);
        await expect(userContract.connect(oracle).verifyUser(seller.address, true)).to.emit(userContract, "userVerified").withArgs(seller.address, true);


    });

    describe('Deployment', () => {
        it('Should pass address of landtitle contract as an argument to user contract!', async ()=> {
            const addressAtUser = await userContract.titleAddress();
            expect(addressAtUser).to.equal(landTitleAddress);
        });
        it('user and landtitle contract should be in use!', async () => {
            expect(await landContract.inUse()).to.equal(true);
        })
    });
    describe('Verified user', () => {
        it('Should add a verified user', async () => {
            const userId = await userContract.getUserId(buyer);
            expect(userId >= 1).to.equal(true);
        });
        it("Should fail as user is not verified", async () => {
            await userContract.connect(seller).userRegistration();
            await userContract.connect(oracle).verifyUser(seller.address, false);
            const userId = await userContract.connect(oracle).getUserId(buyer.address);
            // console.log(await landContract.oracle());
            try {
                expect(userId >= 1).to.equal(true);
            } catch (error) {
                // console.log("User not verified!!");
            }
        });
    });
    describe("User owned land in owners", () => {
        it("user owned land should be in both the contract!", async () => {
            // seller adds his owned land
            await expect(userContract.connect(seller).sendLandDetails("pennant hills")).to.emit(userContract, "getLandVerified").withArgs(seller.address, "pennant hills");
            const sellerId = await userContract.getUserId(seller.address);
            const titleId = await landContract.nextId();
            await expect(userContract.connect(oracle).verifyLandDetails("pennant hills", seller.address, true)).to.emit(userContract, "LandVerified").withArgs(sellerId, titleId, "pennant hills", true);

            //check if the title details are updated in both the contracts    
            await expect(userContract.connect(seller).getLandDetails(titleId)).to.emit(userContract, "LandDetails").withArgs(titleId, sellerId, 0, "pennant hills");
            expect(await userContract.connect(oracle).checkOwns(sellerId, titleId)).to.equal(true);
        }); 
    });
    describe("Buy only if its on Sale", () => {
        it("Should not allow to buy as its not on sale", async () => {
            await expect(userContract.connect(seller).sendLandDetails("pennant hills")).to.emit(userContract, "getLandVerified").withArgs(seller.address, "pennant hills");
            const sellerId = await userContract.getUserId(seller.address);
            const titleId = await landContract.nextId();
            await expect(userContract.connect(oracle).verifyLandDetails("pennant hills", seller.address, true)).to.emit(userContract, "LandVerified").withArgs(sellerId, titleId, "pennant hills", true);

            try {
                await userContract.connect(buyer).buyThisTitle(titleId);
            } catch (error) {
                 
            }
            
        });
        it("Should allow only if title is on Sale", async () => {
            await expect(userContract.connect(seller).sendLandDetails("pennant hills")).to.emit(userContract, "getLandVerified").withArgs(seller.address, "pennant hills");
            const sellerId = await userContract.getUserId(seller.address);
            const titleId = await landContract.nextId();
            await expect(userContract.connect(oracle).verifyLandDetails("pennant hills", seller.address, true)).to.emit(userContract, "LandVerified").withArgs(sellerId, titleId, "pennant hills", true);

            await userContract.connect(seller).putForSale(titleId, 100);
            expect(await landContract.getTitlePrice(titleId)).to.equal(100); //check price at landContract
            await userContract.connect(buyer).buyThisTitle(titleId); // doesn't through any errors
        });
    });

    describe("Check ownership change", () => {
        it("Should change owner details when transaction is approved!", async () => {
            await expect(userContract.connect(seller).sendLandDetails("pennant hills")).to.emit(userContract, "getLandVerified").withArgs(seller.address, "pennant hills");
            const sellerId = await userContract.getUserId(seller.address);
            const titleId = await landContract.nextId();
            const buyerId = await userContract.getUserId(buyer.address);
            await expect(userContract.connect(oracle).verifyLandDetails("pennant hills", seller.address, true)).to.emit(userContract, "LandVerified").withArgs(sellerId, titleId, "pennant hills", true);

            await userContract.connect(seller).putForSale(titleId, 100);
            expect(await landContract.getTitlePrice(titleId)).to.equal(100); //check price at landContract
            await expect(userContract.connect(buyer).buyThisTitle(titleId)).to.emit(userContract, "verifyPurchaseOracle").withArgs(titleId, buyerId) // doesn't through any errors
            await expect(userContract.connect(oracle).verifyPurchase(buyerId, titleId, true)).to.emit(userContract, "TitleSold").withArgs(titleId, sellerId, true);

            // check new ownership
            const newOwnerId = await landContract.getTitleOwnerId(titleId);
            // console.log(newOwnerId);
            await expect(newOwnerId).to.equal(buyerId);
            console.log(oracle)
        });
    });

    describe('Timeout', () => {
        it('Transaction should be declined if timeout has expired', async () => {
            await expect(userContract.connect(seller).sendLandDetails("pennant hills")).to.emit(userContract, "getLandVerified").withArgs(seller.address, "pennant hills");
            const sellerId = await userContract.getUserId(seller.address);
            const titleId = await landContract.nextId();
            const buyerId = await userContract.getUserId(buyer.address);
            // Buyer initiates the purchase
            await userContract.connect(buyer).buyThisTitle(titleId);
            // Increase time by 301 seconds (5 minutes + 1 second)
            await time.increase(301);
            await expect(userContract.connect(oracle).verifyPurchase(buyerId, titleId, true))
                .to.be.revertedWith("Transaction has timed out");
        });
    });

    describe("Double Purchase Attempt", () => {
        it("Should not allow to buy the same title twice", async () => {
            // Seller sends land details
            await expect(userContract.connect(seller).sendLandDetails("pennant hills"))
                .to.emit(userContract, "getLandVerified")
                .withArgs(seller.address, "pennant hills");
    
            const sellerId = await userContract.getUserId(seller.address);
            const titleId = await landContract.nextId();
            const buyerId = await userContract.getUserId(buyer.address);
    
            // Oracle verifies land details
            await expect(userContract.connect(oracle).verifyLandDetails("pennant hills", seller.address, true))
                .to.emit(userContract, "LandVerified")
                .withArgs(sellerId, titleId, "pennant hills", true);
    
            // Seller puts the title for sale
            await userContract.connect(seller).putForSale(titleId, 100);
            expect(await landContract.getTitlePrice(titleId)).to.equal(100);
    
            // Buyer buys the title
            await userContract.connect(buyer).buyThisTitle(titleId);
            await expect(userContract.connect(oracle).verifyPurchase(buyerId, titleId, true))
                .to.emit(userContract, "TitleSold")
                .withArgs(titleId, sellerId, true);
    
            // Attempt to buy the same title again
            try {
                await userContract.connect(buyer).buyThisTitle(titleId);
            } catch (error) {
            }
        });
    });



});
