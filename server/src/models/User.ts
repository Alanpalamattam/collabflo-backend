import mongoose, { Document, Schema } from "mongoose";

// Define the TypeScript interface for the User document
interface IUser extends Document {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

// Create the user schema
const userSchema: Schema<IUser> = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model using the interface
const User = mongoose.model<IUser>("User", userSchema);

export default User;