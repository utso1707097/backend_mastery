import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

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

export default router;