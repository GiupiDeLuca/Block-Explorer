const Web3 = require("web3");
const web3 = new Web3("ws://localhost:8545");
const truffleAssert = require("truffle-assertions");
const should = require("chai").should();

const {
  mixRange,
  txByUser,
  isContract,
  howMuchEth,
  exploreBlock,
} = require("./testUtils");

// web3.eth.getBlock(4).then(console.log);

async function test() {
  const block = await web3.eth.getBlock(4);
  const transactions = block.transactions;

  const transaction = await web3.eth.getTransaction(transactions[0]);
  console.log(transaction);
}

// exploreBlock(4)
mixRange(138, 135)
