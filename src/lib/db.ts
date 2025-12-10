import mongoose from "mongoose";

let connection: {
    isConneted?: number;
} = {};

export const connectDB = async () => {
    if (connection.isConneted) return;
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI!);
        connection.isConneted = con.connections[0].readyState;
    } catch (error) {
        console.log("MongoDB connection error", error);
    }
};
