import { getAllPosts, getPost, createPost, updatePost, deletePost } from '../models/post.model.js';
import { userExists } from '../models/users.model.js';

export const getPosts = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const post = await getPost(id);

    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const createNewPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "title y content son requeridos" });
    }

    const newPost = {
      user_id: req.user.id,
      title,
      content
    };

    const created = await createPost(newPost);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updateExistingPost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, content } = req.body;

    const postExists = await getPost(id);
    if (!postExists) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    if (req.user.id !== postExists.user_id) {
      return res.status(403).json({ error: "No tienes permiso para editar este post" });
    }

    const postData = {};
    if (title) postData.title = title;
    if (content) postData.content = content;

    const updated = await updatePost(id, postData);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteExistingPost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const postExists = await getPost(id);
    if (!postExists) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    if (req.user.id !== postExists.user_id) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este post" });
    }

    await deletePost(id);
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};