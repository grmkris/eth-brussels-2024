import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * IUniversalRouter _uniswap,
 *     IPermit2 _permit2,
 *     address _initialOperator,
 *     address _initialFeeDestination,
 *     IWrappedNativeCurrency _wrappedNativeCurrency
 */
const TransfersModule = buildModule("TransfersModule", (m) => {
  const uniswapUniversalRouter = m.getParameter("uniswapUniversalRouter", "0x");
  const permit2Address = m.getParameter("permit2Address", "0x");
  const initialOperator = m.getParameter("initialOperator", "0x");
  const initialFeeDestination = m.getParameter("initialFeeDestination", "0x");
  const wrappedNativeCurrency = m.getParameter("wrappedNativeCurrency", "0x");

  console.log("uniswapUniversalRouter", {
    uniswapUniversalRouter,
    permit2Address,
    initialOperator,
    initialFeeDestination,
    wrappedNativeCurrency,
  });

  const transfers = m.contract("Transfers", [
    uniswapUniversalRouter,
    permit2Address,
    initialOperator,
    initialFeeDestination,
    wrappedNativeCurrency,
  ]);

  return { transfers };
});

export default TransfersModule;
