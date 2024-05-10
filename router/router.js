import { Router } from "express";

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

export default router;