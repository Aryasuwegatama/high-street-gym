import { body, param, header } from "express-validator";

export const validateSignUp = [
  body("user_email")
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),
  body("user_password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .trim(),
  body("user_firstname")
    .notEmpty()
    .withMessage("First name is required.")
    .trim()
    .escape(),
  body("user_lastname")
    .notEmpty()
    .withMessage("Last name is required.")
    .trim()
    .escape(),
  body("user_phone")
    .optional()
    .isNumeric()
    .withMessage("Phone number must contain only digits.")
    .trim(),
  body("user_address").optional().trim().escape(),
];

export const validateSignIn = [
  body("user_email")
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),
  body("user_password").notEmpty().withMessage("Password is required.").trim(),
];

export const validateGetById = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("ID must be a positive integer.")
    .toInt(),
];

export const validateAuthToken = [
  header("authToken")
    .notEmpty()
    .withMessage("Authentication token is required.")
    .trim(),
];

export const validateGetUserByEmail = [
  param("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),
];

export const validateCreateUser = [
  body("user_email")
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),
  body("user_password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .trim(),
  body("user_role")
    .isIn(["member", "trainer", "admin"])
    .withMessage("Invalid role.")
    .trim()
    .escape(),
  body("user_firstname")
    .notEmpty()
    .withMessage("First name is required.")
    .trim()
    .escape(),
  body("user_lastname")
    .notEmpty()
    .withMessage("Last name is required.")
    .trim()
    .escape(),
  body("user_phone")
    .optional()
    .isNumeric()
    .withMessage("Phone number must contain only digits.")
    .trim(),
  body("user_address").optional().trim().escape(),
];

export const validateUpdateUser = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("ID must be a positive integer.")
    .toInt(),
  body("user_email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),
  body("user_password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .trim(),
  body("user_firstname")
    .optional()
    .notEmpty()
    .withMessage("First name is required.")
    .trim()
    .escape(),
  body("user_lastname")
    .optional()
    .notEmpty()
    .withMessage("Last name is required.")
    .trim()
    .escape(),
  body("user_phone")
    .optional()
    .isNumeric()
    .withMessage("Phone number must contain only digits.")
    .trim(),
  body("user_address").optional().trim().escape(),
];
