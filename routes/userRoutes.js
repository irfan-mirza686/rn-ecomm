import express from 'express'
import {
    getUserProfileController,
    loginController,
    logoutController,
    registerController,
    updatePasswordController,
    updateProfileController,
    updateProfilePicController
} from '../controllers/userController.js';
import { isAuth } from '../middlewares/AuthMiddleware.js';
import { singleUpload } from '../middlewares/Multer.js';
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
})

// Router Object
const router = express.Router();

// @@@@@@ Routes..
//Register
router.post('/register', limiter, registerController)

//Login
router.post('/login', limiter, loginController)

// Profile Rotue ...
router.get('/profile', isAuth, getUserProfileController)

// logout Route...
router.get('/logout', isAuth, logoutController)

// Update Profile Route
router.put('/profile/update', isAuth, updateProfileController)

// Update Password Route
router.put('/update/password', isAuth, updatePasswordController)

// Update Profile Picture 
router.put('/update/profile/picture', isAuth, singleUpload, updateProfilePicController)

export default router;