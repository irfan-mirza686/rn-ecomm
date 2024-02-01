import express from "express";
import {
    createProductController,
    getAllProductsController,
    getSingleProductController,
    updateProductController,
    updateProductImageController
} from "../controllers/productController.js";
import { isAuth } from "../middlewares/AuthMiddleware.js";
import { singleUpload } from "../middlewares/Multer.js";

const router = express.Router();


//Routes...
router.get('/get-all', getAllProductsController)

router.get('/:id', getSingleProductController)

router.post('/create', isAuth, singleUpload, createProductController)

router.put('/:id', isAuth, updateProductController)

router.put('/image/:id', isAuth, singleUpload, updateProductImageController)

// export 
export default router;