// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./landTitle.sol";  

// contract2 user which requires land title contract to be deployed before deploying it
contract userFunctionality{
    address public titleAddress;
    LandTitle public titleContract; 
    uint256 private idCounter;
    uint256 private certIdCounter;

    mapping(address => userDetails) public users;
    mapping(uint256 => mapping(uint256 => bool)) owners;

    // events
    event getUserVerified(address indexed userAddress);//oracle
    event userVerified(address userAddress, bool verified);//user
    event getLandVerified(address userAddress, string details);//oracle
    event LandVerified(uint256 userId, uint256 titleId, string details, bool verified);//user
    event LandDetails(address caller, uint256 titleId, uint256 ownerId, uint256 price, string details);//user
    event TitleSold(uint256 _titleId, uint256 sellerId, bool sold); //user
    event TitleNotOnSale(uint256 _buyerId);//user
    event TitlePurchased(uint256 id, uint256 buyerId, bool purchased);//user
    event verifyPurchaseOracle(uint256 titleId, uint256 buyerId);//oracle
    event PurchaseVerified(uint256 _titleId, uint256 sellerId, bool sold);//user
    event TitleOnSale(uint256 _titleId, address userAddress);

    // user struct, has all the details about a user
    struct userDetails{
        uint256 userId;
        uint256 certificateId; //stores id of certificate issued by CA
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
     * @dev users initiates the registration.
     */
    // function to register a new user once the user is verified
    function userRegistration() public{
        if (users[msg.sender].userId < 1)
            emit getUserVerified(msg.sender);
        else
            emit userVerified(msg.sender, true);
    }

    /**
     * @dev oracle verifies user
     * @param userAddress address of the user
     * @param verified true if oracle verifies
     */
    // function to verify the user, before it is registered as a new user
    function verifyUser(address userAddress, bool verified) public returns (bool){
        require(titleContract.inUse(), "Contract is disabled!");
        require(msg.sender == titleContract.oracle(), "Only oracle can add the user!");
        if (verified){
            users[userAddress].userId = idCounter;
            users[userAddress].certificateId = certIdCounter;
            idCounter++;
            certIdCounter++;
        }
        emit userVerified(userAddress, verified);
        return verified;
    }
    /**
     * @dev add owned land.
     *
     * @param userAddress user Address
     * @return userId of the address provided 
     */ 
    // getter function to get the user_id assosciated to a user
    function getUserId(address userAddress) public view returns(uint256){
        return users[userAddress].userId;
    }
    
    /**
     * @dev add owned land.
     *
     * @param _details LandTitle details (struct from landtitle) 
     */ 
    // function initiated by user to add new land details, which are added once the oracle verifies it
    function sendLandDetails(string memory _details) public{
        require(titleContract.inUse(), "Contract is disable!");
        require(users[msg.sender].userId >= 1, 'User not registered!');
        emit getLandVerified(msg.sender, _details);
    }
    /**
     * @dev add owned land.
     *
     * @param _details LandTitle details (struct from landtitle) 
     */ 
    // function used to verify the land details, which once verfied, the new land detail record is added
    function verifyLandDetails(string memory _details, address userAddress, bool verified) public returns (uint256, uint256){
        // uint256 tempId = 0;
        uint256 userId = users[userAddress].userId;
        require(titleContract.inUse(), "Contract is disable!");
        require(msg.sender == titleContract.oracle(), "Only oracle can add the user!");
        require(userId >= 1, 'User not registered!');
        uint256 titleId = titleContract.addTitle(_details, userId, verified);
        if (verified){
            require(titleId >= 10000);
            owners[userId][titleId] = true;
        }
        emit LandVerified(userId, titleId, _details, verified);
        return (userId, titleId);
    }    
    /**
     * @dev put a title on sale.
     *
     * @param _titleId LandTitle details (struct from landtitle) 
     */ 
    // function initiated by a verified user(seller) to put a verified land title on sale
    function putForSale(uint256 _titleId, uint256 _price) public{
        require(users[msg.sender].userId >= 1, 'User not registered!');
        titleContract.putTitleForSale(_titleId, users[msg.sender].userId, _price);
        emit TitleOnSale(_titleId, msg.sender);
        console.log("Got here!!");
    }

    /**
     * @dev put a title on sale.
     *
     * @param _titleId LandTitle details (struct from landtitle) 
     */
    // getter function to get land details assosciated to a land title id 
    function getLandDetails(uint256 _titleId) public{
        require(users[msg.sender].userId >= 1, 'User not registered!');
        emit LandDetails(msg.sender ,_titleId, titleContract.getTitleOwnerId(_titleId), titleContract.getTitlePrice(_titleId), titleContract.getTitleDetails(_titleId));
    }

    /**
     * @dev buy a land.
     *
     * @param _titleId LandTitle details (struct from landtitle) 
     */ 
    // function initiated by a verified user(buyer) to purchase a verfied land which is on sale
    function buyThisTitle(uint256 _titleId) public {
        // oracle will verify the details and then 
        uint256 buyerId = users[msg.sender].userId;
        require(buyerId >= 1, 'User not registered!');
    
        if (titleContract.checkOnSale(_titleId)){
            titleContract.setTimeout(_titleId, buyerId);
            emit verifyPurchaseOracle(_titleId,  buyerId);
        }
        else{
            emit TitleNotOnSale(buyerId);
        }
            
        
    }
    /**
     * @dev check if user owns a land
     *
     * @param userId user id
     * @param titleId LandTitle details (struct from landtitle) 
     */ 
    // function to check if the land title for which the user(buyer) initiated a purchase is on sale
    function checkOwns(uint256 userId, uint256 titleId) public view returns (bool){
        // oracle will verify the details and then 
        require(msg.sender == titleContract.oracle(), "Only oracle can check ownership!");
        return owners[userId][titleId];
    }
    /**
     * @dev check if user owns a land
     *
     * @param buyerId user id
     * @param titleId LandTitle details (struct from landtitle) 
     * @param verified or not
     */ 
    // function to verify if the initiated buying is approved and confirmed
    function verifyPurchase(uint256 buyerId, uint256 titleId, bool verified) public{
        require(msg.sender == titleContract.oracle(), "Only oracle can add the user!");
        // Timeout functionality
        uint256 sellerId = titleContract.getTitleOwnerId(titleId);
        if (verified){
            owners[sellerId][titleId] = false;
            owners[buyerId][titleId] = true;
        }
        titleContract.approvePurchase(titleId, buyerId, verified);
        emit TitleSold(titleId, sellerId, verified);
        emit TitlePurchased(titleId, buyerId, verified);
    }
}