const Wallet = artifacts.require("Wallet");

module.exports = async function (deployer, network, accounts) {
  const wallet = await Wallet.new();

  let contractBalance1 = await wallet.contractBalance();

  await wallet.deposit({ value: 5000 });

  contractBalance1 = await wallet.contractBalance();

  let balanceAcc1 = await wallet.getMyBalance({ from: accounts[1] });

  await wallet.transferTo(accounts[1], { value: 4000 });

  contractBalance1 = await wallet.contractBalance();

  const balanceAcc0 = await wallet.getMyBalance();

  balanceAcc1 = await wallet.getMyBalance({ from: accounts[1] });

  await wallet.transferTo(accounts[2], { from: accounts[1], value: 2000 });

  await wallet.deposit({ from: accounts[2], value: 100000 });

  await wallet.transferTo(accounts[1], { from: accounts[2], value: 10000 });

  await wallet.withdrawAll();
  await wallet.withdrawAll({ from: accounts[1] });

  const contractBalance2 = await wallet.contractBalance();
  
};
