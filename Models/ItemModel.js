const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc:{
        type: String
    },
    tegs:{
        type: [String],
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    cloudinaryId:{
        type: String
    },
    exInf:{
        type: Object
    },
    comments:[
        {
            name: String,
            text: String,
            date: {type: Date, default: Date.now}
        }
    ],
    // comments:[
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Comment'
    //     }
    // ],
    time:{
        type: Date,
        default: Date.now
    },
    likeCount:{
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Item',itemSchema)