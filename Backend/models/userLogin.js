import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  name: { 
    type: String,
    
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String 
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  profilePicture: {
    type: String
  }
}, 
{
  timestamps: true
});

export const LoginData = mongoose.model('LoginData', loginSchema);


