// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./landTitle.sol";  

// // To -do 
// // oracle to database connectivity(at the very end if possible)

//     // function that returns all the land that the user owns
//                         // OR
//     // should we have a list for each user to store the land that they own (probably because a user can be either buyer 
//     // or seller, in the later stages a buyer(intially had no land) may want to sell the land they own)a
contract userFunctionality{
    address public titleAddress;
    LandTitle public titleContract;
    uint256 private idCounter;
    uint256 private certIdCounter;
    bool public isBeingUsed;

    mapping(address => userDetails) users;
    mapping(uint256 => mapping(uint => bool)) owners;

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
        isBeingUsed = true;
    }

    /**
     * @dev add users to the network.
     */
    function userRegistration(bool isValid) public{
        emit getUserVerified(users[msg.sender].userId);
        if (isValid){
            users[msg.sender] = userDetails(idCounter, certIdCounter);
        }
    }

    /**
     * @dev add owned land.
     *
     * @param _details LandTitle details (struct from landtitle) 
     */ 
    function addLandDetails(string memory _details) public{
        require(users[msg.sender].userId >= 1, 'User not registered!');
        titleContract.createTitle(_details, users[msg.sender].userId);
    }

    /**
     * @dev put a title on sale.
     *
     * @param _titleId LandTitle details (struct from landtitle) 
     */ 
    function putForSale(uint256 _titleId, uint256 _price) public{
        // oracle will verify the details and then 
        require(users[msg.sender].userId >= 1, 'User not registered!');
        titleContract.putTitleForSale(_titleId, users[msg.sender].userId, _price);
    }

    /**
     * @dev buy a land.
     *
     * @param _titleId LandTitle details (struct from landtitle) 
     */ 
    function buyThisTitle(uint256 _titleId) public{
        // oracle will verify the details and then 
        require(users[msg.sender].userId >= 1, 'User not registered!');
        titleContract.buyTitle(_titleId, users[msg.sender].userId);
    } 
}
