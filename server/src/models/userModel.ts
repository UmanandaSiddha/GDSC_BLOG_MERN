import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const roleEnum = {
    USER: "user",
    ADMIN: "admin",
    CREATOR: "creator",
};

export const accountEnum = {
    EMAIL: "email",
    GOOGLE: "google",
    GITHUB: "github",
};

export const requestEnum = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
}

export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    role: string;
    bio?: string;
    isVerified: boolean;
    isBlocked?: boolean;
    request?: string
    account: string[];
    googleId?: string;
    githubId?: string;
    socials?:  { platform: string; url: string }[];
    oneTimePassword?: string;
    oneTimeExpire?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    updatedAt: Date;

    getJWTToken(): string;
    comparePassword(enteredPassword: string): Promise<boolean>;
    getResetPasswordToken(): string;
    getOneTimePassword(): string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter your Name"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [4, "Name should have more than 4 characters"],
        },
        email: {
            type: String,
            required: [true, "Please Enter your Email"],
            unique: true,
            validate: [validator.isEmail, "Please enter a valid Email"],
        },
        password: {
            type: String,
            minLength: [8, "Password should have more than 8 characters"],
            select: false,
        },
        avatar: String,
        bio: String,
        role: {
            type: String,
            enum: Object.values(roleEnum),
            default: roleEnum.USER,
        },
        request: {
            type: String,
            enum: Object.values(requestEnum),
        },
        socials: {
            type: [
                {
                    platform: {
                        type: String,
                        enum: ["facebook", "twitter", "instagram", "linkedin"],
                    },
                    url: String,
                },
            ],
            default: [],
        },
        account: {
            type: [String],
            enum: Object.values(accountEnum),
            default: [accountEnum.EMAIL],
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        googleId: String,
        githubId: String,
        oneTimePassword: String,
        oneTimeExpire: Date,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

// Password Hash
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// JWT Token
userSchema.methods.getJWTToken = function (this: IUser) {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password
userSchema.methods.comparePassword = async function (this: IUser, enteredPassword: string) {
    let isPasswordMatched;
    if (this.password) {
        isPasswordMatched = await bcrypt.compare(enteredPassword, this.password);
    }
    return isPasswordMatched;
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function (this: IUser) {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

    return resetToken;
};

// Generating One Time Password
userSchema.methods.getOneTimePassword = function (this: IUser) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    this.oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    this.oneTimeExpire = new Date(Date.now() + 15 * 60 * 1000);

    return otp.toString();
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;