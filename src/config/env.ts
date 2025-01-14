import "dotenv/config";

const dbURI = process.env.MONGO_URI;
const appPort = process.env.PORT;

export { dbURI, appPort };