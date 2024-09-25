import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    binding: {
        type: String,
        required: true
    },
    rewardPoints: {
        type: Number,
        required: true
    },
    productCode: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    price: {
        original: {
            type: Number,
            required: true
        },
        discounted: {
            type: Number,
            required: true
        },
        discountPercentage: {
            type: Number,
            required: true
        }
    },
    review : [{
        type: Object,
        required: true
    }],
    reviewsCount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
