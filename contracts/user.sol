// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./landTitle.sol";
// Steps
// register user ask oracle for permission
// if the user wants to add their land to owns
    // ask oracle for verification and add land to their owns map (this could be integrated with the landtitle)
    // use addtitle from landtitle
// if the user wants to buys a land
    // initiate transaction using buytitle in landtitle
    // verification of transaction
    // change of ownership
// if user wants to sell a land
    // call putforsale in landtitle   

// To -do 
// oracle to database connectivity(at the very end if possible)
// 
// figure out more user attributes (other than ID)
// 
// This will import landTitle contract
// includes:
// user registration (handled by an oracle(typescript) refer lab 3(dummy oracle))
    // function that returns all the land that the user owns
                        // OR
    // should we have a list for each user to store the land that they own (probably because a user can be either buyer 
    // or seller, in the later stages a buyer(intially had no land) may want to sell the land they own)a
contract userFunctionality is landTitle{
    LandTitle public titleContract;
    LandTitle public titleContAddress;


    mapping(address => userDetails) users;

    struct userDetails{
        address userId;
        uint256 certificateId; //stores id of certificate issued by CA
        mapping(uint256 => bool) owns; //map title id
    }

    /**
     * @dev Constructor.
     *
     * @param _landTitleAddress LandTitle contract address 
     */
    constructor(address _landTitleAddress){
        titleContract = LandTitle();
        titleContAddress = LandTitle(_landTitleAddress);
    }

    /**
     * @dev add users to the network.
     */
    function addUsers() public{
        // get userId and certificateId from oracle
        // users[msg.sender] = 
    }

    /**
     * @dev add users owned land.
     *
     * @param _title LandTitle details (struct from landtitle) 
     */
    function addLandDetails(string memory details) public{
        // oracle will verify the details and then 
        titleContAddress.createTitle(details);
    }
}
