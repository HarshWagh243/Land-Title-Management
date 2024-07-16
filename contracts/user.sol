// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./landTitle.sol";
// // Steps
// // register user ask oracle for permission
// // if the user wants to add their land to owns
//     // ask oracle for verification and add land to their owns map (this could be integrated with the landtitle)
//     // use addtitle from landtitle
// // if the user wants to buys a land
//     // initiate transaction using buytitle in landtitle
//     // verification of transaction
//     // change of ownership
// // if user wants to sell a land
//     // call putforsale in landtitle   

// // To -do 
// // oracle to database connectivity(at the very end if possible)
// // 
// // figure out more user attributes (other than ID)
// // 
// // This will import landTitle contract
// // includes:
// // user registration (handled by an oracle(typescript) refer lab 3(dummy oracle))
//     // function that returns all the land that the user owns
//                         // OR
//     // should we have a list for each user to store the land that they own (probably because a user can be either buyer 
//     // or seller, in the later stages a buyer(intially had no land) may want to sell the land they own)a
contract userFunctionality{
    address public titleAddress;
    LandTitle public titleContract;
    uint256 idCounter;
    uint256 certIdCounter;

    mapping(address => userDetails) users;
    mapping(uint => mapping(uint => bool)) owners;

    // events
    event getUserVerified(uint256 userId);

    struct userDetails{
        uint256 userId;
        uint256 certificateId; //stores id of certificate issued by CA
        // mapping(uint256 => bool) owns; //map title id to true // has to be removed as mappings can not be in a struct
    }

    /**
     * @dev Constructor.
     *
     * @param _landTitleAddress LandTitle contract address 
     */
    constructor(address _landTitleAddress){
        titleAddress = _landTitleAddress;
        titleContract = LandTitle(_landTitleAddress);
        idCounter = 1;
        certIdCounter = 1000;
    }

    /**
     * @dev add users to the network.
     */
    function addUsers(bool isValid) public{

        emit getUserVerified(users[msg.sender].userId);
        
        if (isValid){
            users[msg.sender] = userDetails(idCounter, certIdCounter);
        }
    }

    /**
     * @dev add users owned land.
     *
     * @param _title LandTitle details (struct from landtitle) 
     */ 
    function addLandDetails(string memory _title) public{
        // oracle will verify the details and then 
        titleContract.createTitle(_title, users[msg.sender].userId);
    }
}
