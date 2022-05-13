#!/usr/bin/env node

import enquirer from 'enquirer';
const { MultiSelect, Input, Select } = enquirer
import { WALLET_CONNECTORS, getNetworks } from './consts.js';
import { parseEnvStr } from './utils.js'
import fs from 'fs'

const main = async() => {

        const infuraKeyPrompt = new Input({
            message: "Infura API Key : ",
            initial: "process.env.INFURA_API_KEY"
        })

        const infuraApiKeyResponse = await infuraKeyPrompt.run()

        const NETWORKS = getNetworks(infuraApiKeyResponse)

        const networksPrompt = new MultiSelect({
            name: 'networks',
            message: 'Choose your preferred networks: ',
            choices: NETWORKS.map(n => ({ name: n.name, value: n.chainId }))
        });
        const networkResponse = await networksPrompt.run()
        const CHOSEN_NETWORKS = NETWORKS.filter(n => networkResponse.includes(n.name))
            // console.log("Cho N", CHOSEN_NETWORKS);

        const connectorsPrompt = new MultiSelect({
            name: "connectors",
            message: "Choose the wallets you want to connect : ",
            choices: WALLET_CONNECTORS.map(w => w.displayName)
        })
        const CHOSEN_CONNECTORS = await connectorsPrompt.run()

        // console.log("Connectors : ", CHOSEN_CONNECTORS);

        let PORTIS_API_KEY;
        let FORTMATIC_API_KEY;
        let WALLETLINK_APP_NAME;
        let FORTMATIC_CHAINID;
        let TORUS_CHAINID;
        let FRAME_CHAINID;
        let AUTHEREUM_CHAINID;



        if (CHOSEN_CONNECTORS.includes("Portis")) {
            const portisKeyPrompt = new Input({
                message: "Portis API Key : ",
                initial: "process.env.PORTIS_API_KEY"
            })
            PORTIS_API_KEY = await portisKeyPrompt.run()
        }
        if (CHOSEN_CONNECTORS.includes("Fortmatic")) {
            const fortmaticKeyPrompt = new Input({
                message: "Fortmatic API Key : ",
                initial: "process.env.FORTMATIC_API_KEY"
            })
            FORTMATIC_API_KEY = await fortmaticKeyPrompt.run()
            const fortmaticChainIdPrompt = new Select({
                message: "Select network for Fortmatic Wallet",
                choices: NETWORKS.map(n => n.name)
            })
            const formaticNetworkName = await fortmaticChainIdPrompt.run()
            FORTMATIC_CHAINID = NETWORKS.find(n => n.name == formaticNetworkName).chainId
        }
        if (CHOSEN_CONNECTORS.includes("WalletLink")) {
            const walletLinkAppNamePrompt = new Input({
                message: "WalletLink App Name : ",
                initial: "DeepchainLabs Wallet"
            })
            WALLETLINK_APP_NAME = await walletLinkAppNamePrompt.run()
        }
        if (CHOSEN_CONNECTORS.includes("Torus")) {
            const torusChainIdPrompt = new Select({
                message: "Select network for Torus Wallet",
                choices: NETWORKS.map(n => n.name)
            })
            const torusNetworkName = await torusChainIdPrompt.run()
            TORUS_CHAINID = NETWORKS.find(n => n.name == torusNetworkName).chainId
        }
        if (CHOSEN_CONNECTORS.includes("Frame")) {
            const frameChainIdPrompt = new Select({
                message: "Select network for Frame Wallet",
                choices: NETWORKS.map(n => n.name)
            })
            const frameNetworkName = await frameChainIdPrompt.run()
            FRAME_CHAINID = NETWORKS.find(n => n.name == frameNetworkName).chainId
        }
        if (CHOSEN_CONNECTORS.includes("Authereum")) {
            const authereumChainIdPrompt = new Select({
                message: "Select network for Authereum Wallet",
                choices: NETWORKS.map(n => n.name)
            })
            const authereumNetworkName = await authereumChainIdPrompt.run()
            AUTHEREUM_CHAINID = NETWORKS.find(n => n.name == authereumNetworkName).chainId
        }


        // console.log("portispaikey", PORTIS_API_KEY);
        // console.log("fortmaticpaikey", FORTMATIC_API_KEY);
        // console.log("walletlinkappname", WALLETLINK_APP_NAME);
        // console.log("fortmaticchainid", FORTMATIC_CHAINID);
        // console.log("toruschainid", TORUS_CHAINID);
        // console.log("framechainid", FRAME_CHAINID);
        // console.log("authereumchainid", AUTHEREUM_CHAINID);

        const fileLocationPrompt = new Input({
            message: "Enter location to generate file : ",
            initial: "./connectors.ts"
        })
        const fileLocation = await fileLocationPrompt.run()

        const content = `
${WALLET_CONNECTORS.filter(wc=>CHOSEN_CONNECTORS.includes(wc.displayName)).map(wc=>`import { ${wc.name} } from "${wc.npmjs}"`).join('\n')}

export const RPC_URLS: { [chainId: number]: string } = {
    1: \`https://mainnet.infura.io/v3/${parseEnvStr(infuraApiKeyResponse,true)}\` as string,
    42: \`https://kovan.infura.io/v3/${parseEnvStr(infuraApiKeyResponse,true)}\` as string,
    3: \`https://ropsten.infura.io/v3/${parseEnvStr(infuraApiKeyResponse,true)}\` as string,
    4: \`https://rinkeby.infura.io/v3/${parseEnvStr(infuraApiKeyResponse,true)}\` as string,
    5: \`https://goerli.infura.io/v3/${parseEnvStr(infuraApiKeyResponse,true)}\` as string,
    137: \`https://polygon-rpc.com/\`,
    80001: \`https://rpc-mumbai.matic.today\`,
    56: \`https://bsc-dataseed.binance.org/\`,
};

const connectors = [
    ${CHOSEN_CONNECTORS.includes("Metamask")?`{
        connector: new InjectedConnector({
            supportedChainIds: [${CHOSEN_NETWORKS.map(n=>n.chainId).join(', ')}],
        }),
        name: "Metamask",
    },`:""}
    ${CHOSEN_CONNECTORS.includes("WalletConnect")?`{
        connector: new WalletConnectConnector({
            rpc: RPC_URLS,
            qrcode: true,
        }),
        name: "WalletConnect",
    },`:""}
    ${CHOSEN_CONNECTORS.includes("WalletLink")?`{
        connector: new WalletLinkConnector({
            url: RPC_URLS[1],
            appName: ${parseEnvStr(WALLETLINK_APP_NAME)},
            supportedChainIds: [${CHOSEN_NETWORKS.map(n=>n.chainId).join(', ')}],
        }),
        name: "WalletLink",
    },`:""}
    ${CHOSEN_CONNECTORS.includes("Fortmatic")?`{
        connector: new FortmaticConnector({
            apiKey: ${parseEnvStr(FORTMATIC_API_KEY)} as string,
            chainId: ${FORTMATIC_CHAINID},
        }),
        name: "Fortmatic",
    },`:""}
    ${CHOSEN_CONNECTORS.includes("Portis")?`{
        connector: new PortisConnector({
            dAppId: ${parseEnvStr(PORTIS_API_KEY)} as string,
            networks: [${CHOSEN_NETWORKS.map(n=>n.chainId).filter((c)=>c!=56).join(', ')}],
        }),
        name: "Portis",
    },`:""}
    ${CHOSEN_CONNECTORS.includes("Torus")?`{
        connector: new TorusConnector({ chainId: ${TORUS_CHAINID} }),
        name: "Torus",
    },`:""}
    ${CHOSEN_CONNECTORS.includes("Frame")?`{
        connector: new FrameConnector({ supportedChainIds: [${FRAME_CHAINID}] }),
        name: "Frame",
    },`:""}
    ${CHOSEN_CONNECTORS.includes("Authereum")?`{
        connector: new AuthereumConnector({ chainId: ${AUTHEREUM_CHAINID} }),
        name: "Authereum",
    },`:""}
];
export default connectors;`

    const packManPrompt = new Select({
        message:"Select your preferred Package Manager : ",
        choices:["Yarn","NPM"]
    })

    const chosenPackman = await packManPrompt.run()

    const npmJsPackages = WALLET_CONNECTORS.filter(w=>CHOSEN_CONNECTORS.includes(w.displayName)).map(c=>c.npmjs)

    console.log("\nRun the following command on your NodeJS application to add the connectors : \n\n");

    console.log(`${chosenPackman=="Yarn"?"yarn add":"npm install"} ${npmJsPackages.join(" ")}\n\n`)

    fs.writeFileSync(fileLocation, content)

}

main()
    .then(() => console.log("DCL WALLET CONNECTORS!!"))
    .catch((e) => console.log("Err : ", e))