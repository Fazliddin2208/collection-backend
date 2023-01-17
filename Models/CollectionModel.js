const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true
    },
    topic:{
        type: String,
        required: true
    },
    tegs:{
        type: [String],
        required: true
    },
    photo:{
        type:String,
        required: true
    },
    cloudinaryId:{
        type: String
    },
    items:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    likeCount:{
        type: Number,
        default: 0
    },
    createdBy:{
        type: String
    }
},{
    timestamps: true
})


module.exports = mongoose.model('Collection',collectionSchema)