import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());

connectDB();

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

