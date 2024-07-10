// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin";

// To - DO
// add a mapping to map title id to owner id
// probably have an escrow contract to manage transaction
// figure out more functionalities and add them in to-do
contract LandTitle is Ownable {
    struct Title {
        uint256 id;
        string details;
        address owner;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Title) public titles;
    uint256 public nextId;

    event TitleCreated(uint256 id, string details, address owner);
    event TitleForSale(uint256 id, uint256 price);
    event TitleSold(uint256 id, address newOwner);

    constructor(address oracleAddress) {
        oracle = PaymentOracle(oracleAddress);
    }

    function createTitle(string memory _details) public onlyOwner {
        titles[nextId] = Title(nextId, _details, msg.sender, 0, false);
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin";

// To - DO
// add a mapping to map title id to owner id
// probably have an escrow contract to manage transaction
// figure out more functionalities and add them in to-do
contract LandTitle is Ownable {
    struct Title {
        uint256 id;
        string details;
        address owner;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Title) public titles;
    uint256 public nextId;

    event TitleCreated(uint256 id, string details, address owner);
    event TitleForSale(uint256 id, uint256 price);
    event TitleSold(uint256 id, address newOwner);

    constructor(address oracleAddress) {
        oracle = PaymentOracle(oracleAddress);
    }

    function createTitle(string memory _details) public onlyOwner {
        titles[nextId] = Title(nextId, _details, msg.sender, 0, false);
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

