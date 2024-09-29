import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
const genreateAccessAndRefreshToken = async (userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }


  } catch (error) {
    throw new ApiError(500, "something went wrong while generating refresh and access token")
  }
}



const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  const { fullName, email, username, password } = req.body

//validation
  if (
    [fullName, email, username, password].some((field) =>
      field?.trim() === "")
  ) {
    throw new ApiError(400, "fullname is required")
  }

  //cheak if user already exists:username,email
  const existeduser = await User.find({
    $or: [{ username }, { email }]
  })
  if (existeduser) {
    throw new ApiError(409, "user with email or user name already exist")
  }
  //cheak for images for avtar

  const avtarlocalpath = req.file?.avatar[0]?.path;
  const coverImagelocalPath = req.file?.coverimage[0]?.path;
  if (!avtarlocalpath) {
    throw new ApiError(400, "Avtar file is re")

  }
  //upload them to cloudanary
  const avatar = await uploadonCloudanary(avtarlocalpath)

  const coverimage = await uploadonCloudanary(coverImagelocalPath)
  if (!avatar) {
    throw new ApiError(400, "Avtar is re")
  }

  //create user object-create entry in db
  const user = await User.create({
    fullName,
    avtar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.tolowercase()

  })
  await user.save();
  //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  //check for user creation 
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while register the user")
  }
  const response = new ApiResponse(200, createdUser, "User registered Successfully");
  return res.status(202).json({response});
})

  const loginUser = asyncHandler(async (req, res) => {
  
  

 
 
  //send cookie
  //req body->data
  const { email, username, password } = req.body

  //username or email
  if (!username || !email) {
    throw new ApiError(400, "username or email  is re")
  }
    //find the user
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(400, "user not found")
  }

  //password Check
  const ispasswordValid = await user.ispasswordCorrect(password)
  if (!ispasswordValid) {
    throw new ApiError(400, "password incorrect")

  }

   //access and refresh token
const { accessToken, refreshToken } = await genreateAccessAndRefreshToken(user._id);
const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
const options = {
  httpOnly: true,
  secure: true
}
return res.status(200).cookie("accesToken", accessToken, options)
                      .cookie("refreshToken", refreshToken, options).json(
                                new ApiResponse(
                                  200,
                                {
                                user: loggedInUser, accessToken,
                                refreshToken
                                },
                                "User logged In sussessfully"
                                )
                              )

})

// const logoutUser = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate{
//     req.user._id,
//     {
//       $set: {
//         refreshToken: undefined
//       }
//     }
//   }
//   return res
//     .status(200)
//     .clearCookie("accessToken")
//     .clearCookie("refreshToken")
//     .json(new ApiResponse(200, {}, "User logged Out"))


// })
// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
//   if (!incomingRefreshToken) {
//     throw new ApiError(402, "unotherised req")

//   }
//   const decodredToken = jwt.verify(
//     incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET

//   )
//   const user = User.findById(decodredToken?._id)
//   if (!user) {
//     throw new ApiError(402, "invalid refreshToken")
//   }
//   if (incomingRefreshToken !== user?.refreshToken) {
//     throw new ApiError(402, "refresh token is expired or used")
//   }
//   const options = {
//     httpOnly: true,
//     secure: true
//   }
//   const { accessToken, newRefreshToken } = await genreateAccessAndRefreshToken(user._id)
//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", newRefreshToken, options)
//     .json(
//       new ApiResponse(200,
//         { acccessToken, newRefreshToken }, "AccessToken Suscessfully")


//     )




// })


export {
  registerUser,
  loginUser,
  // logoutUser,
  // refreshAccessToken

}