const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://speedy-nodes-nyc.moralis.io/3dfe6a6f91e3588b00c753e3/eth/ropsten"
  )
);

/**
 * Takes in an array of transactions and returns the total value of ETH exchanged in it.
 * @param {array} transactions
 * @returns {int}
 */

async function howMuchEth(transactions) {
  let result = 0;

  try {
    for (let i = 0; i < transactions.length; i++) {
      const transaction = await web3.eth.getTransaction(transactions[i]);
      if (transaction.value) {
        let numValue = parseFloat(
          await web3.utils.fromWei(transaction.value, "ether")
        );
        result += numValue;
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    return result;
  }
}

/**
 * Takes in an address and returns a boolean based on if the input address is a contract or not
 * @param {address} address
 * @returns {boolean}
 */

async function isContract(address) {
  const result = await web3.eth.getCode(address);
  return result != "0x";
}

/**
 * Takes in an array of transactions and a user type which is a string of either "receiver" or "sender" value.
 * It returns an array of transaction records by user type including:
 * the user address, the amount transacted, and the boolean isContract()
 * @param {array} transactions
 * @param {string} userType
 * @returns {array}
 */

async function txByUser(transactions, userType) {
  try {
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
        amount: parseFloat(
          await web3.utils.fromWei(transaction.value, "ether")
        ),
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
  } catch (error) {
    console.error(error);
  }
}

/**
 * Takes in a block number and returns an object representing the specified block with keys:
 * block (representing the block number),
 * txAmount (representing the total value transacted in the block),
 * receivers (an array of all transactions by "receiver"),
 * senders (an array of all transactions by "sender")
 *
 * @param {int} blockNum
 * @returns {object}
 */

async function exploreBlock(blockNum) {
  try {
    const block = await web3.eth.getBlock(blockNum);
    const transactions = block.transactions;

    const result = {
      block: blockNum,
      txAmount: await howMuchEth(transactions),
      receivers: await txByUser(transactions, "receiver"),
      senders: await txByUser(transactions, "sender"),
    };

    return result;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  exploreBlock,
};
