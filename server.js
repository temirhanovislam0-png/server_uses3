import express  from "express"
import mongoose from "mongoose"
import router from "./routes/UserRoutes.js";
import cors from "cors";

import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)



const PORT = 5000;
const app = express()
app.use(express.json())
app.use(fileUpload({}))
app.use('/uploads' , express.static(path.resolve(__dirname,"uploads")))
app.use(cors()); // ОБЯЗАТЕЛЬНО до app.use(router)
app.use(router)


mongoose.connect("mongodb://localhost:27017/usersbd").then(()=>{
    console.log("Успешное подключение к БД");
    
}).catch((err)=>{
    console.log("Ошибка при подключении к БД: " + err );
    process.exit(1)
})

app.listen(PORT , ()=>{
    console.log("Успешное подключение сервера: " + PORT);
    
})
