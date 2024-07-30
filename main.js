import {
  Keypair,
  BASE_FEE,
  TransactionBuilder,
  Operation,
  Asset,
  Networks,
} from "diamante-base";
import { Horizon } from "diamante-sdk-js";

// Create a keypair for the custom token X
const issuingKeys = Keypair.fromSecret(""); // Replace with your issuing account secret
const distributionKeys = Keypair.fromSecret(""); // Replace with your distribution account secret

// Hardcoded trader keypair
const traderKeys = Keypair.fromSecret(""); // Replace with your trader account secret

// Create custom asset X
const XAsset = new Asset("", issuingKeys.publicKey()); // Replace with your token name
const DIAM = new Asset.native(); // Hardcoded DIAM asset

// Server instance
const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");

// Function to create the custom token X with a supply of 100,000
const createCustomToken = async () => {
  const account = await server.loadAccount(issuingKeys.publicKey());

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: "Diamante Testnet",
  })
    .addOperation(
      Operation.changeTrust({
        asset: XAsset,
        source: distributionKeys.publicKey(),
      })
    )
    .addOperation(
      Operation.payment({
        destination: distributionKeys.publicKey(),
        asset: XAsset,
        amount: "", // Replace with your predefined supply
      })
    )
    .setTimeout(100)
    .build();

  transaction.sign(issuingKeys);
  transaction.sign(distributionKeys);

  await server.submitTransaction(transaction);
  console.log("Custom token X created");
};

// Function to create a trustline between the trader and the asset
const createTraderTrustline = async () => {
  const account = await server.loadAccount(traderKeys.publicKey());

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: "Diamante Testnet",
  })
    .addOperation(
      Operation.changeTrust({
        asset: XAsset,
        source: traderKeys.publicKey(),
      })
    )
    .setTimeout(100)
    .build();

  transaction.sign(traderKeys);

  await server.submitTransaction(transaction);
  console.log("Trustline created between trader and asset X");
};

// Function to place sell orders
const placeSellOrder = async (sellingAsset, buyingAsset, amount, price) => {
  const account = await server.loadAccount(distributionKeys.publicKey());

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: "Diamante Testnet",
  })
    .addOperation(
      Operation.manageSellOffer({
        selling: sellingAsset,
        buying: buyingAsset,
        amount: amount,
        price: price,
      })
    )
    .setTimeout(100)
    .build();

  transaction.sign(distributionKeys);
  const result = await server.submitTransaction(transaction);
  console.log(
    `Sell order placed: ${amount} ${sellingAsset.code} at price ${price} ${buyingAsset.code}`
  );
  return result.hash;
};

// Function to place buy orders
const placeBuyOrder = async (sellingAsset, buyingAsset, buyAmount, price) => {
  const account = await server.loadAccount(traderKeys.publicKey());

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: "Diamante Testnet",
  })
    .addOperation(
      Operation.manageBuyOffer({
        selling: sellingAsset,
        buying: buyingAsset,
        buyAmount: buyAmount,
        price: price,
      })
    )
    .setTimeout(100)
    .build();

  transaction.sign(traderKeys);
  await server.submitTransaction(transaction);
  console.log(
    `Buy order placed: ${buyAmount} ${buyingAsset.code} at price ${price} ${sellingAsset.code}`
  );
};

// Sleep function
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Monitor the market and place subsequent orders based on demand
const monitorMarketAndPlaceOrders = async () => {
  let XVolume = 10;
  let XPrice = 1;
  let DIAMVolume = 10;
  let DIAMPrice = 1;

  while (true) {
    // Place initial sell order for X by distributor
    const sellOrderHash = await placeSellOrder(
      XAsset,
      DIAM,
      XVolume.toString(),
      XPrice.toString()
    );

    // Sleep for 10 seconds
    await sleep(10000);

    // Place buy orders to match the sell order by trader
    await placeBuyOrder(DIAM, XAsset, XVolume.toString(), XPrice.toString());

    // Check if sell order is complete and place new sell order for X at higher price
    XVolume = 10;
    XPrice += 1;

    // Place sell order for DIAM by distributor
    const diamSellOrderHash = await placeSellOrder(
      DIAM,
      XAsset,
      DIAMVolume.toString(),
      DIAMPrice.toString()
    );

    // Sleep for 10 seconds
    await sleep(10000);

    // Place buy orders to match the sell order by trader
    await placeBuyOrder(
      XAsset,
      DIAM,
      DIAMVolume.toString(),
      DIAMPrice.toString()
    );

    // Check if sell order is complete and place new sell order for DIAM at higher volume
    DIAMVolume = 10;
    DIAMPrice += 1;
  }
};

const main = async () => {
  await createCustomToken();
  await createTraderTrustline();
  await monitorMarketAndPlaceOrders();
};

main().catch(console.error);
