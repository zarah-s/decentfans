import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DecentFansModule = buildModule("DecentFansModule", (m) => {

  const contract = m.contract("DecentFans", ["0x42AcD393442A1021f01C796A23901F3852e89Ff3"]);
  return { contract };
});

export default DecentFansModule;
