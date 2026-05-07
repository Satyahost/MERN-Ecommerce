import dotenv from "dotenv";
if (process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({ path: "backend/config/config.env" })}
  

import express from "express";
import product from "./routes/productRoutes.js";
import errorHandleMiddleware from "./middleware/error.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import payment from "./routes/paymentRoutes.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from 'path';
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename)
const app = express();

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

//server static files
app.use(express.static(path.join(__dirname,'../frontend/dist')));
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});
app.use(errorHandleMiddleware);

export default app;
