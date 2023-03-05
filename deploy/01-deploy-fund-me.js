// async function deployFunc(hre) {
//     console.log("Hi!!");
// }
// module.exports.default = deployFunc;
// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre;
// };
const { network } = require("hardhat");
require("dotenv").config();
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat.config");
const { verify } = require("../utils/verify");
//below both line adds up to be equivalent to the above line
// const { helperConfig } = require("../helper-hardhat.config");
// const networkConfig = helperConfig.networkConfig;
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    // console.log(chainId);
    //to interect with multiple addresses we use https://github.com/aave/aave-v3-core
    let ethUsdPriceFeedAddress;
    //if the contract doesn't exist, we deploy a minimal versionof it for our local
    //testing
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
        // console.log(ethUsdPriceFeedAddress);
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    log("----------------------------------------------------");
    log("Deploying FundMe and waiting for confirmations...");
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`FundMe deployed at ${fundMe.address}`);
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }
    log("----------------------------------");
};
//yarn hardhat deploy
module.exports.tags = ["all", "fundme"];
