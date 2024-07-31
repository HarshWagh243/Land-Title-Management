# Land-Title-Management

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Deployment](#deployment)
  - [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)


## Introduction
A secure and efficient land title management system using Ethereum blockchain. Automates transactions with smart contracts, ensures data integrity, and uses oracles for real-time payment verification. Features digital certificate issuance and off-chain storage for large documents. Enhances transparency and efficiency in land ownership records.

## Features

- Decentralized management of land titles
- Secure transactions using smart contracts
- Off-chain oracle for confirming payments and user verification
- Tested using Hardhat framework

## Technologies

- **Solidity**: For developing smart contracts
- **JavaScript**: For scripting and testing
- **Hardhat**: For deployment and testing
- **Ethers.js**: For interacting with the Ethereum blockchain
<!-- - **Test Node**: Hardhat test node -->

## Getting Started

### Prerequisites

- yarn
- Hardhat
- Ethers.js

<!-- ## Steps to work locally

* clone the repo
* work on the files
* commit changes locally
* push to the repo using git push -->

# Make sure you have yarn installed before these steps...

* yarn init -y
* yarn add --dev hardhat
* yarn hardhat init

\
Welcome to Hardhat v2.22.6\
? What do you want to do? …\
->Create a JavaScript project\
Create a TypeScript project\
Create a TypeScript project (with Viem)\
Create an empty hardhat.config.js\
  Quit\

## Steps
- yarn hardhat node
- yarn hardhat compile 
- yarn hardhat test 
- address1="Address of User contract" yarn hardhat --network localhost FILE_NAME
  * ./scripts/index.js
  * ./scripts/oracle/index.js
  * ./scripts/seller/index.js
  * ./scripts/buyer/index.js
<!-- Has to be run in this order -->