import mongoose from "mongoose";

// Check if the model already exists to prevent model recompilation error
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    verificationCode: {
        type: String,
        default: null
    },
    verificationCodeExpires: {
        type: Date,
        default: null
    },
    resetCode: {
        type: String,
        default: null
    },
    resetCodeExpires: {
        type: Date,
        default: null
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
// User.schema.index({ email: 1 });
// User.schema.index({ userId: 1 }, { unique: true });

export default User;
