import mongoose from "mongoose";
import { DB_URI } from "../config";
const connectDb = async () => {
  try {
    await mongoose.connect(DB_URI, {});
    console.log("db connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { connectDb };
