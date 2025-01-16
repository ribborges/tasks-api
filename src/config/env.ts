import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI;
const appPort = process.env.PORT;
const secret = process.env.SECRET ?? '';

export { dbURI, appPort, secret };