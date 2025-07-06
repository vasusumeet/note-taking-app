import mongoose from "mongoose";

const notesSchema=new mongoose.Schema({
    noteId: 
    {
        type: String,
        required: true,
    },
    note: {
        type: String,
        requried:true,
    },
    dateCreated: {
        type: String,
        required: true,
    }
});
const userDataSchema=new mongoose.schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    notes:[notesSchema],
});

export const UserData=mongoose.model('UserData', userDataSchema);

