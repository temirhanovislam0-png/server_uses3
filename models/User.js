import mongoose from "mongoose";
import { type } from "os";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Имя обязательно для заполнения"],
        trim: true
    },

    lastName: {
        type: String,
        required: [true , "Фамилия обязательно для заполнения"],
        trim: true
    },
    age: {
        type: Number,
        required: [true ,  "Возраст обязательно для заполнения"],
        min: 12
    }, 
    avatar: {
        type: String
    },
    email: {
        type: String,
        required: [true ,  "Почта обязательна для заполнения!"],
        unique: true
    },
    password: {
        type: String, 
        required: [true ,  "Пароль обязателен"],
        minLength: [6 , "Пароль должен быть не меньше 6 символов"]
    }
   
})
export default mongoose.model("User" , userSchema)