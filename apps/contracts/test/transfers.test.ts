import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import hre from "hardhat";

import { expect } from "chai";
import TransfersModule from "../ignition/modules/TransfersModule";
import { mnemonicToAccount } from "viem/accounts";
import { ENV } from "../env";

const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
const UNISWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
const WRAPPED_NATIVE_CURRENCY_ADDRESS =
  "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

const FEE_DESTINATION = mnemonicToAccount(ENV.FEE_MNEMONIC).address;
const OPERATOR = mnemonicToAccount(ENV.OPERATOR_MNEMONIC).address;

describe("Transfers", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTransfersFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();
    const { transfers } = await hre.ignition.deploy(TransfersModule, {
      parameters: {
        TransfersModule: {
          uniswapUniversalRouter: UNISWAP_ROUTER_ADDRESS,
          permit2Address: PERMIT2_ADDRESS,
          initialOperator: OPERATOR,
          initialFeeDestination: FEE_DESTINATION,
          wrappedNativeCurrency: WRAPPED_NATIVE_CURRENCY_ADDRESS,
        },
      },
    });

    console.log("Deployed TransfersModule at", transfers.address);

    return { owner, otherAccount, transfers };
  }

  describe("Deployment", function () {
    it("Correctly deploy", async function () {
      const { transfers, owner, otherAccount } = await loadFixture(
        deployTransfersFixture,
      );

      expect((await transfers.read.owner()).toLowerCase()).to.equal(
        owner.account.address.toLowerCase(),
      );
    });

    it("Should register operator", async function () {
      const { transfers, owner, otherAccount } = await loadFixture(
        deployTransfersFixture,
      );

      const tx = await transfers.write.registerOperatorWithFeeDestination([
        owner.account.address,
      ]);
      console.log("registerOperatorWithFeeDestination tx", tx);
    });
  });
});
