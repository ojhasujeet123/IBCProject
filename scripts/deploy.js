const hre = require("hardhat");

async function main() {
  
  try {
    await hre.run('compile');

    console.log("Network name:", hre.network.name);
    // console.log("Network config:", JSON.stringify(hre.config.networks[hre.network.name], null, 2));

    // console.log("Network config:", JSON.stringify(hre.config.networks[hre.network.name], (key, value) => {
    //   if (typeof value === 'bigint') {
    //     return value.toString();
    //   } else {
    //     return value;
    //   }
    // }, 2));

    console.log("Getting signers...");
    const signers = await hre.ethers.getSigners();
    console.log(`Number of signers: ${signers.length}`);

    if (signers.length === 0) {
      throw new Error("No signers available. Check your network configuration.");
    }

    const [deployer] = signers;

    if (!deployer || !deployer.address) {
      throw new Error("Deployer account not properly initialized.");
    }

    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance));

    const MyContract = await hre.ethers.getContractFactory("PKB");
    console.log("Deploying Roksa...");
    const myContract = await MyContract.deploy("TEST","TST",18,100000,"0x87daB07Ec49e2eBdC126747FfA39488411b0d620");
    
    console.log("Deployment transaction hash:", myContract.deploymentTransaction().hash);
    
    console.log("Waiting for deployment to be mined...");
    await myContract.waitForDeployment();

    const deployedAddress = await myContract.getAddress();
    console.log("Contract deployed to:", deployedAddress);

  } catch (error) {
    console.error("Error in deployment process:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });