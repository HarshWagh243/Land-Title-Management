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
  - [Scripts](#scripts)
  - [Testing](#testing)

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

## Getting Started

### Prerequisites

- Node.js
- yarn

### Installation

- yarn add --dev hardhat


## Deployment
- yarn hardhat node
- yarn hardhat compile 
- yarn hardhat --network localhost run ./scripts/index.js

### Scripts
#### For mac OS
- address1= *Address of User contract* yarn hardhat --network localhost *FILE_NAME*
#### For windows OS
- $env:address1="*Address of User contract*"; yarn hardhat --network localhost run *FILE_NAME*
### FILENAME 
- **Has to be run in this order**
  * ./scripts/oracle/index.js
  * ./scripts/seller/index.js
  * ./scripts/buyer/index.js


### Testing
  - yarn hardhat test 