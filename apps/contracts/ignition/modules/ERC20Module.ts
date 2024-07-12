import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * IUniversalRouter _uniswap,
 *     IPermit2 _permit2,
 *     address _initialOperator,
 *     address _initialFeeDestination,
 *     IWrappedNativeCurrency _wrappedNativeCurrency
 */
const ERC20Module = buildModule("ERC20Module", (m) => {

  const erc20 = m.contract("MyToken");

  console.log("erc20", erc20);
  return { erc20 };
});

export default ERC20Module;
