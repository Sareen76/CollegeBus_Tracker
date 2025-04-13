import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import Route from "../models/routesSchema.js";

config();

const isEmail = (identity) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity);
const isSic = (identity) => /^[0-9]{2}[a-zA-Z]{4}[0-9]{2}$/.test(identity); // Example SIC regex like 21bcse84
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (identity, userId) => {
  return jwt.sign({ identity, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (request, response, next) => {
  try {
    const { name, identity, password, role, phone } = request.body;
    if (!identity || (!isEmail(identity) && !isSic(identity))) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email or SIC number." });
    }
    const existingUser = await User.findOne({
      identity: identity.toLowerCase(),
    });

    if (existingUser) {
      return response.status(409).json({ message: "User Already Exist. " });
    }

    const newUser = await User.create({ name, identity, password, role, phone });
    const Token = createToken(identity, newUser.id);
    response.cookie("jwt", Token, {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({
      id: newUser.id,
      identity: newUser.identity,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server error");
  }
};

// export const signin = async (request, response, next) => {
//   try {
//     const { identity, password } = request.body;
//     if (!identity || (!isEmail(identity) && !isSic(identity))) {
//       return res
//         .status(400)
//         .json({ message: "Please enter a valid email or SIC number." });
//     }

//     const user = await User.findOne({ identity: identity.toLowerCase() });

//     if (!user) {
//       return response.status(401).json({ message: "Invalid Credentials" });
//     }

//     const Token = createToken(identity, newUser.id);
//     response.cookie("jwt", Token, {
//       maxAge,
//       secure: true,
//       sameSite: "None",
//     });

//     return response.status(201).json({
//       id: user.id,
//       identity: user.identity,
//       message: "User Logged In Successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return response.status(500).send("Internal Server error");
//   }
// };

export const signin = async (request, response, next) => {
  try {
    const { identity, password } = request.body;

    // Validate input fields
    if (!identity || !password) {
      return response.status(400).json({ message: "Identity and password are required." });
    }

    if (!identity || (!isEmail(identity) && !isSic(identity))) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email or SIC number." });
    }

    // Find user and include password field
    const user = await User.findOne({ identity: identity.toLowerCase() }).select("+password");
    console.log(user)
    if (!user) {
      return response.status(401).json({ message: "Invalid Credentials" });
    }

    // Compare passwords using pre-defined method in User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return response.status(401).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token
    const Token = createToken(user.identity, user.id);

    // Set secure cookie
    response.cookie("jwt", Token, {
      secure: true,
      sameSite: "None",
      maxAge
    });

    // Send success response
    return response.status(200).json({
      id: user.id,
      identity: user.identity,
      role: user.role,
      message: "User Logged In Successfully",
    });

  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllRoutes = async (req, res) => {
  try {
      const routes = await Route.find().populate("stops.stopId"); // Populate stop details
      return res.status(200).json({ routes });
  } catch (error) {
      console.error("Error fetching routes:", error);
      return res.status(500).json({ error: "Failed to fetch routes" });
  }
};

export const getRouteById = async (req, res) => {
  try {
      const { routeId } = req.params;

      const route = await Route.findById(routeId).populate("stops.stopId"); // Populate stop details
      if (!route) {
          return res.status(404).json({ error: "Route not found", route, routeID:routeId  });
      }

      return res.status(200).json({ route });
  } catch (error) {
      console.error("Error fetching route:", error);
      return res.status(500).json({ error: "Failed to fetch route" });
  }
};


export const getAllStops = async (req, res) => {
  try {
      const stops = await Stop.find();
      return res.status(200).json({ stops });
  } catch (error) {
      console.error("Error fetching stops:", error);
      return res.status(500).json({ error: "Failed to fetch stops" });
  }
};

export const getStopsByRoute = async (req, res) => {
  try {
      const { routeId } = req.params;

      const route = await Route.findById(routeId).populate("stops.stopId");
      if (!route) {
          return res.status(404).json({ error: "Route not found", route, routeId });
      }

      return res.status(200).json({ stops: route.stops });
  } catch (error) {
      console.error("Error fetching stops:", error);
      return res.status(500).json({ error: "Failed to fetch stops" });
  }
};
