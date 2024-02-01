import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    images: [
        {
            public_id: String,
            uri: String
        }
    ]
}, { timestamps: true })

export const productModel = mongoose.model("Products", productSchema);
export default productModel;