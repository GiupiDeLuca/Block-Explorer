const Web3 = require("web3");
const web3 = new Web3("ws://localhost:8545");
const range = require("lodash.range");

async function howMuchEth(transactions) {
  let result = 0;

  for (let i = 0; i < transactions.length; i++) {
    const transaction = await web3.eth.getTransaction(transactions[i]);
    if (transaction.value) {
      let numValue = parseFloat(
        await web3.utils.fromWei(transaction.value, "ether")
      );
      result += numValue;
    }
  }
  return result;
}

async function isContract(address) {
  const result = await web3.eth.getCode(address);
  return result != "0x";
}

async function txByUser(transactions, userType) {
  let txRecords = [];

  for (let i = 0; i < transactions.length; i++) {
    const transaction = await web3.eth.getTransaction(transactions[i]);

    let user;

    if (userType === "sender") {
      user = await transaction.from;
    } else if (userType === "receiver") {
      user = await transaction.to;
    } else {
      throw "user can only be a 'sender' or a 'receiver'";
    }

    txRecords.push({
      address: user,
      amount: parseFloat(await web3.utils.fromWei(transaction.value, "ether")),
      isContract: user == null ? null : await isContract(user),
    });
  }

  const result = txRecords.reduce((acc, curr) => {
    const { address, amount, isContract } = curr;
    const findObj = acc.find((o) => o.address === address);
    if (!findObj) {
      acc.push({ address, amount, isContract });
    } else {
      findObj.amount += amount;
    }
    return acc;
  }, []);

  return result;
}

async function exploreBlock(blockNum) {
  const block = await web3.eth.getBlock(blockNum);
  const transactions = block.transactions;

  const result = {
    block: blockNum,
    txAmount: await howMuchEth(transactions),
    receivers: await txByUser(transactions, "receiver"),
    senders: await txByUser(transactions, "sender"),
  };

  return result;
}

async function mixRange(param1, param2) {
  const result = [];
  let blockNumbers;
  if (arguments.length == 1) {
    const latest = await web3.eth.getBlockNumber();
    blockNumbers = range(latest, latest - param1, -1);
  } else if (arguments.length == 2) {
    blockNumbers = range(param1, param2 - 1, -1);
  } else {
    throw "this function can only take one or two parameters";
  }
  for (let i = 0; i < blockNumbers.length; i++) {
    const data = await exploreBlock(blockNumbers[i]);
    // console.log(data)        // only to see what it looks like in testing
    result.push(data);
  }
  // console.log(result);       // kept it here only for quick testing
  return result;
}

module.exports = {
  mixRange,
  howMuchEth,
  txByUser,
  isContract,
  exploreBlock,
};
