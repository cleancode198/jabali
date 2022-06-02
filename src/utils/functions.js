import { networks, networkTypes } from "./constants";

export const ddd = (num) => {
  if (num >= 100) return "" + num;
  if (num >= 10) return "0" + num;
  return "00" + num;
};

export const getNetworkType = (network) => {
  if (
    network === networks.ethMainnet ||
    network === networks.kovan ||
    network === networks.ropsten ||
    network === networks.rinkeby ||
    network === networks.goerli
  )
    return networkTypes.ethereum;
  if (network === networks.bscMainnet || network === networks.bscTestnet)
    return networkTypes.bsc;
  return networkTypes.noneSelected;
};
