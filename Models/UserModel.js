const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    isActive:{
        type: Boolean,
        default: true
    },
    regTime:{
        type: Date,
        default: Date.now
    },
    loginTime:{
        type: Date,
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    collections:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
        }
    ]
},{
    versionKey: false
})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    if(this.password.length<32){
        this.password = await bcrypt.hash(this.password, salt);
    }
    this.loginTime = await Date()
    next();
})

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error("Incorrect password")
    }
    throw Error("Incorrect email")
    
}


module.exports = mongoose.model('User',userSchema)