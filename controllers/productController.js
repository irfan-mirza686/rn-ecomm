import productModel from "../models/productModel.js";
import cloudniary from 'cloudinary';
import sendErrorResponse from "../utils/api_error.js"
import { getDataUri } from "../utils/features.js";

//GET All products ...
export const getAllProductsController = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        const code = 500;
        const message = "Error in A,ll Products API";
        sendErrorResponse(res, message, error, code);
    }
};

/// GET Single Product 
export const getSingleProductController = async (req, res) => {
    try {

        const product = await productModel.findById(req.params.id)
        // console.log(product)
        if (!product) {
            const code = 404;
            const message = 'Product Not Found';
            return sendErrorResponse(res, message, "error", code);
        }
        res.status(200).send({
            success: true,
            product
        })
    } catch (error) {
        const code = 500;
        // Cast Error || Object ID Error
        if (error.name === 'CastError') {
            const message = "Ivalid ID";
            return sendErrorResponse(res, message, error, code);
        }
        const message = "Error in Single Product API";
        return sendErrorResponse(res, message, error, code);
    }
};

// Create Product ...
export const createProductController = async (req, res) => {
    try {

        const { name, description, price, stock, category } = req.body;
        if (!name || !description || !price || !stock) {
            const code = 500;
            const message = "Please Provide All the data";
            sendErrorResponse(res, message, error, code);
        }
        if (!req.file) {
            const code = 500;
            const message = "Please upload product image";
            const error = "Validation Error";
            return sendErrorResponse(res, message, error, code);
        }

        const file = getDataUri(req.file);
        const cdb = await cloudniary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            uri: cdb.secure_url
        }

        const product = await productModel.create({
            name, description, stock, price, category, images: [image]
        })
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            product
        })
    } catch (error) {
        const code = 500;
        const message = "Error in Create Product API";
        sendErrorResponse(res, message, error, code);
    }
}

/// ############## Update Product Controller ####################### 
export const updateProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        // console.log(product)
        if (!product) {
            const code = 404;
            const message = 'Product Not Found';
            return sendErrorResponse(res, message, "error", code);
        }

        const { name, description, price, stock, category } = req.body;
       
        if (name) product.name = name
        if (description) product.description = description
        if (price) product.price = price
        if (stock) product.stock = stock
        if (category) product.category = category

        await product.save();
        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product
        })
    } catch (error) {
        const code = 500;
        if (error.name === 'CastError') {
            const message = "Ivalid ID";
            return sendErrorResponse(res, message, error, code);
        }
        const message = "Error in Update Product API";
        sendErrorResponse(res, message, error, code);
    }
}

// ####### Update Product Image ##########
export const updateProductImageController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)

        if (!product) {
            const code = 404;
            const message = 'Product Not Found';
            return sendErrorResponse(res, message, "error", code);
        }

        if (!req.file) {
            const code = 500;
            const message = "Please upload product image";
            const error = "Validation Error";
            return sendErrorResponse(res, message, error, code);
        }

        // Update Image
        const file = getDataUri(req.file);
        // if (product.images.public_id) {
        //     await cloudniary.v2.uploader.destroy(product.images.public_id)
        // }
        const cdb = await cloudniary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            uri: cdb.secure_url
        }

        product.images.push(image)
        await product.save();
        res.status(200).send({
            success: true,
            message: "Product Image updated successfully",
            product
        })
    } catch (error) {
        const code = 500;
        if (error.name === 'CastError') {
            const message = "Ivalid ID";
            return sendErrorResponse(res, message, error, code);
        }
        const message = "Error in Update Product API";
        sendErrorResponse(res, message, error, code);
    }
}