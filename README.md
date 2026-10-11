# SimpleStorage DApp

> A MetaMask-powered React interface for reading and updating a value stored on an Ethereum-compatible blockchain.

SimpleStorage DApp is a beginner-friendly decentralized application (DApp) that demonstrates how a React frontend can interact with a Solidity smart contract. Users can connect MetaMask, read the current on-chain value, and submit a transaction to store a new value.

The project is configured for local development with Ganache and Truffle.

## Features

- Connects to MetaMask and requests the user's selected account.
- Verifies that MetaMask is connected to the expected Ganache network.
- Reads the stored value from the `SimpleStorage` contract.
- Updates the stored value through a signed MetaMask transaction.
- Displays the connected account, transaction status, and transaction hash.
- Uses React 19 and Vite for a fast development experience.

## Tech stack

- **Frontend:** React 19
- **Build tool:** Vite
- **Blockchain interaction:** Web3.js
- **Smart contract:** Solidity
- **Development framework:** Truffle
- **Local blockchain:** Ganache
- **Wallet:** MetaMask
- **Network:** Ganache development network (`network ID 5777`)

## Project structure

When the complete workspace is pushed to GitHub, the relevant files are organized as follows:

```text
Blockchain/
├── contracts/
│   └── SimpleStorage.sol
├── migrations/
│   └── 2_deploy_simple_storage.js
├── build/
│   └── contracts/
│       └── SimpleStorage.json
├── truffle-config.js
└── simple-storage-dapp/
    ├── src/
    │   ├── SimpleStorage.json
    │   ├── SimpleStorageApp.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── index.html
```

The React app uses the ABI and deployment address from `src/SimpleStorage.json`. If the contract is redeployed, update this artifact before starting the frontend.

## Prerequisites

Install or configure the following before running the project:

- [Node.js](https://nodejs.org/) 18 or newer
- [MetaMask](https://metamask.io/)
- [Ganache](https://trufflesuite.com/ganache/) Desktop or the Ganache CLI
- Truffle CLI through `npx`

## Getting started

### 1. Clone the repository

From the directory where you want to store the project:

```bash
git clone <your-repository-url>
cd Blockchain
```

The commands below assume that the Truffle files and `simple-storage-dapp` are kept under the same project root.

### 2. Start Ganache

Use Ganache Desktop with:

- **RPC server:** `http://127.0.0.1:7545`
- **Network ID:** `5777`

Alternatively, start Ganache from a terminal:

```bash
npx ganache --server.host 127.0.0.1 --server.port 7545 --chain.networkId 5777
```

Keep Ganache running while using the application.

### 3. Compile and deploy the contract

From the workspace root:

```bash
npx truffle compile
npx truffle migrate --network development --reset
```

The compiled artifact is generated at:

```text
build/contracts/SimpleStorage.json
```

Copy the updated artifact to the frontend if needed:

```bash
copy build\contracts\SimpleStorage.json simple-storage-dapp\src\SimpleStorage.json
```

On macOS or Linux, use:

```bash
cp build/contracts/SimpleStorage.json simple-storage-dapp/src/SimpleStorage.json
```

### 4. Configure MetaMask

Add or select the local Ganache network in MetaMask:

| Setting | Value |
| --- | --- |
| Network name | Ganache Local |
| New RPC URL | `http://127.0.0.1:7545` |
| Chain ID | `1337` or the chain ID shown by Ganache |
| Currency symbol | ETH |

The application checks the **network ID** returned by the provider and requires `5777`. Import one of the accounts/private keys displayed by Ganache into MetaMask so the wallet can sign transactions.

> If MetaMask reports a network mismatch, confirm both the Ganache network ID and the deployment entry in `SimpleStorage.json`. The frontend currently expects the Truffle network key `5777`.

### 5. Install dependencies and start the frontend

Open a new terminal and run:

```bash
cd simple-storage-dapp
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Using the application

1. Open the app in a browser with the MetaMask extension installed.
2. Approve the account connection request.
3. Use **Get stored value** to read the current value from the blockchain.
4. Enter a non-negative integer in **New value**.
5. Select **Store value** and confirm the transaction in MetaMask.
6. Wait for confirmation to see the updated value and transaction hash.

Reading the value is a read-only blockchain call. Storing a value changes contract state and requires a signed transaction and gas.

## Smart contract

`SimpleStorage.sol` stores one unsigned integer:

```solidity
uint256 private storedData;

function set(uint256 x) public {
  storedData = x;
}

function get() public view returns (uint256) {
  return storedData;
}
```

## Available frontend commands

Run these commands from `simple-storage-dapp`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the frontend source with Oxlint |

## Contract commands

Run these commands from the workspace root:

```bash
npx truffle test --network development
npx truffle console --network development
```

Inside the Truffle console, you can verify the contract manually:

```javascript
var instance = await SimpleStorage.deployed()
var transaction = await instance.set(42)
transaction.tx
(await instance.get()).toString()
```

The final command should return:

```text
'42'
```

## Troubleshooting

### MetaMask is not installed

Install the MetaMask browser extension and reload the application.

### The app reports that no deployment was found

Run the Truffle compile and migration commands, then copy the generated `SimpleStorage.json` artifact into `simple-storage-dapp/src`.

### The app reports a wrong network ID

Make sure Ganache is running with network ID `5777` and that MetaMask is connected to the same local blockchain. Restarting Ganache creates a new chain, so the contract must be deployed again.

### Transactions fail

Confirm that the selected MetaMask account is funded by Ganache and that the account is connected to the local network. Also check that Ganache is still running on port `7545`.

## Security note

This project is intended for local development and learning. Do not use the local private keys, test accounts, or development contract configuration with real funds or production deployments.

## License

This project is available under the [MIT License](https://opensource.org/license/mit/).
