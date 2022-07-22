import mongoose, { Document, Schema } from "mongoose";

interface UserDoc extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret, options) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

const User = mongoose.model<UserDoc>("users", UserSchema);
export { User };
