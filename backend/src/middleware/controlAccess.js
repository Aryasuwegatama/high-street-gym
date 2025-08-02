import * as user from "../models/users.js";

export default function controlAccess(allowedRoles, enforceSelfAccess = false) {
  return async function (req, res, next) {
    const authToken = req.header("authToken");

    if (!authToken) {
      return res.status(401).json({
        status: 401,
        message: "Authentication key missing",
      });
    }

    try {
      const authenticatedUser = await user.getByAuthToken(authToken);

      if (!authenticatedUser) {
        return res.status(401).json({
          status: 401,
          message: "Authentication key invalid",
        });
      }

      // Check if the user role is allowed
      if (!allowedRoles.includes(authenticatedUser.user_role)) {
        return res.status(403).json({
          status: 403,
          message: "Access forbidden",
        });
      }

      // Enforce self-access
      if (enforceSelfAccess && authenticatedUser.user_role !== "admin") {
        const { id } = req.params;
        if (authenticatedUser.user_id !== parseInt(id, 10)) {
          return res.status(403).json({
            status: 403,
            message: "Access restricted to your own data",
          });
        }
      }

      req.user = authenticatedUser; // Attach user data to the request
      next();
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
}
