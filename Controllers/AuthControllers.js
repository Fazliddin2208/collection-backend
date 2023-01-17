const UserModel = require("../Models/UserModel");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const maxAge = 3*24*60*60;

const createToken = (id,isAdmin) => {
    return jwt.sign({ id, isAdmin }, "@mysecretkey@", {
        expiresIn: maxAge,
    });
};

const handleErrors = (err) => {
    let errors = {email:"",password:"",isActive:""};

    if(err.message === 'Incorrect email'){
        errors.email = 'That email is not registered'
    }

    if(err.message === 'Incorrect password'){
        errors.password = 'That password is incorrect'
    }

    if(err.code === 11000){
        errors.email = "Email is already registered";
        return errors
    }

    if(err.message.includes("Users validation failed")){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        })
    }
    return errors
}

async function register(req,res){
    try {
        const {name,email,password,isActive} = req.body;
        const user = await UserModel.create({name,email,password,isActive})
        const token = createToken(user._id);

        res.cookie('jwt',token,{
            withCredentials:true,
            httpOnly: false,
            maxAge: maxAge*1000,
        });
        res.status(201).json({user:user._id, created:true})
        console.log(user)
    } catch (error) {
        const errors = handleErrors(error);
        res.json({errors,created:false})
    }
};

async function login(req,res){ 
    try {
        const {email,password, isActive} = req.body;
        const user = await UserModel.login(email,password, isActive)
        await user.save()
        if (user.isActive){
            const token = createToken(user._id);
            return res.status(200).cookie('jwt',token,{
                withCredentials:true,
                httpOnly: false,
                maxAge: maxAge*1000,
                user: user._id, 
                status: true
            }).json({data: user});
        } 
      res.status(401).json({data:[], msg: "Blocked"})        
    } catch (error) {
        const errors = handleErrors(error);
        res.json({errors,created:false})
    }
}


async function getUsers(req,res){
    try{
        const users=await UserModel.find({})
        return res.status(200).send(users)
    }catch(err){
        res.status(400).send(err)
    }
}

async function deleteUser(req,res){
    try {
            const userId = await req.params.id;
            const deletedUser = await UserModel.findByIdAndDelete(userId)
            if(!deletedUser){
                res.status(404).json({msg:'User not found'})
            }
    } catch (error) {
        console.log(error)
    }
}

async function updateStatus(req,res){
    try {
        const userId = await req.params.id;
        const statusUpdate = await UserModel.findById(userId)
        if(statusUpdate){
            let updated = true;
            if(statusUpdate.isActive){
                updated = false;
            }
            await UserModel.findByIdAndUpdate(statusUpdate._id, {isActive:updated})

            return res.status(200).json({msg:'updated'})
        }
        return res.status(404).json({msg:'User not found'})
        
    } catch (error) {
        res.status(400).json(error)
    }
}

async function updateAdmin(req,res){
    try {
        const userId = await req.params.id;
        const adminUpdate = await UserModel.findById(userId)
        if(adminUpdate){
            let updated = true;
            if(adminUpdate.isAdmin){
                updated = false;
            }
            await UserModel.findByIdAndUpdate(adminUpdate._id, {isAdmin:updated})

            return res.status(200).json({msg:'updated'})
        }
        return res.status(404).json({msg:'User not found'})
        
    } catch (error) {
        res.status(400).json(error)
    }
}

async function getProfile(req,res){
    try {
        const user = await UserModel.findById(req.user._id)
            .select("-password")
            .populate("collections")
        res.status(200).json(user)
        console.log(user)
    } catch (error) {
        console.log(error)
        res.send(404).json(error)
    }
}

module.exports = {
    register,
    login,
    getUsers,
    updateStatus,
    updateAdmin,
    deleteUser,
    getProfile
}