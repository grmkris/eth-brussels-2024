import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VaultModule = buildModule("Vault", m => {
  const vault = m.contract("Vault");

  console.log("Vault", vault);
  return { vault };
});

export default VaultModule;
