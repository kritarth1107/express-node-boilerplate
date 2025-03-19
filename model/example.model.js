import mongoose from "mongoose";

// ✅ Define Schema
const UserSchema = new mongoose.Schema(
    {
        // ✅ Unique Identifier (MongoDB auto-generates _id, but adding custom ID if needed)
        userId: { type: mongoose.Schema.Types.ObjectId, auto: true },

        // ✅ Basic Fields
        name: { type: String, required: true, trim: true }, // Trim removes extra spaces
        email: { type: String, required: true, unique: true, lowercase: true }, // Unique email

        // ✅ Authentication
        password: { type: String, required: true, select: false }, // `select: false` prevents it from being queried
        role: { type: String, enum: ["user", "admin"], default: "user" }, // Role with predefined values

        // ✅ Contact Info
        phone: { type: String, unique: true, sparse: true }, // Sparse index allows null but ensures uniqueness
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            country: { type: String, trim: true, default: "Unknown" }
        },

        // ✅ Preferences & Settings
        preferences: {
            darkMode: { type: Boolean, default: false },
            notifications: { type: Boolean, default: true }
        },

        // ✅ Payment & Finance
        walletBalance: { type: Number, default: 0, min: 0 }, // Ensures no negative values
        paymentMethods: [
            {
                type: { type: String, enum: ["credit_card", "paypal", "crypto"], required: true },
                details: { type: String, required: true } // Store encrypted details
            }
        ],

        // ✅ Social Media Integration
        socialAccounts: {
            github: { type: String, trim: true },
            twitter: { type: String, trim: true }
        },

        // ✅ Security & Timestamps
        lastLogin: { type: Date, default: Date.now }, // Stores last login timestamp
        isVerified: { type: Boolean, default: false }, // Email verification status
        createdAt: { type: Date, default: Date.now }, // Auto timestamp
        updatedAt: { type: Date, default: Date.now } // Auto-updated on each save
    },
    {
        timestamps: true, // Automatically adds `createdAt` & `updatedAt`
        toJSON: { virtuals: true }, // Ensure virtuals are included in JSON output
        toObject: { virtuals: true }
    }
);

// ✅ Virtual Field (not stored in DB, but calculated on request)
UserSchema.virtual("fullAddress").get(function () {
    return `${this.address.street}, ${this.address.city}, ${this.address.country}`;
});

// ✅ Indexing for fast queries
UserSchema.index({ email: 1 }); // Index on email field for faster lookups

// ✅ Pre-save Hook (Hash password before saving)
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // If password is not changed, skip hashing

    // Hash password logic here (e.g., using bcrypt)
    next();
});

// ✅ Model Export
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
