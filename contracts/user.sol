// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./landTitle.sol";  

// // To -do 
// // oracle to database connectivity(at the very end if possible)
// get function for user details
// should deployer be different than oracle

contract userFunctionality{
    address public titleAddress;
    LandTitle public titleContract;
    uint256 private idCounter;
    uint256 private certIdCounter;
    bool public isBeingUsed;

    mapping(address => userDetails) users;
    mapping(uint256 => mapping(uint => bool)) owners;

    // events
    event getUserVerified(address userAddress);
    event userVerified(address userAddress, bool verified);

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
     * @dev users initiates the registration.
     */
    function userRegistration() public{
        emit getUserVerified(msg.sender);
    }

    /**
     * @dev oracle verifies user
     * @param userAddress address of the user
     * @param verified true if oracle verifies
     */
    function verifyUser(address userAddress, bool verified) public{
        require(titleContract.inUse(), "Contract is disabled!");
        require(msg.sender == titleContract.oracle(), "Only oracle can add the user!");
        if (verified){
            users[userAddress].userId = idCounter;
            users[userAddress].certificateId = certIdCounter;
            idCounter++;
            certIdCounter++;
        }
        emit userVerified(userAddress, verified);
    }

    /**
     * @dev add owned land.
     *
     * @param _details LandTitle details (struct from landtitle) 
     */ 
    function addLandDetails(string memory _details) public{
        require(titleContract.inUse(), "Contract is disable!");
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
