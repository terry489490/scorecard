import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default {
  connect: () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URL, {});
  },
};
