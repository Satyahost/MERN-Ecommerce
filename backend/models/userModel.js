import mongoose from "mongoose";
import validator from"validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
 


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
    maxLength: [
      25,
      "Invalid name. Please enter a name with fewer than 25 characters",
    ],
    minLength: [3, "name should contain more than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your email"],
    unique: true,
    validate:[validator.isEmail,"please enter valid email"]
  },
  password:{
    type:String,
    required:[true, "please enter your password",],
    minLength:[8,"password should be greater than 8 characters"],
    select:false
  },
  avatar:{
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
  },
  role:{
    type:String,
    default:"user"

  },
  resetPasswordToken:String,
  resetPasswordExpired:Date

},{timestamps:true});


//password hashing
userSchema.pre("save",async function(){
  //1st- updating profile(name,email,image)--hashed password will be hashed again
  //2nd- update password

   if (!this.isModified("password")) {
     return ;
   }
    this.password= await bcrypt.hash(this.password,10)
    
})
 

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
}


userSchema.methods.verifyPassword=async function(userEnteredPassword){
    return await bcrypt.compare(userEnteredPassword,
        this.password
    );
}

//generating token
userSchema.methods.generatePasswordResetToken=function(){
  const resetToken=crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).
  digest("hex");
  this.resetPasswordExpired=Date.now()+30*60*1000  //30minutes
  return resetToken;
}


export default mongoose.model("User",userSchema);