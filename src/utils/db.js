import mongoose from "mongoose";

const connect = async () => {
    if (mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to Mongoose");
    } catch (error) {
        throw new Error("Error connecting to Mongoose");
        console.log(error);
    }
};

export default connect;