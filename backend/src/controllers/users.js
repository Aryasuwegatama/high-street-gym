import * as UserModel from "../models/users.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// 1. Sign in a user
export async function signIn(req, res) {
  const { user_email, user_password } = req.body;
  try {
    const user = await UserModel.getByEmail(user_email);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      user_password,
      user.user_password
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }

    const authToken = uuidv4();
    await UserModel.updateUser(user.user_id, { user_auth_token: authToken });

    res
      .status(200)
      .json({ status: 200, authToken, message: "Sign in successful" });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error signing in", error });
  }
}

// 2. Sign up a new user
export async function signUp(req, res) {
  const {
    user_email,
    user_password,
    user_firstname,
    user_lastname,
    user_phone,
    user_address,
  } = req.body;
  try {
    const userExists = await UserModel.getByEmail(user_email);
    console.log(userExists);
    if (userExists) {
      return res
        .status(409)
        .json({ status: 409, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);
    await UserModel.createUser(
      user_email,
      hashedPassword,
      "member",
      user_phone,
      user_firstname,
      user_lastname,
      user_address
    );

    res
      .status(201)
      .json({ status: 201, message: "User signed up successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error signing up", error });
  }
}

// 3. Sign out a user
export async function signOut(req, res) {
  const authToken = req.header("authToken");

  try {
    const user = await UserModel.getByAuthToken(authToken);
    if (!user) {
      return res.status(401).json({ status: 401, message: "Invalid token" });
    }

    await UserModel.updateUser(user.user_id, { user_auth_token: null });
    res
      .status(200)
      .json({ status: 200, message: "User signed out successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error signing out", error });
  }
}

// 5. Get all users (admin access)
export async function getAll(req, res) {
  try {
    const users = await UserModel.getAll();
    const sanitizedUsers = users.map((user) => {
      const { user_password, ...sanitizedUser } = user;
      return sanitizedUser;
    });
    res.status(200).json({
      status: 200,
      users: sanitizedUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching users",
      error,
    });
  }
}

// 6. Get a user by ID
export async function getById(req, res) {
  const { id } = req.params;

  try {
    const user = await UserModel.getById(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: 200,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching user", error });
  }
}

// Get user by auth token
export async function getByAuthToken(req, res) {
  const authToken = req.header("authToken");

  try {
    const user = await UserModel.getByAuthToken(authToken);
    if (!user) {
      return res.status(401).json({ status: 401, message: "Invalid token" });
    }

    res.status(200).json({ status: 200, user });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching user", error });
  }
}

// Get a user by email
export async function getByEmail(req, res) {
  const { email } = req.params;
  try {
    const user = await UserModel.getByEmail(email);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res.status(200).json({ status: 200, user });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching user", error });
  }
}

// 7. Create a new user (admin function)
export async function createUser(req, res) {
  const {
    user_email,
    user_password,
    user_role,
    user_phone,
    user_firstname,
    user_lastname,
    user_address,
  } = req.body;
  try {
    const userExists = await UserModel.getByEmail(user_email);
    if (userExists) {
      return res
        .status(409)
        .json({ status: 409, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const [result] = await UserModel.createUser(
      user_email,
      hashedPassword,
      user_role,
      user_phone,
      user_firstname,
      user_lastname,
      user_address
    );

    const userId = result.insertId;

    res
      .status(201)
      .json({ status: 201, message: "User created successfully", userId });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error creating user", error });
  }
}

// 8. Update a user's details
export async function updateUser(req, res) {
  const { id } = req.params;
  const updatedFields = { ...req.body };

  if (updatedFields.user_password) {
    updatedFields.user_password = await bcrypt.hash(
      updatedFields.user_password,
      10
    );
  }

  try {
    await UserModel.updateUser(id, updatedFields);
    res.status(200).json({ status: 200, message: "User updated successfully" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res
        .status(409)
        .json({ status: 409, message: "Email already used in other user" });
    } else {
      res
        .status(500)
        .json({ status: 500, message: "Error updating user", error });
    }
  }
}

// 9. Delete a user by ID
export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await UserModel.getById(id);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    await UserModel.deleteById(id);
    res.status(200).json({ status: 200, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error deleting user", error });
  }
}
