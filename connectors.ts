
import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { PortisConnector } from "@web3-react/portis-connector"

export const RPC_URLS: { [chainId: number]: string } = {
    1: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}` as string,
    42: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}` as string,
    3: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}` as string,
    4: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}` as string,
    5: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}` as string,
    137: `https://polygon-rpc.com/`,
    80001: `https://rpc-mumbai.matic.today`,
    56: `https://bsc-dataseed.binance.org/`,
};

const connectors = [
    {
        connector: new InjectedConnector({
            supportedChainIds: [1, 3, 4, 5, 42, 56, 137, 80001],
        }),
        name: "Metamask",
    },
    {
        connector: new WalletConnectConnector({
            rpc: RPC_URLS,
            qrcode: true,
        }),
        name: "WalletConnect",
    },
    
    
    {
        connector: new PortisConnector({
            dAppId: process.env.PORTIS_API_KEY as string,
            networks: [1, 3, 4, 5, 42, 137, 80001],
        }),
        name: "Portis",
    },
    
    
    
];
export default connectors;