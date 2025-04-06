import mongoose from "mongoose";

// Check if the model already exists to prevent model recompilation error
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"],
        // unique: true,
        trim: true,
        match: /^SCC[A-Z0-9]{5}$/ // Ensures format: SCC followed by 5 alphanumeric characters
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        // unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    collection: 'users'
}));

// Add indexes
User.schema.index({ email: 1 }, { unique: true });
User.schema.index({ userId: 1 }, { unique: true });

export default User;
