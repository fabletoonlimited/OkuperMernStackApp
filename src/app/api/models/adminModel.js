import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {  
        type: Boolean,
        default: true,
    },

    otp: { type: mongoose.Schema.Types.ObjectId, ref: "Otp"}

}, {timestamps: true});

userSchema.pre("save", async function (next) {
  const hashedPassword = bcrypt.hashSync(this.password, 10)
  this.password = hashedPassword;
  next();
});
   
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;