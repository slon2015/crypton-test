import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const Finding = await ethers.getContractFactory("Funding");
  const fund = await Finding.deploy(owner.address);

  await fund.deployed();

  console.log("Funding deployed to:", fund.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
