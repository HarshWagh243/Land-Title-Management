// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandTitle {
    address public oracle;      // Oracle address
    uint256 public timeout;     // Timeout in AEST as UNIX timestamp

    struct Title{
        uint256 id; // unique identifier
        string details; // location details
        uint256 ownerId; // userId from user contract
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Title) public titles; // map title_id to Title
    // mapping(uint256 => address) public owners; // map title_id to owner
    uint256 public nextId;

    // Events informing contract activities
    event checkOwnership(address owner, uint256 titleId); // approved by oracle
    event TitleCreated(uint256 titleId, string details, uint256 ownerId); // response given to owner
    event TitleForSale(uint256 titleId, uint256 price);
    event VerifyTransaction(uint256 buyerId, uint256 sellerId);
    event TitleSold(uint256 id, uint256 sellerId); // response given to seller

    /**
     * @dev Constructor.
     *
     * @param _oracle Oracle address 
     * @param _timeout Timeout in AEST as UNIX timestamp 
     */
    constructor(address _oracle, uint256 _timeout) {
        oracle = _oracle;
        timeout = _timeout;
    }

    /**
     * @dev Request to create title as a owner. Once the request is made
     * oracle is informed to perform verification and send status via event
     */
    function createTitle(string memory _details, uint userId) public {
        titles[nextId] = Title(nextId, _details, userId, 0, false); // price set to zero as not yet put for sale
        emit TitleCreated(nextId, _details, userId);
        nextId++;
    }

    function getTitle(uint256 _id) public view returns (Title memory) {
        return titles[_id];
    }

    function putTitleForSale(uint256 _titleId, uint256 _userId, uint256 _price) public {
        require(titles[_titleId].ownerId == _userId, "Only the owner can put the title for sale");
        titles[_titleId].price = _price;
        titles[_titleId].forSale = true;
        emit TitleForSale(_titleId, _price);
    }

    function buyTitle(uint256 _titleId, uint256 buyerId) public {
        require(titles[_titleId].forSale, "This title is not for sale");

        emit VerifyTransaction(buyerId, titles[_titleId].ownerId);
        // require(oracle.verifyPayment(msg.sender, titles[_id].price), "Payment not verified");

        uint256 sellerId = titles[_titleId].ownerId;
        titles[_titleId].ownerId = buyerId;
        titles[_titleId].forSale = false;
        titles[_titleId].price = 0;

        emit TitleSold(_titleId, sellerId);
    }
}