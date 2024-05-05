import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connection", () => {
      console.log("mongoDB connected!");
    });

    connection.on("error", (err) => {
      console.log("mongoDB not connected! please db is running", err);
      process.exit();
    });
  } catch (error) {
    console.error("Something went wrong in network connection", error);
  }
}
