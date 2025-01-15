import { MongoClient, ServerApiVersion } from "mongodb";

import { dbURI } from "@/config/env";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(dbURI!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export default client;