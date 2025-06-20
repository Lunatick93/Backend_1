import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI no definido en .env");

    mongoose.connection.on("connected", () => {
      console.log(" Mongoose conectado al servidor");
    });
    mongoose.connection.on("error", (err) => {
      console.error(" Mongoose error:", err);
    });

    await mongoose.connect(uri);
  } catch (err) {
    console.error("Error conectando a MongoDB Atlas:", err.message);
    process.exit(1);
  }
}
