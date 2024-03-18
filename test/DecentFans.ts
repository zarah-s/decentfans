import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {


    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy();
    const DecentFans = await hre.ethers.getContractFactory("DecentFans");
    const decentFans = await DecentFans.deploy(token.target);
    return { decentFans, owner, otherAccount, token };
  }

  describe("Stake", function () {
    it("Should revert if contentId does not exist", async function () {
      const { decentFans, } = await loadFixture(deployOneYearLockFixture);
      await expect(decentFans.stake(1)).to.be.revertedWithCustomError(decentFans, "CONTENT_NOT_FOUND");
    });


    it("Should stake to content", async function () {
      const { decentFans, owner, token } = await loadFixture(deployOneYearLockFixture);
      await decentFans.createContent("Title", "description", hre.ethers.parseUnits("5", 18), 0);
      await token.approve(decentFans.target, hre.ethers.parseUnits("5", 18))
      await decentFans.stake(0);
      const subscribers = (await decentFans.getContentSubscriptions(0)).subscribers[0]
      expect(subscribers).to.be.equal(owner.address)
    });


    it("Should create new content", async function () {
      const { decentFans, } = await loadFixture(deployOneYearLockFixture);
      await decentFans.createContent("Title", "description", hre.ethers.parseUnits("5", 18), 0);

      const contentId = await decentFans.contentCount();
      expect((await decentFans.getContentById(Number(contentId.toString()) - 1)).valid).to.be.equal(true)

    });

  });


});
