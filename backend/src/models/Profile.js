import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

profileSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const Profile = mongoose.model("Profile", profileSchema);