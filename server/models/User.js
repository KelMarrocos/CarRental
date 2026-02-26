import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, select: false },

    role: { type: String, enum: ["owner", "user"], default: "user" },

    // imagem do perfil (1 vez só)
    image: { type: String, default: "" },

    // para deletar a imagem antiga no ImageKit
    imageFileId: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;