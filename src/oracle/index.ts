import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import * as fs from 'fs';
import * as readline from 'readline';
import { stdin, stdout } from 'process';

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
    console.error("Usage: node oracle.js LandTitleAddress");
    process.exit(1);
}

// (async () => {
//     const accountName = 'oracle';
//     const web3 = initProvider();
//     const landTitleAddress = cmdArgs[0];

//     getAccount(web3, accountName);
//     const from = web3.eth.accounts.wallet[0].address;
//     console.log(`Oracle running as account ${accountName} with address ${from}`);

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
//         .on('data', async (event: any) => {
//             const { id, newOwner } = event.returnValues;
//             console.log(`Title ${id} sold to ${newOwner}`);
//             console.log('Notifying buyer and seller...');

//             // Simulating approval process
//             const rl = readline.createInterface({
//                 input: stdin,
//                 output: stdout,
//                 prompt: 'Approve transaction? (yes/no) '
//             });

//             rl.prompt();
//             rl.on('line', async (line) => {
//                 if (line.trim().toLowerCase() === 'yes') {
//                     console.log(`Transaction approved for title ${id}`);
//                     // Notify buyer and seller
//                     // You can implement actual notification logic here
//                 } else {
//                     console.log(`Transaction denied for title ${id}`);
//                 }
//                 rl.close();
//             });
//         })
//         .on('error', (error: any) => {
//             console.error('Error on event listener:', error);
//         });
// })();
