import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Pending", "Rejected", "Interview"],
      default: "Pending",
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

applicationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const Application = mongoose.model("Application", applicationSchema);