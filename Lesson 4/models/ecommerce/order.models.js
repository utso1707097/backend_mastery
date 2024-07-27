import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true
        }
    }
);

// every product koita kore nitesa tar jonne temporary schema

const orderSchema = new mongoose.Schema(
    {
        orderPirce: {
            type: Number,
            required: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        orderItems: {
            // type: [
            //     {
            //         productId: {
            //             type: mongoose.Schema.Types.ObjectId,
            //             ref: "Product"
            //         },
            //         quantity: {
            //             type: Number,
            //             required: true
            //         }
            //     }
            // ],  // Emneo kora jai
            type: [orderItemSchema]  // multiple product multiple instance
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending","Cancelled","Delivered"], // Er moddhei howa lagbe
            default: "Pending"
        }
    },{timestamps: true}
);

export const Order = mongoose.model('Order',orderSchema);