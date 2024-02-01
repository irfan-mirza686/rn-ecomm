import JWT from 'jsonwebtoken'
import userModal from '../models/userModal.js'
export const isAuth = async (req,res,next) => {
    const {token} = req.cookies
    if (!token) {
        return res.status(401).send({
            success:false,
            message:"UnAuthorized User"
        })
    }

    const decodeData = JWT.verify(token,process.env.JWT_SECRET);
    req.user = await userModal.findById(decodeData._id);
    next();
}