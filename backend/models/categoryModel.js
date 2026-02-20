import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
  image: {
    type: String,
    trim: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null, // মেইন ক্যাটাগরি হলে এটি null থাকবে
  },
});

categorySchema.pre("find", function (next) {
  this.populate("parent");
  next();
});

categorySchema.pre("findOne", function (next) {
  this.populate("parent");
  next();
});

export default mongoose.model("Category", categorySchema);