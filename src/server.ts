import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import router from "./Router";

const app = express();
app.use(express.json());
dotenv.config()

const corsOption = {
  origin: "*",
  methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
  preflightContinue: false,
  optionSuccessStatus: 204,
};

app.use(cors(corsOption));

app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running in port: ${process.env.PORT}`);
});
