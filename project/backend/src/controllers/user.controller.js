import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken(); // user k die dei db te thake na
    const refreshToken = user.generateRefreshToken(); // user kaw dei db teo save rakhi

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // khali refresh token save hobe baki sob bad
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while genetaing refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend - done
  const { username, fullName, email, password } = req.body;
  // validation - not empty
  // if(fullName === "" || fullName === undefined){
  //     throw ApiError(400, " fullname is required")
  // }

  // console.log("Request Body: ", req.body);

  if (
    [fullName, email, username, password].some(
      (field) => field?.trim() === "" || field === undefined
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User will username or email already exists");
  }

  // check for images, check for avtar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // console.log("Request files: ",req.files);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // console.log("Avatar: ",avatar);

  if (!avatar) {
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
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong on server registering user");
  }

  // return res
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered sucessfully!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  const { email, username, password } = req.body;
  // username / email ase kina
  if (!username && !email) {
    throw new ApiError(400, "Either username or email is required");
  }
  // find user exists on the database

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  // check the password are same or not
  // j method use korbo mongoose er oikhane  model use korbo na User instance use korbo (user)
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  // access and refresh token to user
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // send cookies (secure cookies) and response

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  }; // cannot be modifiable from the client only server can modify by this two options

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully!!!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // delete access and refresh token from browser
  req.user._id;
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
  // remove refresh token from user database
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  // browser cookie or mobile device theke body
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  // verify token
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // find user when refresh token verified
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // matching refresh token incoming and decoded
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Resfresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", newAccessToken.options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { newAccessToken, newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
