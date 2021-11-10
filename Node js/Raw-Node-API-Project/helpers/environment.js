// dependencies
// module scaffolding
const environments = {};

// environment gula define korchi
environments.staging = {
    port: 313,
    envName: "staging",
    secretKey: "MohammadSecretKey",
    maxChecks: 5,
    twilio: {
        fromPhone: "+12164461366",
        accountSid: "ACbdcbf4ace8956ce085e68e47931e054a",
        authToken: "b9c5dd11f98f16035112610f6ad737b6",
    },
}; // ei environments er moddhe staging nam e ekta environment ase .. local environment

environments.production = {
    port: 31313,
    envName: "production",
    secretKey: "MohammadSecretKey",
    maxChecks: 5,
    twilio: {
        fromPhone: "+12164461366",
        accountSid: "ACbdcbf4ace8956ce085e68e47931e054a",
        authToken: "b9c5dd11f98f16035112610f6ad737b6",
    },
}; // ei environments er moddhe staging nam e ekta environment ase .. server environment
// ei secretKey ta utilities e use korar jonno shekhane import kore nite hobe

// ekhon amake determine korte hobe kon environment ta command line theke pass hoyeche
// determine which environment was passed

const currentEnvironment =
    typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
    typeof environments[currentEnvironment] === "object"
        ? environments[currentEnvironment]
        : environment.staging;

//Export module
module.exports = environmentToExport;
