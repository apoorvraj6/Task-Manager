import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field.trim() === "")) {
      return res.json({ success: false, message: "Enter all the fields" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;

        if([email,password].some((field)=>field.trim() === ""))
            return res.json({success:false,message:'Email and password is required'})

        const user = await User.findOne({email});

        if(!user)
            return res.json({success:false,message:"This email is not registered"})

        const isPasswordValid = await user.isPasswordCorrect(password);

        if(!isPasswordValid)
            return res.json({success:false,message:"Incorrect Password"})

        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        res.json({success:true,accessToken,loggedInUser})
    } catch (error) {
         console.log(error);
    res.json({ success: false, message: error.message });
    }
}

export {
    registerUser,
    loginUser
}
