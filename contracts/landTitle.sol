// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// privacy as in only the lands that are for sale will be visible to the buyer and not allb

contract LandTitle {
    address public oracle;      // Oracle address
    uint256 public timeout;     // Timeout in AEST as UNIX timestamp
    bool public inUse; // used to kill a contract

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
    event checkOwnership(uint256 owner, string details); // approved by oracle
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
        inUse = true;
    }

    /**
     * @dev Request to create title as a owner. Once the request is made
     * oracle is informed to perform verification and send status via event
     */
    function createTitle(string memory _details, uint userId) public {
        titles[nextId] = Title(nextId, _details, userId, 0, false); // price set to zero as not yet put for sale
        emit checkOwnership(userId, _details);
        emit TitleCreated(nextId, _details, userId);
        nextId++;
    }

    /**
     * @dev Request title details as a buyer.
     */
    function getTitle(uint256 _id) public view returns (Title memory) {
        return titles[_id];
    }

    /**
     * @dev Put title on sale as a owner.
     * @param _titleId id of the title
     * @param _userId id of the user, to check if they're the owner
     * @param _price at which they want to sell
     */
    function putTitleForSale(uint256 _titleId, uint256 _userId, uint256 _price) public {
        require(titles[_titleId].ownerId == _userId, "Only the owner can put the title for sale");
        titles[_titleId].price = _price;
        titles[_titleId].forSale = true;
        emit TitleForSale(_titleId, _price);
    }

    /**
     * @dev Put title on sale as a owner.
     * @param _titleId id of the title
     * @param buyerId id of the buyer
     */
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