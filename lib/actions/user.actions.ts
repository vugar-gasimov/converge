"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Converg from "../models/converg.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    //   .populate({
    //   path: "communities",
    //   model: "Community",
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all posts authored by user with the given userId

    // TODO: Populate community

    const convergs = await User.findOne({ id: userId }).populate({
      path: "convergs",
      model: Converg,
      populate: {
        path: "children",
        model: Converg,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return convergs;
  } catch (error: any) {
    throw new Error(`Failed to fetch user convergs: ${error.message}`);
  }
}
