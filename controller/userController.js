import User from "../models/userModel.js";
import bcrypt  from 'bcrypt';


const signUp = async (req,res) => {

    try {
        
    const {userName,email,password,confirmPassword} = req.body;

    if (!userName || !email || !password || ! confirmPassword) {
        return res.status(400).json({
            success:false,
            message:"Every field is required"
        });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({
            success:false,
            message:"Email already exists"
        });
    }

    const user = await User.create ({
        userName,
        email,
        password,
        confirmPassword
    })

    if (!user) {
        return res.status(400).json({
            success:false,
            message:"User creation unsuccessful"
        });
    }

    return res.status(200).json({
        success:true,
        message:`User created succesfully`,
        data:user
    })

    } catch (error) {
        
        return res.status(400).json({
            success:false,
            message:error.message
        })

    }
    
}

const signIn = async (req,res) => {
    
    try {
        
        const {email,password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success:false,
                message:"Every field is required"
            })
        }

        const userPresentOrNot = await User.findOne ({email}).select('+password')

        if ( !userPresentOrNot || ! await (bcrypt.compare( password ,userPresentOrNot.password ))) {

            return res.status(400).json ({
                success:false,
                message:"Invalid credentials"
            })
        }

        const token = await userPresentOrNot.generateJWTToken();

        userPresentOrNot.password = undefined;

        const cookieOptions = {
            maxAge: 7*24*60*60*1000,
            httpOnly:true
        }

        res.cookie('token',token,cookieOptions);

        return res.status(201).json({
            success:true,
            message:"You have logged in successfully"
        })

    } catch (error) {
        
        return res.status(400).json({
            success:false,
            message:error.message
        })

    }

}

const getUser = async (req,res) => {

    const userId = req.user.id;

    try {
        
        const user = await User.findById(userId);
        return res.status(200).json({
            success:true,
            message:user
        })

    } catch (error) {
        
        return res.status(400).json({
            success:false,
            message:error.message
        })

    }

}

const logOut = (req,res) => {

    try {
        
    res.cookie == null;

    res.status(200).json({
        success:true,
        message:"Succesfully logged out"
    })

    } catch (error) {
        
        return res.status(400).json({
            success:false,
            message:`Error occured during logout with ${error.message}`
        })

    }

}

export {
    signUp,
    signIn,
    getUser,
    logOut
}