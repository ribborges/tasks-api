import express from "express";
import cors from "cors";

// Set up the express app
const app = express();
const port = 3000;
const allowedOrigins = ["http://localhost:5173"];
const options: cors.CorsOptions = {
    origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});