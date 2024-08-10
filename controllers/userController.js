const {UserModule} = require("../model/userModel")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async(req,res) =>{
    const {name , email , password , role} = req.body;
    try {
        const existingUser = await UserModule.findOne({email});
        if(existingUser){
            return res.status(400).send({msg: `User is already registered `})
        }
        bcrypt.hash(password,8,async(err,hash)=>{
            if(err){
                return res.status(500).json({ error: err.message });
            }
            else{
                const user = new UserModule({name,email,password:hash, role})
                await user.save();

                res.status(201).send({msg:`User Registerd successfully!`})
            }
        })
    } catch (error) {
        console.log(`error,${error}`)
        res.status(500).json({message : error.message})
    }
}

//login

const loginUser = async(req,res)=>{
    const {email , password} = req.body;
    try {
        const user = await UserModule.findOne({email});
        bcrypt.compare(password,user.password ,(err,result)=>{
            if(result){
                const token = jwt.sign({
                    id:user._id , authors : user.name
                },"masai");
             res.send({msg:"Login successful", token: token})
            }
            else{
                res.send({msg: err})
            }
            
        })
    } catch (error) {
        console.log(`error ${error}`)
        res.status(500).json({"error":error.message})
    }
}

module.exports = {registerUser,loginUser}