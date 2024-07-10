// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// To -do 
// figure out more user attributes (other than ID)
// 
// This will import landTitle contract
// includes:
// user registration (handled by an oracle(typescript) refer lab 3(dummy oracle))
    // function that returns all the land that the user owns
                        // OR
    // should we have a list for each user to store the land that they own (probably because a user can be either buyer 
    // or seller, in the later stages a buyer(intially had no land) may want to sell the land they own)a
contract userFunctionality{
    struct userDetails{
        address userId;
        mapping(uint256 => bool) owns; //map title id 
    }
}
