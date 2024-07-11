import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as fs from 'fs';

const initProvider = (): Web3 => {
    const providerData = fs.readFileSync('eth_providers/providers.json', 'utf8');
    const providerJson = JSON.parse(providerData);
    const providerLink = providerJson['provider_link_ui'];
    return new Web3(new Web3.providers.WebsocketProvider(providerLink));
};

const getAccount = (web3: Web3, name: string): void => {
    const accountData = fs.readFileSync('eth_accounts/accounts.json', 'utf8');
    const accountJson = JSON.parse(accountData);
    const accountPvtKey = accountJson[name]['pvtKey'];
    web3.eth.accounts.wallet.add(accountPvtKey);
};

const cmdArgs = process.argv.slice(2);
if (cmdArgs.length < 1) {
    console.error("Usage: node seller.js LandTitleAddress");
    process.exit(1);
}

// (async () => {
//     const accountName = 'seller';
//     const web3 = initProvider();
//     const landTitleAddress = cmdArgs[0];

//     getAccount(web3, accountName);
//     const from = web3.eth.accounts.wallet[0].address;
//     console.log(`Seller running as account ${accountName} with address ${from}`);

//     const landTitleAbi: AbiItem[] = [
//         {
//             "anonymous": false,
//             "inputs": [
//                 {
//                     "indexed": false,
//                     "internalType": "uint256",
//                     "name": "id",
//                     "type": "uint256"
//                 },
//                 {
//                     "indexed": false,
//                     "internalType": "address",
//                     "name": "newOwner",
//                     "type": "address"
//                 }
//             ],
//             "name": "TitleSold",
//             "type": "event"
//         }
//     ];

//     const landTitleContract = new web3.eth.Contract(landTitleAbi, landTitleAddress);

//     landTitleContract.events.TitleSold({})
//         .on('data', (event: any) => {
//             const { id, newOwner } = event.returnValues;
//             console.log(`Title ${id} sold to ${newOwner}`);
//         })
//         .on('error', (error: any) => {
//             console.error('Error on event listener:', error);
//         });
// })();
