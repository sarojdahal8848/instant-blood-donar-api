import mongoose, { Document, Schema } from "mongoose";

interface BlogDoc extends Document {
  title: string;
  image: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
}

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        delete ret.__v;
      },
    },
  }
);

const Blog = mongoose.model<BlogDoc>("blogs", BlogSchema);
export { Blog };
