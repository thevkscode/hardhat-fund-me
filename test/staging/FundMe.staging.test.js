// const { ethers } = require("ethers");
const { getNamedAccounts, network, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat.config");
const { assert, expect } = require("chai");
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe;
          let deployer;
          //no n eed of mock as we are assuming that we are working on testnet
          const sendValue = ethers.utils.parseEther("1");
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
          });
          it("allows people to fund and withdraw", async () => {
              await fundMe.fund({ value: sendValue });
              await fundMe.withdraw();
              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              assert.equal(endingFundMeBalance.toString(), "0");
          });
      });
