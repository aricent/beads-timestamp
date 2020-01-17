# Ts App

TimeStamping App

## Directory Map

1. tsapp
2. sqlite

## Installation instructions for each directory

Use the node package manager [npm](https://www.npmjs.com/) to install dependencies.

```nodejs
npm install
```
Python must be installed in the machine. Once Python is installed run

```python
pip install merkletools

# NOTE: Without Python, Ts APP won't work.
```

```bash
Setting Up GETH and METAMASK

## METAMASK SETTING UP

1. 	Follow the Tutorial on Medium
	https://medium.com/coinmonks/a-really-simple-smart-contract-on-how-to-insert-value-into-the-ethereum-blockchain-and-display-it-62c455610e98

2. Using Metamask we just buy and set the account ether i.e 1 Ether to the account.

3. Using Metamask we deploy a contract on Ethereum.

4. All of this steps are explained on the tutorial.

## GETH SETTING UP

1. For Installing GETH on Linux Enviroment.
    https://geth.ethereum.org/docs/install-and-build/installing-geth

2. Run GETH in Background
    COMMAND:
        screen -d -m geth --testnet --rpc --syncmode light --ws --wsorigins testnode1 --unlock <METAMASK_ACCOUNT_ID> --password <PASSWORD_FILE_PATH> --allow-insecure-unlock        
    Example:
	    screen -d -m geth --testnet --rpc --syncmode light --ws --wsorigins testnode1 --unlock 0x210B0d1c071CE9E59f408972dBcC4C98D9945381 --password ./password --allow-insecure-unlock
	2.1 Not that the password file should be located on the directory.
	2.2 Password Files, must have an next line, meaning a blank next line, which simulates the enter key.

3. HTTP Command Line for GETH:
	geth attach http://127.0.0.1:8545

4. Command Line for GETH Accounts
	geth --testnet account list

5. Importing a Metamsk Testnet Ethereum Wallet to GETH
	geth --testnet account import private_key
	
	5.1 Import the Metamask Account to GETH.
	5.2 Private Key of Metamask in found in the METAMASK Account Details.
	
```

## Setting Up Web3 on Express Server

The following assumes that 

1. MetaMask Account has been created, and has enough ethers for transactions.
2. Contract has been  compiled and deployed on [https://remix.ethereum.org/](https://remix.ethereum.org/)
3. GETH is configured and running.
4. GETH HTTP IP and PORT are reachable.

Use the package manager [https://www.npmjs.com/package/web3](https://www.npmjs.com/package/web3) to install Web3 dependencies.

```bash
npm install web3 --save
```

Change the below code segment values only according to configuration.

Start updating the file, for updating the code to new configuration.

```nodejs
var web3 = new Web3(<GETH_HTTP_IP:GETH_HTTP_PORT>);
// Mostly GETH has HTTP running on <IP>:<PORT> 
// http://localhost:8545 on local machine
// http://<MACHINE_IP>:8545 on network

const abi=<CONTRACT_ABI_ARRAY>;
// Copy the Contract ABI from remix.ethereum, where the contract
// was compiled and deployed.

const contract_Address=<CONTRACT_ADDDRESS>;
// Copy the Contract Address from remix.ethereum, where the contract
// was compiled and deployed.

const fromAddress = <FROM_ADDRESS>;
// Copy the From Address from Metamask.
```

After updating the following code segments according to configuration jump to

```nodejs
router.post('/addtoblockchain') API Endpoint
// This API commits to Ropsten Ethereum End Point

// Currently the code is as below
contract.methods.set(req.body["hash_obj"]).send({from: fromAddress})
  .on('transactionHash', function(hash){
    console.log(hash);
  })
  .on('receipt', function(receipt){
    console.log(receipt);
  })
  .on('confirmation', function(confirmationNumber, receipt){
    console.log(confirmationNumber, receipt);
    res.send(receipt);	  
  })
  .on('error', console.error);

// To update the contract to call 
// a new function with predefined
// number of arguments, update the line,

contract.methods.set(req.body["hash_obj"])

// The first two objects i.e. contract.methods 
// are standard Web3 methods, so no updates should be made.

// The third object i.e. set(req.body["hash_obj"]) 
// is the name of the function and arguments on the contract
// deployed on remix.ethereum.
// If there is any change in the name of the function or argument
// please update the lines as required.

// FORMAT:
// contract.methods.<FUNCTION_NAME>(<FUNCTION_ARGUMENTS>)

// Post that, the '.on' events can be played around.

```

After updating make sure to restart the complete Express Application to reflect the changes.

## Usage

1. tsapp

```bash
#Follow the below commands for setting up arena
npm install
cd tsapp/
npm install
npm start
#Applicaton will run in,
http://<IP>:3070/tsapp

Default Credentials:
Username: <admin@tsapp.com>
Password: <abc123>
```

## IMPORTANT INFORMATION/ NOTES

1. Ts App uses a Bootstrap, hence it can downloaded as per user requirements or can be used over any CDN network.

2. Ts App runs on Ropsten Ethereum TestNet, so a Local Testnet node must be avaliable, on http port 8545.

#### &copy; Altran 2019-2020
