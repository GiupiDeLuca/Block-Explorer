const Wallet = artifacts.require("Wallet");

module.exports = async function (deployer, network, accounts) {
  const wallet = await Wallet.new();

  await wallet.deposit({ value: 5000 });

  await wallet.transfer(accounts[1], { value: 4000 });

  const balance = await wallet.getMyBalance();
  console.log("acc[0]", balance);

  await wallet.transfer(accounts[2], { from: accounts[1], value: 2000 });

  const contractBalance1 = await wallet.contractBalance();
  console.log("contractBalance1", contractBalance1);

  // accounts[0] withdraws
  await wallet.withdrawAll()

  const contractBalance2 = await wallet.contractBalance();
  console.log("contractBalance2", contractBalance2);

};
