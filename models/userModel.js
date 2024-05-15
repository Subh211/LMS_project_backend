import mongoose, { model, Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt  from 'bcrypt';

const userSchema = new Schema ({
    userName:{
        type: String,
        minlength: [5, 'Name must be at least 5 characters'],
        required: [true, 'Name is required'],
        trim: true,
        lowercase: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
        ]
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    confirmPassword:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    }
})


userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.password = hash;
        this.confirmPassword=null;
        next();
    });
});


userSchema.methods = {
    generateJWTToken : async function () {
        return jwt.sign (
            {id:this._id,email:this.email,role:this.role,subscription:this.subscription},
            process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY,
        }
        )
    }
}

const User = mongoose.model("userDetails",userSchema);

export default User;