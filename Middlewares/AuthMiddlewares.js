const UserModel = require('../Models/UserModel');
const jwt = require('jsonwebtoken');

module.exports.checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'@mysecretkey@',async (err, decodedToken) => {
            if(err){
                res.json({status:false});
                // next();
            } else{
                const user = await UserModel.findById(decodedToken.id);
                if(user) {
                    // res.status(200).json({user});
                    req.user = user
                    next();
                }
                else {
                    res.json({status:false})
                }
                // next();
            }
        })
    } else{
        res.json({status:false,});
        // next();
    }
}


module.exports.checkAdmin = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'@mysecretkey@',async (err, decodedToken) => {
            const user = await UserModel.findById(decodedToken.id);
            if(user.isAdmin){
                // res.status(200).json({msg:'All changes saved'})
                next()
            }
            else{
                res.status(403).json({msg:'Acces denied'})
            }
        })
    } else{
        res.status(404).json({msg:'User is not found'});
    }
}

module.exports.user = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, '@mysecretkey@', async (err, decodedToken) => {
            const user = await UserModel.findById(decodedToken.id);
            if(user || user.isAdmin){
                req.user = user
                next()
            }else res.status(404).json({msg:'User is not fount'})
        })
    } else{
        res.status(404).json({msg:'User is not found'});
    }
}