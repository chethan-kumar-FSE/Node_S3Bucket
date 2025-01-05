import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  imageUrl: {
    required: true,
    type: String,
  },
  caption: {
    required: true,
    type: String,
  },
});

const bucket = mongoose.model("bucket", ImageSchema);
export { bucket };
