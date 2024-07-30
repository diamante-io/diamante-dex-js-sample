Here is the README file structured for pasting:

````
Diamante Custom Token and Market Order Management
==============================================

This project demonstrates how to create and manage a custom token on the Diamante blockchain using the Diamante SDK. It also includes functionality for placing buy and sell orders in a simulated market environment.

Prerequisites
------------

* Node.js (>= 14.x)
* Diamante SDK (diamante-base and diamante-sdk-js)

Setup
-----

```bash
npm install
````

## Configure Secrets:

Replace the placeholder secret keys in the code with your own issuing, distribution, and trader account secrets.

## Usage

### Create Custom Token

The `createCustomToken` function creates a custom token with a predefined total supply. It also establishes a trustline between the issuing account and the distribution account.

### Create Trader Trustline

The `createTraderTrustline` function creates a trustline between the trader and the custom token X7.

### Place Orders

The `placeSellOrder` and `placeBuyOrder` functions allow you to place sell and buy orders on the market.

### Monitor Market

The `monitorMarketAndPlaceOrders` function simulates a market where buy and sell orders are placed automatically based on predefined conditions. It includes:

- Placing initial sell orders.
- Matching buy orders.
- Adjusting prices and volumes based on market conditions.

### Configure Keypairs

Update the `issuingKeys`, `distributionKeys`, and `traderKeys` with your account secrets.

## Code Overview

### Keypair Creation

Generates keypairs for issuing, distribution, and trading accounts.

### Custom Token Creation

Uses the `Operation.changeTrust` and `Operation.payment` methods to create and fund a custom token.

### Trustline Creation

Establishes a trustline between the trader and the custom token.

### Order Management

Places and monitors buy and sell orders using `Operation.manageSellOffer` and `Operation.manageBuyOffer`.

### Market Simulation

Adjusts prices and volumes of orders based on market activity.
