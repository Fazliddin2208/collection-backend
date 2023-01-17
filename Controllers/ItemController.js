const Item = require('../Models/ItemModel')
const Collection = require("../Models/CollectionModel");
const UserModel = require("../Models/UserModel")
const path = require('path');
const cloudinary = require('../utils/cloudinary')

async function createItem (req,res){
    try {
        console.log(req.body)
        const result = await cloudinary.uploader.upload(req.file.path)
        const item = new Item({
            ...req.body,
            photo: result.secure_url,
            cloudinaryId: result.public_id
        })
        const collection = await Collection.findByIdAndUpdate(req.body.collectionId, {
            $push: { items: item }
        })
        item.save((err,item) => {
            if(err){
                console.log(err)
                return res.status(400).json({errors: err.message})
            }
            return res.status(201).json({
                message: 'Collection created',
                item
            })
        })
    } catch (error) {
        res.status(400).send(error)
        console.log(error);
    }
}

async function getItems (req,res){
    try {
        const item = await Item
            .find()
            // .populate('collectionName')
            // .select('')
        res.status(200).json({item})
    } catch (error) {
        res.status(400).send(error)
    }
}

async function getItem(req,res){
    try {
        const item = await Item.findById(req.params.id)
        res.status(200).json(item)

    } catch (error) {
        console.log(error,'no')
    }
}

async function updateItem(req,res) {
    try{
        let itemId=req.params.id
        const imgRes = await cloudinary.uploader.upload(req.file.path)
        let result=await Item.findByIdAndUpdate(itemId,req.body)
        result.title = req.body.title,
        result.desc = req.body.desc,
        result.photo= imgRes.secure_url,
        result.cloudinaryId= imgRes.public_id

      
        return res.status(200).send(result);
    }catch(err){
        res.status(404).send(err)
    }
}

async function deleteItem(req,res){
    try {
        const itemId = await req.params.id;
        const deletedItem = await Item.findByIdAndDelete(itemId)
        res.status(200).json({deletedItem})
        
    } catch (error) {
        res.status(400).json({error})
    }
}


module.exports = {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
}