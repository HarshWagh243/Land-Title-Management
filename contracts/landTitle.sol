// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// privacy as in only the lands that are for sale will be visible to the buyer and not allb

contract LandTitle {
    address public oracle;      // Oracle address
    uint256 public timeout;     // Timeout in AEST as UNIX timestamp should be initiated when transaction is initiated
    bool public inUse; // used to kill a contract
    uint256 public nextId;

    struct Title {
        uint256 id; // unique identifier
        string details; // location details
        uint256 ownerId; // userId from user contract
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Title) public titles; // map title_id to Title
    // mapping(uint256 => address) public owners; // map title_id to owner
    

    // Events informing contract activities
    // event checkOwnership(uint256 owner, string details); // approved by oracle
    // event TitleCreated(uint256 titleId, string details, uint256 ownerId); // response given to owner
    // event TitleForSale(uint256 titleId, uint256 price); // response given to the owner who puts it on sale
    // event VerifyTransaction(uint256 buyerId, uint256 sellerId); // approved by oracle
    // event TitleSold(uint256 id, uint256 sellerId, bool sold); // response given to seller
    // event TitlePurchased(uint256 id, uint256 buyerId, bool purchased);

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

    // /**
    //  * @dev Request to create title as a owner. Once the request is made
    //  * oracle is informed to perform verification and send status via event
    //  * @param _details land info
    //  * @param userId users Id
    //  */
    // function createTitle(string memory _details, uint userId) public returns (bool) {
    //     titles[nextId] = Title(nextId, _details, userId, 0, false); // price set to zero as not yet put for sale
    //     // emit checkOwnership(userId, _details);
    // }   

    /**
     * @dev oracle has verified the title
     */
    function addTitle(string memory _details, uint userId, bool verified) public returns(uint256) {
        require(inUse, "Contract is disable!");
        // require(msg.sender == oracle, "Only Oracle can approve!"); checking not required as checked in verifyland in user
        if (verified){
            titles[nextId] = Title(nextId, _details, userId, 0, false); // price set to zero as not yet put for sale
            // emit checkOwnership(userId, _details);
            // emit TitleCreated(nextId, _details, userId);
            nextId++; 
        }
        else
            revert("Title not owned by the user!");
        return (nextId - 1);
    }

    /**
     * @dev Request title price as a buyer.
     */
    function getTitlePrice(uint256 _id) public view returns (uint256){
        return titles[_id].price;
    }
    /**
     * @dev Request title price as a buyer.
     */
    function getTitleDetails(uint256 _id) public view returns (string memory){
        return titles[_id].details;
    }
    /**
     * @dev Request title price as a buyer.
     */
    function getTitleOwnerId(uint256 _id) public view returns (uint256){
        return titles[_id].ownerId;
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
        // emit TitleForSale(_titleId, _price);
    }

    /**
     * @dev Put title on sale as a owner.
     * @param _titleId id of the title
     * @param buyerId id of the buyer
     */ 
    // add timestamp implementation
    function buyTitle(uint256 _titleId, uint256 buyerId) public view{
        require(inUse, "Contract is disabled!");
        require(titles[_titleId].forSale, "This title is not for sale");

        // emit VerifyTransaction(buyerId, titles[_titleId].ownerId);
    }
    /**
     * @dev Put title on sale as a owner.
     * @param _titleId id of the title
     * @param buyerId id of the buyer
     */
    function approvePurchase(uint256 _titleId, uint256 buyerId, bool txnVerified) public {
        require(inUse, "Contract is disabled!");
        require(msg.sender == address(oracle), "Only the oracle can approve purchase");
        
        // uint256 sellerId = titles[_titleId].ownerId;
        
        if (txnVerified){
            titles[_titleId].ownerId = buyerId;
            titles[_titleId].forSale = false;
            titles[_titleId].price = 0;
        }
        
        // emit TitleSold(_titleId, buyerId, txnVerified);
        // emit TitlePurchased(_titleId, sellerId, txnVerified);
    }
}