import { formatInfuraRpcUrl } from "./utils.js"

export const getNetworks = (infuraApiKey) => [
    { name: "Mainnet", chainId: 1, rpc: formatInfuraRpcUrl("mainnet", infuraApiKey) },
    { name: "Ropsten", chainId: 3, rpc: formatInfuraRpcUrl("ropsten", infuraApiKey) },
    { name: "Rinkeby", chainId: 4, rpc: formatInfuraRpcUrl("rinkeby", infuraApiKey) },
    { name: "Goerli", chainId: 5, rpc: formatInfuraRpcUrl("goerli", infuraApiKey) },
    { name: "Kovan", chainId: 42, rpc: formatInfuraRpcUrl("kovan", infuraApiKey) },
    { name: "Binance Smart Chain", chainId: 56, rpc: `https://bsc-dataseed.binance.org/` },
    { name: "Polygon Mainnet", chainId: 137, rpc: `https://polygon-rpc.com/` },
    { name: "Mumbai Testnet", chainId: 80001, rpc: `https://rpc-mumbai.matic.today` },
]

export const WALLET_CONNECTORS = [
    { name: "InjectedConnector", npmjs: "@web3-react/injected-connector", displayName: "Metamask" },
    { name: "WalletConnectConnector", npmjs: "@web3-react/walletconnect-connector", displayName: "WalletConnect" },
    { name: "WalletLinkConnector", npmjs: "@web3-react/walletlink-connector", displayName: "WalletLink" },
    { name: "FortmaticConnector", npmjs: "@web3-react/fortmatic-connector", displayName: "Fortmatic" },
    { name: "PortisConnector", npmjs: "@web3-react/portis-connector", displayName: "Portis" },
    { name: "TorusConnector", npmjs: "@web3-react/torus-connector", displayName: "Torus" },
    { name: "FrameConnector", npmjs: "@web3-react/frame-connector", displayName: "Frame" },
    { name: "AuthereumConnector", npmjs: "@web3-react/authereum-connector", displayName: "Authereum" },
]

// module.exports = { getNetworks, WALLET_CONNECTORS }