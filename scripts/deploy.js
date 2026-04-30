const hre = require("hardhat");

async function main() {
  console.log("Deploying PollVoting contract...");

  const PollVoting = await hre.ethers.getContractFactory("PollVoting");
  const pollVoting = await PollVoting.deploy();

  await pollVoting.waitForDeployment();

  const address = await pollVoting.getAddress();

  console.log("PollVoting deployed to:", address);
  console.log("Copy this address into your .env.local as CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});