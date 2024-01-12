"use server";

import { revalidatePath } from "next/cache";
import Converg from "../models/converg.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createConverg({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createdConverg = await Converg.create({
      text,
      author,
      community: null,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { converge: createdConverg._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    const errorMessage =
      error.message || "An error occurred while creating converg.";
    throw new Error(`Error creating converg: ${error.message}`);
  }
}
