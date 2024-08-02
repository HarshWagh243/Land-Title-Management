// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// privacy as in only the lands that are for sale will be visible to the buyer and not all

// contract1 land_title which has to be deployed before deploying user contract
contract LandTitle {
    address public oracle;      // Oracle address
    uint256 public timeout;     // Timeout in AEST as UNIX timestamp should be initiated when transaction is initiated
    bool public inUse; // used to kill a contract
    uint256 public nextId;


    // title struct, has all the details about a land title
    struct Title {
        uint256 id; // unique identifier
        string details; // location details
        uint256 ownerId; // userId from user contract
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Title) public titles; // map title_id to Title
    // mapping(uint256 => address) public owners; // map title_id to owner

    mapping(uint256 => mapping(uint256 => uint256)) public timeouts; // map titleId to a map of { buyerId : block time }
    
    /**
     * @dev Constructor.
     *
     * @param _oracle Oracle address 
     */
    constructor(address _oracle) {
        oracle = _oracle;
        // timeout = _timeout; 
        inUse = true;
        nextId = 10000;
    }
  
    /**
     * @dev oracle has verified the title
     */
    // function to add a new land title once the verification is done
    function addTitle(string memory _details, uint userId, bool verified) public returns(uint256) {
        require(inUse, "Contract is disable!");
        // verify that the user own the land
        if (verified){
            titles[nextId] = Title(nextId, _details, userId, 0, false); // price set to zero as not yet put for sale
            nextId++; 
        }
        // when verification that user owns the land fails
        else
            revert("Title not owned by the user!");
        return (nextId - 1);
    }

    /**
     * @dev Request title price as a buyer.
     */
    // getter function to check the price associated to a title id
    function getTitlePrice(uint256 _id) public view returns (uint256){
        return titles[_id].price;
    }
    /**
     * @dev Request title price as a buyer.
     */
    // getter function for the title details associated to a title id
    function getTitleDetails(uint256 _id) public view returns (string memory){
        return titles[_id].details;
    }
    /**
     * @dev Request title price as a buyer.
     */
    // getter function for the title owner id detail associated to a title id
    function getTitleOwnerId(uint256 _id) public view returns (uint256){
        return titles[_id].ownerId;
    }
    /**
     * @dev Request title onSale status.
     */
    // function to check that a land title is on sale
    function checkOnSale(uint256 _titleId) public view returns (bool){
        return titles[_titleId].forSale;
    }

    /**
     * @dev Put title on sale as a owner.
     * @param _titleId id of the title
     * @param _userId id of the user, to check if they're the owner
     * @param _price at which they want to sell
     */
    // function that the user(seller) uses to put his verified land title on sale
    function putTitleForSale(uint256 _titleId, uint256 _userId, uint256 _price) public {
        require(titles[_titleId].ownerId == _userId, "Only the owner can put the title for sale");
        titles[_titleId].price = _price;
        titles[_titleId].forSale = true;
    }
    /**
     * @dev Put title on sale as a owner.
     * @param _titleId id of the title
     * @param buyerId id of the buyer
     */
    // function used after the buy land title is initiated and the title is verified to be on sale
    function approvePurchase(uint256 _titleId, uint256 buyerId, bool txnVerified) public {
        require(inUse, "Contract is disabled!");
        require(!isTimedOut(_titleId, buyerId), "Transaction has timed out");
        
        if (txnVerified){
            titles[_titleId].ownerId = buyerId;
            titles[_titleId].forSale = false;
            titles[_titleId].price = 0;
        }
    }
    /**
     * 
     * @param _titleId ID of the title
     * @param buyerId  ID of the buyer
     * BOTH these parameters are part of the timeouts mapping
     */
    // function to check that the timeout condition, which if false means that the purchase can still be made
    function isTimedOut(uint256 _titleId, uint256 buyerId) public view returns (bool) {
        uint256 startTime = timeouts[_titleId][buyerId];
        return block.timestamp > startTime + 259200; // 86400 seconds in one day * 3 = 259200
    }

    /**
     * 
     * @param _titleId ID of the title
     * @param buyerId  ID of the buyer
     * BOTH these parameters are part of the timeouts mapping
     */
    // function to set a timeout contdition when the user(buyer) initialtes a request to buy a land title
    function setTimeout(uint256 _titleId, uint256 buyerId) public {
        timeouts[_titleId][buyerId] = block.timestamp; // adds the time at which this function was initiated
    }
}