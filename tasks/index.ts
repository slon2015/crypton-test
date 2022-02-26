import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("donate", "Send donate to specified funding contract")
  .addParam("contract", "Address of contract")
  .addParam("amount", "Amount of your donation in Wai")
  .setAction(async (taskArgs, hre) => {
    const [sender] = await hre.ethers.getSigners();

    const fund = await hre.ethers.getContractAt("Funding", taskArgs.contract);

    const amount = hre.ethers.BigNumber.from(taskArgs.amount);
    const tx = await fund.connect(sender).donate({ value: amount });

    await tx.wait();
  });

task("donaters", "View donaters list")
  .addParam("contract", "Address of contract")
  .setAction(async (taskArgs, hre) => {
    const [sender] = await hre.ethers.getSigners();

    const fund = await hre.ethers.getContractAt("Funding", taskArgs.contract);

    const list = await fund.connect(sender).getDonators();

    console.log("There was " + list.length + " donators");
    list.forEach((address: string) => {
      console.log(address);
    });
  });

task("donationAmount", "View donater amount")
  .addParam("contract", "Address of contract")
  .addParam("donater", "Address of donater")
  .setAction(async (taskArgs, hre) => {
    const [sender] = await hre.ethers.getSigners();

    const fund = await hre.ethers.getContractAt("Funding", taskArgs.contract);

    const amount = await fund
      .connect(sender)
      .getDonationAmount(taskArgs.donater);

    console.log("Donater " + taskArgs.donater + " was sent " + amount + " Wei");
  });

task("manage", "Extract donations from fund into specified address")
  .addParam("contract", "Address of contract")
  .addParam("amount", "Amount of your donation in Wai")
  .addParam("recepient", "Address to sending money")
  .setAction(async (taskArgs, hre) => {
    const [sender] = await hre.ethers.getSigners();

    const fund = await hre.ethers.getContractAt("Funding", taskArgs.contract);

    const tx = await fund
      .connect(sender)
      .manage(taskArgs.recepient, taskArgs.amount);

    await tx.wait();
  });
