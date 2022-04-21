const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://speedy-nodes-nyc.moralis.io/3dfe6a6f91e3588b00c753e3/eth/ropsten"
  )
);


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
  console.log("total tx value", result);
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

  console.log(`${userType}s`, result);
  return result;
}

async function exploreBlock(blockNum) {
  // takes in a blocknumber
  const block = await web3.eth.getBlock(blockNum);
  const transactions = block.transactions;

  // returns total value exchanged
  await howMuchEth(transactions);

  // displays receivers with address - amount - isContract
  await txByUser(transactions, "receiver");

  // displays senders with address - amount - isContract
  await txByUser(transactions, "sender");
}

exploreBlock(12209809)

module.exports = {
  exploreBlock,
  howMuchEth,
  isContract,
  txByUser,
};
