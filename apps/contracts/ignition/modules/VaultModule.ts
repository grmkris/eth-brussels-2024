import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VaultModule = buildModule("VaultModule", m => {
  const tokenAddress = m.getParameter("token", "0x");

  const vault = m.contract("Vault", [
    tokenAddress
  ]);

  console.log("Vault", vault);
  return { vault };
});

export default VaultModule;
