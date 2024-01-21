import mongoose from "mongoose";

const convergSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Converg",
    },
  ],
});

const Converg =
  mongoose.models.Converg || mongoose.model("Converg", convergSchema);

export default Converg;

// Converg originalPathname
//     -> Converg comment 1
//        -> Converg comment 2
//           -> Converg comment 3
