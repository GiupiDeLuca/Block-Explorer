const { assert } = require("chai");
// const truffleAssert = require("truffle-assertions");
const Web3 = require("web3");

const web3 = new Web3("ws://localhost:8545");

web3.eth.getBlock(3).then(console.log);