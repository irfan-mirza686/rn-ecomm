import { userModal } from '../models/userModal.js'
import cloudinary from 'cloudinary'
import { getDataUri } from '../utils/features.js';
export const registerController = async (req, res) => {
    try {
        const { name, email, address, city, country, password, phone } = req.body;
        if (!name || !email || !address || !city || !country || !password || !phone) {
            res.status(500).send({
                success: false,
                message: "Please Provide all fields"
            })
        }
        // check existing user 
        const existingUser = await userModal.findOne({ email });
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: "email already taken"
            })
        }
        const user = await userModal.create({ name, email, address, city, country, password, phone });
        res.status(201).send({
            success: true,
            message: "You have successfully Registered",
            user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Register API",
            error
        })
    }
}

// Login Controller..

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Invalid Credentials"
            })
        }

        // check user 
        const user = await userModal.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }

        // check pass 
        const isMatch = await user.companrePassword(password);
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const token = user.generateToken();

        res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false
        }).send({
            success: true,
            message: "User Logged in",
            token,
            user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Login API",
            error
        })
    }
}

// GET User Profile ...
export const getUserProfileController = async (req, res) => {
    try {
        const user = await userModal.findById(req.user._id);
        user.password = undefined
        res.status(200).send({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Login API",
            error
        })
    }
}

// Logout Controller ...
export const logoutController = async (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false
        }).send({
            success: true,
            message: "logout succesfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Login API",
            error
        })
    }
}

// Update Profile Controller ...
export const updateProfileController = async (req, res) => {
    try {
        const user = await userModal.findById(req.user._id);
        const { name, email, address, city, country, phone } = req.body;

        // Validation + update
        if (name) user.name = name
        if (email) user.email = email
        if (address) user.address = address
        if (city) user.city = city
        if (country) user.country = country
        if (phone) user.phone = phone

        // Save User 
        await user.save();
        res.status(200).send({
            success: true,
            message: "User Profile Update successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Update API",
            error
        })
    }
}

// Update password controller 
export const updatePasswordController = async (req, res) => {
    try {
        const user = await userModal.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;

        // Validation..
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please provide old or new password"
            })
        }

        // Check old Password
        const isMatch = await user.companrePassword(oldPassword)
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Old Password"
            })
        }
        user.password = newPassword
        await user.save()
        res.status(200).send({
            success: true,
            message: "Password Updated successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Update Password API",
            error
        })
    }
}

// update profile picture 
export const updateProfilePicController = async (req, res) => {
    try {
        const user = await userModal.findById(req.user._id);
        // get file from client
        const file = getDataUri(req.file)

        // delete Pre Image..
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id)
        const cdb = await cloudinary.v2.uploader.upload(file.content)

        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        await user.save();

        res.status(200).send({
            success: true,
            message: "Profile Picture updated"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Update Profile Picture API",
            error
        })
    }
}