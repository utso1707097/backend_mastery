import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req,res) => {
    // get user details from frontend - done
    const {
        username,
        fullName,
        email,
        password,
    } =req.body;
    // validation - not empty
    // if(fullName === "" || fullName === undefined){
    //     throw ApiError(400, " fullname is required")
    // }

    // console.log("Request Body: ", req.body);

    if(
        [fullName,email,username,password].some((field)=> field?.trim()==="" || field === undefined)
    ){
        throw new ApiError(400,"All fields are required");
    }

    // check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    });

    if(existedUser){
        throw new ApiError(409, "User will username or email already exists");
    }

    // check for images, check for avtar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // console.log("Request files: ",req.files);
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }
    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // console.log("Avatar: ",avatar);

    if(!avatar){
        throw new ApiError(400, "Avatar file not uploaded");
    }
    // create user object - create entry in db

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // console.log("User: ",user);
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ); // kya kya nahi cahiye response mein

    // check for user creation => actually create hoise naki null
    if(!createdUser){
        throw new ApiError(500, "Something went wrong on server registering user");
    }

    
    // return res
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered sucessfully!!")
    );
    
});

export {registerUser};