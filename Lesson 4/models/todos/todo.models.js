import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // model er j nam dsi
    },
    subTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubTodo"
        }
    ] // Array of sub-Todos
}, {timestamps:true});

export const Todo = mongoose.model("Todo",todoSchema); // first one is name and second one is basis
//after storing the model name will be todos