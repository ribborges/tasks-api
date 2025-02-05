import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI;
const appPort = process.env.PORT;
const secret = process.env.SECRET ?? '';
const clientURL = process.env.CLIENT_URL?.split(',') ?? [];

export { dbURI, appPort, secret, clientURL };