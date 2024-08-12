const {UserModule} = require("../model/userModel")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { BlackListToken } = require("../model/blackListModel");

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
        if (!user) {
            return res.status(401).json({ msg: "Invalid User" });
        }
        bcrypt.compare(password,user.password ,(err,result)=>{
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if(result){
                // const token = jwt.sign({
                //     id:user._id , authors : user.name
                // },"masai");
                const token = jwt.sign({
                    id: user._id, 
                    authors: user.name,
                    role : user.role
                }, "masai");
             res.send({msg:"Login successful", token: token , role: user.role})
            }
            else{
                return res.status(401).json({ msg: "Invalid credentials" });
            }
            
        })
    } catch (error) {
        console.log(`error ${error}`)
        res.status(500).json({"error":error.message})
    }
}

//getAllusers
const getAllUsers = async(req,res)=>{
    try {
        const {sort ,search, ...filters} = req.query;
        let sortCriteria = {};
        if(sort){
            const [field, order] = sort.split(':');
            sortCriteria[field] = order === 'desc' ? -1 : 1;
        }
        if(search){
            const searchRegex = new RegExp(search, 'i');
            filters.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { role: searchRegex }
            ].filter(filter => Object.values(filter).some(value => value !== undefined));
        }
        const users = await UserModule.find(filters).sort(sortCriteria);
        res.send({ users });
    } catch (error) {
        res.status(401).send({ error: "Error in fetching data!" });
    }
}

//logout
const logoutUser = async(req,res)=>{
    const blackListToken = req.headers.authorization?.split(" ")[1];

    try {
        const Token = await BlackListToken.findOne({blackListToken});
        if(Token){
            return res.status(403).json({msg: "Yor are logged out! Please Login again"})
        }
        else{
            const blacklist = new BlackListToken({blackListToken});
            await blacklist.save();return res.status(200).send({ msg: "User logout successfully" });

        }
        
    } catch (error) {
        return res.status(500).send({ msg: "internal server error", error: error });
    }
}

module.exports = {registerUser,loginUser ,getAllUsers ,logoutUser}