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
if (cmdArgs.length < 2) {
    console.error("Usage: node buyer.js LandTitleAddress TitleId");
    process.exit(1);
}

(async () => {
    const accountName = 'buyer';
    const web3 = initProvider();
    const landTitleAddress = cmdArgs[0];
    const titleId = cmdArgs[1];

    getAccount(web3, accountName);
    const from = web3.eth.accounts.wallet[0].address;
    console.log(`Buyer running as account ${accountName} with address ${from}`);

    const landTitleAbi: AbiItem[] = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "buyTitle",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    const landTitleContract = new web3.eth.Contract(landTitleAbi, landTitleAddress);

    try {
        await landTitleContract.methods.buyTitle(titleId).send({ from });
        console.log(`Buy request for title ${titleId} sent.`);
    } catch (error) {
        console.error('Error buying title:', error);
    }
})();
