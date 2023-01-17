const Collection = require("../Models/CollectionModel");
const Item = require("../Models/ItemModel");
const UserModel = require("../Models/UserModel")
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const path = require("path");


async function getCollections(req,res){
    try {
        const collections=await Collection.find({}).populate("items")
        return res.status(200).send(collections)
    } catch (error) {
        res.status(400).send(error)
    }
}

async function createCollection(req,res){
    try {
        const userId = req.user._id;
        const result = await cloudinary.uploader.upload(req.file.path)
        const collection = new Collection({
            ...req.body,
            photo: result.secure_url,
            cloudinaryId: result.public_id
        })
        const user = await UserModel.findByIdAndUpdate(userId, {
            $push: { collections: collection }
        })
        console.log(collection)
        
        collection.save((err,collection) => {
            if(err){
                return res.status(400).json({errors: err.message})
            }
            return res.status(200).json({
                message: 'Collection created',
                collection
            })
        })
    } catch (error) {
        res.status(400).send(error)
        console.log('nimadir neto', error)
    }
}

async function updateCollection(req,res) {
    try{
        let colId=req.params.id
        const imgRes = await cloudinary.uploader.upload(req.file.path)
        let result=await Collection.findByIdAndUpdate(colId,req.body)
        result.title = req.body.title;
        result.tegs = req.body.tegs;
        result.photo= imgRes.secure_url,
        result.cloudinaryId= imgRes.public_id
        console.log(res,'ishladiiii')
        return res.status(200).send(result);
    }catch(err){
        res.status(404).send(err)
        console.log('xato', err)
    }
}

async function deleteCollection(req,res){
    try {
        // console.log('ishlayabdi')
        const colId = await req.params.id;
        const deletedCol = await Collection.findByIdAndDelete(colId)
        res.status(200).json({colId})
        
    } catch (error) {
        // console.log('bir nima')
        res.status(400).json({error})
    }
}

async function getLargestCollections(req,res){
    try {
        const collections=await Collection.find({})
            .sort({items:-1})
            .limit(5)
            .populate("items")
        return res.status(200).send(collections)
    } catch (error) {
        res.status(400).json({error})
    }
}

async function getCollection(req,res){
    try {
        const collection = await Collection.findById(req.params.id).populate("items")
        // console.log('ishladi')
        res.status(200).json(collection)

    } catch (error) {
        console.log(error,'bomadi')
    }
}



module.exports = {
    createCollection,
    getCollections,
    deleteCollection,
    updateCollection,
    getLargestCollections,
    getCollection,
}