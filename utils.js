 export const formatInfuraRpcUrl = (networkName, apiKey) => `\`https://${networkName}.infura.io/v3/\${${apiKey}}\` as string`

 export const isEnvStr = (str) => str.includes("process.env.")

 export const parseEnvStr2 = (str, isSubStr = false) => isEnvStr(str) ? `\${${str}}` : isSubStr ? `"${str}"` : str

 export const parseEnvStr = (str, isSubStr = false) => {
     if (isEnvStr(str)) {
         if (isSubStr) return `\${${str}}`
         return str;
     } else {
         return `"${str}"`
     }
 }

 //  export default { formatInfuraRpcUrl, isEnvStr, parseEnvStr }