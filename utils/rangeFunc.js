const { exploreBlock } = require("./getBlockInfo");
const range = require("lodash.range");
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://speedy-nodes-nyc.moralis.io/3dfe6a6f91e3588b00c753e3/eth/ropsten`
  )
);

const myArgs = process.argv.slice(2);

/**
 * Logs a data object based on the input params.
 * If only one param = n it will log an object data for each of the last n blocks.
 * If two params (n1, n2), it will log a data object for each block going from n1 to n2 inclusive.
 * @param {int} param1 
 * @param {int} param2 
 */

async function mixRange(param1, param2) {
  param1 = parseInt(param1);
  param2 = parseInt(param2);
  let blockNumbers;
  if (myArgs.length == 1) {
    const latest = await web3.eth.getBlockNumber();

    blockNumbers = range(latest, latest - param1, -1);
  } else if (myArgs.length == 2) {
    blockNumbers = range(param1, param2, -1);
  } else {
    throw "this function can only take one or two parameters";
  }

  for (let i = 0; i < blockNumbers.length; i++) {
    const data = await exploreBlock(blockNumbers[i]);
    console.log(data);
  }
}

mixRange(myArgs[0], myArgs[1]);

module.exports = {
  mixRange,
};
