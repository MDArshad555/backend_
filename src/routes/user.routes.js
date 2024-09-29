import {Router}from "express";
import { registerUser,loginUser } from "../controllers/user.controller.js";
import {upload} from "../middlewears/multer.middle.js"

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar", 
            maxCount:2 
        },
        {
          name:"coverimage",
          maxcount:2  
        }
        


    ]),
    registerUser)
router.route("/login").post(loginUser)
// router.route("/refresh-Token").post(refreshAccessToken)
//secured Routes
// router.route("/logout").post(verifyjWT,logoutUser)
export default router