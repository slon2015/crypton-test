import { expect } from "chai";
import { ethers } from "hardhat";

describe("Funding", function () {
  it("Should add donater to list on donate", async function () {
    const [owner, donater] = await ethers.getSigners();

    const Funding = await ethers.getContractFactory("Funding");
    const fund = await Funding.deploy(owner.address);

    await fund.deployed();

    expect(await fund.getDonators()).to.be.empty;

    const tx = await fund.connect(donater).donate({ value: 10 });

    await tx.wait();

    expect(await fund.getDonators()).not.to.be.empty;
  });

  it("Does not accept zero valued donates", async function () {
    const [owner, donater] = await ethers.getSigners();

    const Funding = await ethers.getContractFactory("Funding");
    const fund = await Funding.deploy(owner.address);

    await fund.deployed();

    await expect(fund.connect(donater).donate({ value: 0 })).to.be.revertedWith(
      "Error: Donation too low"
    );
  });

  it("Should add donater to list only once", async function () {
    const [owner, donater] = await ethers.getSigners();

    const Funding = await ethers.getContractFactory("Funding");
    const fund = await Funding.deploy(owner.address);

    await fund.deployed();

    expect(await fund.getDonators()).to.be.empty;

    let tx = await fund.connect(donater).donate({ value: 10 });
    await tx.wait();
    tx = await fund.connect(donater).donate({ value: 10 });
    await tx.wait();

    expect(await fund.getDonators()).has.length(1);
  });

  it("Owner can extract money for managment", async function () {
    const [owner, donater, recepient] = await ethers.getSigners();

    const Funding = await ethers.getContractFactory("Funding");
    const fund = await Funding.deploy(owner.address);

    await fund.deployed();

    let tx = await fund.connect(donater).donate({ value: 10 });

    await tx.wait();

    tx = await fund.connect(owner).manage(recepient.address, 10);

    await tx.wait();
  });

  it("Owner can extract more money than contract have", async function () {
    const [owner, donater, recepient] = await ethers.getSigners();

    const Funding = await ethers.getContractFactory("Funding");
    const fund = await Funding.deploy(owner.address);

    await fund.deployed();

    const tx = await fund.connect(donater).donate({ value: 10 });

    await tx.wait();

    await expect(fund.connect(owner).manage(recepient.address, 11)).to.be.revertedWith("Error: Amount too large");
  });

  it("Non owner cant extract money for managment", async function () {
    const [owner, donater, recepient] = await ethers.getSigners();

    const Funding = await ethers.getContractFactory("Funding");
    const fund = await Funding.deploy(owner.address);

    await fund.deployed();

    const tx = await fund.connect(donater).donate({ value: 10 });

    await tx.wait();

    await expect(fund.connect(donater).manage(recepient.address, 10)).to.be.revertedWith("Permission error: Not owner");
  });
});
