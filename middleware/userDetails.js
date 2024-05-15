import jwt from 'jsonwebtoken';

const userDetails = async (req,res,next) => {

    const token = (req.cookies && req.cookies.token) || null;

    if (!token) {
        return res.status(400).json({
            success:false,
            message:"Unable to find cookie"
        })
    }

    try {
        
        const payload = jwt.verify(token,process.env.JWT_SECRET);

        req.user = {id:payload.id,email:payload.email}

    } catch (error) {
        
        return res.status(400).json({
            success:false,
            message:error.message
        })

    }
    next();
}

export {userDetails};