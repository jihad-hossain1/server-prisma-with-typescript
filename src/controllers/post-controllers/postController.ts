import { Request, Response } from "express";
import prisma from "../../prisma/index.js";
import { Post } from "interface/index.js";

const getPosts = async (req: Request, res: Response) => {
  // console.log("first")
  try {
    const posts = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createPost = async (req: Request, res: Response) => {
  const { title, content, userId } = req.body;

  try {
    if (!title && title == "") {
      return res.json({ message: "title are required" });
    } else if (!content && content == "") {
      return res.json({ message: "content are required" });
    } else if (!userId ?? userId == 0) {
      return res.json({ message: "userid are required" });
    }

    const previousUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    console.log(previousUser);

    if (!previousUser) {
      return res.json({ message: "user are not found" });
    }

    const newPost = await prisma.article.create({
      data: {
        title,
        content,
        userId: userId,
      },
    });

    return res
      .status(201)
      .json({ message: "post create successfull", newPost });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updatePost = async (req: Request, res: Response) => {
  const { title, content, userId, id } = req.body;
  try {
    if (title == "") {
      return res.status(401).json({ message: "title are empty not allow" });
    } else if (content == "") {
      return res.status(401).json({ message: "content are empty not allow" });
    } else if (userId == 0 || !userId) {
      return res.status(401).json({ message: "userId are empty not allow" });
    } else if (title == 0 || !id) {
      return res.status(401).json({ message: "postid are empty not allow" });
    }

    const userAreValid = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    const userPost = await prisma.article.findFirst({ where: { id } });

    if (!userAreValid) {
      return res
        .status(400)
        .json({ message: "user are not valid for update this post" });
    } else if (!userPost) {
      return res.status(401).json({ message: "post are not found!" });
    } else if (userPost.userId !== userId) {
      return res.status(401).json({
        message:
          'You are not able change to this content, cause "YOU ARE NOT AUTHOR"',
      });
    }

    const update = await prisma.article.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({ post: update, message: "update ok" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { id, userId } = req.body;
  try {
    if (!id) {
      return res.status(401).json({ message: "post id is required" });
    } else if (!userId) {
      return res.status(401).json({ message: "user id is required" });
    }

    const findPost = await prisma.article.findFirst({
      where: { id: Number(id) },
    });

    if (!findPost) {
      return res.status(401).json({ message: "post is not found!" });
    }

    const userAreValid = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (userAreValid?.id !== findPost?.userId) {
      return res.status(401).json({
        message:
          "you are not able to delete this post, 'YOUR ARE NOT AUTHOR THIS POST' ",
      });
    }

    const deletedPost = await prisma.article.delete({
      where: { id: Number(id) },
    });

    if (!deletedPost) {
      return res.json({ message: "post are not delete" });
    }

    return res.status(200).json({ message: "post delete ok." });
  } catch (error) {
    return res.status(500).json({ message: "error from server ", error });
  }
};

// const createPostMany = async (req: Request, res: Response) => {
//   const { posts } = req.body;

//   try {
//     // const findIds = posts?.map((item: { id: number }) => item.id);

//     const mainPosts = await prisma.article.findMany();

//     var filtered = mainPosts.filter((item) => posts.indexOf(item.id) !== -1);

//     // const createPosts = await prisma.article.createMany({ data: filtered });

//     return res.status(201).json({ message: "ok", filtered });
//   } catch (error) {
//     res.status(500).json({ message: "error from server", error });
//   }
// };

// const createPostMany = async (req: Request, res: Response) => {
//   const { posts } = req.body;

//   try {
//     const mainPosts = await prisma.article.findMany();

//     var filtered = mainPosts.filter((item) => posts.indexOf(item.id) !== -1);
//     const createdPosts = [];
//     for (const post of filtered) {
//       const createdPost: Post = await prisma.article.create({
//         data: {
//           title: post.title,
//           content: post.content,
//           userId: 1,
//         },
//       });
//       createdPosts.push(createdPost);
//     }

//     return res
//       .status(201)
//       .json({ message: "Posts created successfully", createdPosts });
//   } catch (error) {
//     res.status(500).json({ message: "Error from server", error });
//   }
// };

const createPostMany = async (req: Request, res: Response) => {
  const { posts } = req.body;

  try {
    const mainPosts = await prisma.article.findMany();

    var filtered = mainPosts.filter((item) => posts.indexOf(item.id) !== -1);

    const createdPosts = [];
    const failedPosts = [];
    for (const post of filtered) {
      // Check if a post with the same title from the same user already exists
      const existingPost = await prisma.article.findFirst({
        where: {
          userId: 4,
          title: post.title,
        },
      });

      if (existingPost) {
        // If post already exists, add it to failedPosts array
        failedPosts.push({ userId: 4, title: post.title });
      } else {
        // If post doesn't exist, create a new one
        const createdPost = await prisma.article.create({
          data: {
            userId: 4,
            title: post.title,
            content: post.content,
            // Add other fields as necessary
          },
        });
        createdPosts.push(createdPost);
      }
    }

    if (failedPosts.length > 0) {
      return res.status(400).json({
        message: "Some posts were not created because they already exist",
        failedPosts,
      });
    }

    return res.status(201).json({
      message: "Posts created successfully",
      createdPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error from server", error });
  }
};

export { getPosts, createPost, updatePost, deletePost, createPostMany };
