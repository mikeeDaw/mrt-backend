import mongoose from "mongoose";

const Schema = mongoose.Schema

const adminSchema = new Schema({
    username: {type: String, require: true, unique: true},
    email : { type: String, require: true, unique: true},
    authentication : {
        password: { type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: { type: String, select: false }
    }

}, { timestamps: true})

const adminModel = mongoose.model('Admin', adminSchema,"Admin");

const getUsers = () => adminModel.find();
const getUserByEmail = (email: String) => adminModel.findOne({email});
const getUserByUsername = (username: String) => adminModel.findOne({username});
const getUserBySessionToken = (sesToken: String) => adminModel.findOne({'authentication.sessionToken': sesToken})
const getUserById = (id: String) => adminModel.findById(id);
const createUser = (values: Record<string, any>) => new adminModel(values).save().then((user)=> user.toObject());
const deleteUserById = (id: String) => adminModel.findOneAndDelete({ _id : id });
const updateUserById = (id: String, values: Record<string, any>) => adminModel.findByIdAndUpdate(id,values); 

export{ adminModel,getUsers,getUserByUsername,getUserByEmail,getUserBySessionToken,getUserById,createUser,deleteUserById,updateUserById }