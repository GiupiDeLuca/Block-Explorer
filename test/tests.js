const { assert } = require("chai");

const {
  mixRange,
  txByUser,
  isContract,
  howMuchEth,
  exploreBlock,
} = require("./testUtils");

let block;
let transactions;

describe("Block Explorer", async () => {
  beforeEach(async () => {
    block = await web3.eth.getBlock(4);
    transactions = block.transactions;
  });

  it("Should return the total value transacted in the specific block", async () => {
    const result = await howMuchEth(transactions);
    const transaction = await web3.eth.getTransaction(transactions[0]);
    const numValue = parseFloat(
      await web3.utils.fromWei(transaction.value, "ether")
    );
    assert(result == numValue, "The total value of tx in this block was 5000 wei");
  });

  it("Should be able to distinguish between a contract address or not", async () => {
    const test1 = await isContract(
      "0x325fC05700A8e2fD198865ea0Dd9Afa49ad18400"
    );
    const test2 = await isContract(
      "0xc865f0F28F3dA17e8e1fbB993aFa3e307144D289"
    );

    assert(
      test1 == false && test2 == false,
      "Something went wrong when analyzing these addresses"
    );
  });

  it("Should correctly group the transactions by type of user", async () => {
    const resultSender = await txByUser(transactions, "sender");
    assert(resultSender.length == 1, "Only one sent transaction on this block");

    const resultReceiver = await txByUser(transactions, "sender");
    assert(
      resultReceiver.length == 1,
      "Only one received transaction on this block"
    );
  });
});

describe("Range Functions", async () => {
  it("Should return the last 'n' number of blocks when called with one parameter", async () => {
    const lastTwo = await mixRange(2);
    assert(lastTwo.length == 2);
  });

  it("Should return the data within the range of blocks specified if called with two parameters", async () => {
    const range = await mixRange(11, 9);
    assert(range.length == 3);
  });
});
