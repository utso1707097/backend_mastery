// This middleware checks if there is a logged in user or not 

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


// res use hosse na bole _
export const verifyJWT = asyncHandler(async(req,_ ,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Bearer ",""); // mobile app a cookie thake na
        
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedTokenInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedTokenInfo?._id).select(
            "-password -refreshToken"
        );
    
        if(!user){
            // discuss about frontend
    
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token");
    }
})