import mongoose, { Document, Schema } from "mongoose";

interface EventDoc extends Document {
  title: string;
  image: string;
  venue: string;
  date: string;
  time: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
}

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
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

const Event = mongoose.model<EventDoc>("events", EventSchema);
export { Event };
