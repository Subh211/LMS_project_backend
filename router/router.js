import { Router } from "express";
import { getUser, logOut, signIn, signUp } from "../controller/userController.js";
import { userDetails } from "../middleware/userDetails.js";

const router = Router();
router.get("/",((req,res)=> {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to user management system",
          })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Internal server error ${error.message}`,
          });
    }
}))

router.post('/signup',signUp);
router.post('/signin',signIn);
router.get('/user',userDetails,getUser);
router.get('/logout',logOut)

export default router;