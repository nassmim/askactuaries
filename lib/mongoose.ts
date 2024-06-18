"use server";
import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
  mongoose.set("strict", true);

  if (!process.env.MONGODB_URL) {
    console.log("The DB URL is not set up");
    return;
  }
  if (!isConnected) {
    await mongoose
      .connect(process.env.MONGODB_URL, {
        dbName: "askdevs",
      })
      .catch((error) => {
        throw new Error(
          "Connexion to DB impossible. " +
            (error instanceof Error ? error.message : error),
        );
      });

    isConnected = true;
  }
};
