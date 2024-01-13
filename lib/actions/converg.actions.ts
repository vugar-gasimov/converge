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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the posts that have no parents (top-level convergs...)
  const postsQuery = Converg.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });
  const totalPostsCount = await Converg.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchConvergById(id: string) {
  connectToDB();
  try {
    // TODO: Populate Community
    const converg = await Converg.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Converg,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return converg;
  } catch (error: any) {
    throw new Error(`Error fetching converg: ${error.message}`);
  }
}
