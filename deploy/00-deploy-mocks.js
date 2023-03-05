//only need to deploy when working on local host or hardhat
const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INTIAL_ANSWER,
} = require("../helper-hardhat.config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INTIAL_ANSWER],
        });
        log("Mock deployed!");
        log("-----------------------------------------------");
        log(
            "You are deploying to a local network, you'll need a local network running to interact"
        );
        log(
            "Please run `npx hardhat console` to interact with the deployed smart contracts!"
        );
        log("------------------------------------------------");
    }
};
//to run only this script
module.exports.tags = ["all", "mocks"];
//yarn hardhat deploy --tags mocks
