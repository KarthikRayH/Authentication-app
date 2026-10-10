
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "UserName is Required"],
            unique: [true, "UserName Must Be Unique"]
        },

        email: {
            type: String,
            required: [true, "Email is Required"],
            unique: [true, "Email Must Be Unique"]
        },

        password: {
            type: String,
            required: [true, "Password is Required"],
            
        }
    },
    {
        timestamps: true
    }
);


// Hash password before saving
userSchema.pre("save", async function() {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});


// Compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;
