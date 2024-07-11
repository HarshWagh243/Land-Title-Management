// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// To - DO
// add a mapping to  map title id to owner id
// probably have an escrow contract to manage transaction
// figure out more functionalities and add them in to-do


// not sure if ownable should be used
contract LandTitle is Ownable {
    address public oracle;      // Oracle address
    uint256 public timeout;     // Timeout in AEST as UNIX timestamp

    struct Title{
        uint256 id; // unique identifier
        string details; // location details
        address owner;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Title) public titles; // map title_id to Title
    mapping(uint256 => address) public owners; // map title_id to owner
    uint256 public nextId;

    // Events informing contract activities
    event checkOwnership(address owner, uint256 titleId);
    event TitleCreated(uint256 id, string details, address owner);
    event TitleForSale(uint256 id, uint256 price);
    event TitleSold(uint256 id, address newOwner);

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
    function createTitle(string memory _details) public onlyOwner {
        titles[nextId] = Title(nextId, _details, msg.sender, 0, false);
        owners[nextId] = msg.sender;
        emit TitleCreated(nextId, _details, msg.sender);
        nextId++;
    }

    function getTitle(uint256 _id) public view returns (Title memory) {
        return titles[_id];
    }

    function putTitleForSale(uint256 _id, uint256 _price) public {
        require(titles[_id].owner == msg.sender, "Only the owner can put the title for sale");
        titles[_id].price = _price;
        titles[_id].forSale = true;
        emit TitleForSale(_id, _price);
    }

    function buyTitle(uint256 _id) public {
        require(titles[_id].forSale, "This title is not for sale");
        require(oracle.verifyPayment(msg.sender, titles[_id].price), "Payment not verified");

        address seller = titles[_id].owner;
        titles[_id].owner = msg.sender;
        titles[_id].forSale = false;
        titles[_id].price = 0;

        emit TitleSold(_id, msg.sender);
    }
}