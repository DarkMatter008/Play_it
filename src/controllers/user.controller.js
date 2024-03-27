import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from  '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"



const registerUser =  asyncHandler(  async (req, res) =>{
    // get user details from frontend 
    // validation
    // check if user already  exists - email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    //  send response back with status code and message


    const { fullName, email, username, password } = req.body
    console.log(email);

    if(
        [fullName , email ,username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all field are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}] 
    })

    if(existedUser){
        throw new ApiError(409, "Email or Username has already been used");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, 'Failed to upload image')
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went worng while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "Successfully registered a new account!")
    );
    

} )
 

export {
    registerUser,
};