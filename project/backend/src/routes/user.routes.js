import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// file upload middleware specified
router.route("/register").post(
    upload.fields([
        {
            name: "avatar", // frontend a kheyal rakhte hobe
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT ,logoutUser); // age middleware dekhbe vai tui login achos kina

export default router;