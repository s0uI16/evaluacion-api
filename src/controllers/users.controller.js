import bcrypt from 'bcrypt';
import { getAllUsers, getUser, createUser, updateUser, deleteUser, userExists } from '../models/users.model.js';
import { getPostsByUserId, deletePostsByUserId } from '../models/post.model.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error); // Pasa el error a tu errorHandler.js
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await getUser(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const userPosts = await getPostsByUserId(id);
    res.json({ ...user, posts: userPosts });
  } catch (error) {
    next(error);
  }
};

export const createNewUser = async (req, res, next) => {
  try {
    // Ahora exigimos password porque la BD lo requiere
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "El formato del email no es válido" });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    // Hasheamos la contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    };

    // La BD asignará el ID automáticamente
    const created = await createUser(newUser);
    res.status(201).json(created);
  } catch (error) {
    // Si el email ya existe, PostgreSQL lanzará un error de clave única (código 23505)
    if (error.code === '23505') {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    next(error);
  }
};

export const updateExistingUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, email, password } = req.body;

    const exists = await userExists(id);
    if (!exists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    if (req.user.id !== id) {
     return res.status(403).json({ error: "No tienes permiso para modificar este usuario" });
    }
    
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ error: "El formato del email no es válido" });
    }

    const userData = {};
    if (name) userData.name = name;
    if (email) userData.email = email;
    

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
      }
        userData.password = await bcrypt.hash(password, 10);
      } 

    const updated = await updateUser(id, userData);
    res.json(updated);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: "El email ya está registrado por otro usuario" });
    }
    next(error);
  }
};

export const deleteExistingUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const exists = await userExists(id);
    if (!exists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (req.user.id !== id) {
     return res.status(403).json({ error: "No tienes permiso para eliminar este usuario" });
    }

    await deletePostsByUserId(id);
    await deleteUser(id);

    res.json({ message: "Usuario y sus posts eliminados correctamente" });
  } catch (error) {
    next(error);
  }
};