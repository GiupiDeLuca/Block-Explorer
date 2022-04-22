const Wallet = artifacts.require("Wallet");

module.exports = async function (deployer, network, accounts) {
  const wallet = await Wallet.new();

  let contractBalance1 = await wallet.contractBalance();
  // console.log("contractBalance1 before", contractBalance1);

  await wallet.deposit({ value: 5000 });

  contractBalance1 = await wallet.contractBalance();
  // console.log("contractBalance1 after deposit[0]", contractBalance1);

  let balanceAcc1 = await wallet.getMyBalance({ from: accounts[1] });
  // console.log("acc[1] before", balanceAcc1);

  await wallet.transferTo(accounts[1], { value: 4000 });

  contractBalance1 = await wallet.contractBalance();
  // console.log("contractBalance1 after transfer to [1]", contractBalance1);

  const balanceAcc0 = await wallet.getMyBalance();
  // console.log("acc[0]", balanceAcc0);

  balanceAcc1 = await wallet.getMyBalance({ from: accounts[1] });
  // console.log("acc[1] after", balanceAcc1);

  await wallet.transferTo(accounts[2], { from: accounts[1], value: 2000 });

  await wallet.deposit({ from: accounts[2], value: 100000 });

  await wallet.transferTo(accounts[1], { from: accounts[2], value: 10000 });

  // contractBalance1 = await wallet.contractBalance();
  // console.log("contractBalance1", contractBalance1);

  // accounts[0] withdraws
  await wallet.withdrawAll();
  await wallet.withdrawAll({ from: accounts[1] });

  const contractBalance2 = await wallet.contractBalance();
  // console.log("contractBalance2", contractBalance2);
};
