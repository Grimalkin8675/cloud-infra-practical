interface IConfig {
    apiUrl: string;
    dbName: string;
    apiUsername: string;
    apiPassword: string;
}


const config: IConfig = {
    apiUrl: "localhost:63422",
    dbName: "pau",
    apiUsername: "admin",
    apiPassword: "changeit",
};


export default config;
