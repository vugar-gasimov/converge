"use server";

import { revalidatePath } from "next/cache";
import Converg from "../models/converg.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

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

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdConverg = await Converg.create({
      text,
      author,
      community: communityIdObject,
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { convergs: createdConverg._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { convergs: createdConverg._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
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

export async function fetchConvergById(convergId: string) {
  connectToDB();
  try {
    // TODO: Populate Community
    const converg = await Converg.findById(convergId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
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

export async function addCommentToConverg(
  convergId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Adding a comment
    // Find the original post by its id
    const originalConverg = await Converg.findById(convergId);

    if (!originalConverg) {
      throw new Error("Converg not found.");
    }

    // Create a new post with the comment text

    const commentConverg = new Converg({
      text: commentText,
      author: userId,
      parentId: convergId,
    });

    // Save the new post

    const savedCommentConverg = await commentConverg.save();

    // Update the original post to include the new comment

    originalConverg.children.push(savedCommentConverg._id);

    // Save the original post

    await originalConverg.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to converg: ${error.message}`);
  }
}
