import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  addresses: [
  {
    name: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }
]
}, { timestamps: true });

export default mongoose.model("User", userSchema);