<<<<<<< HEAD
import jwt from 'jsonwebtoken';


export const verifyToken = ( request, response, next) => {
    const token = request.cookies.jwt;
    if(!token) return response.status(401).send("You are not authenticated!");
    jwt.verify(token, process.env.JWT_KEY, async(err, payload) => {
        if(err) return response.status(403).send("Token is not valid!");
        request.userId = payload.userId;
        next();
    })
};
=======
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt;
  if (!token) return response.status(401).send("You are not authenticated!");
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return response.status(403).send("Token is not valid!");
    request.userId = payload.userId;
    next();
  });
};

export const restrict = (roles) => {
  return async function (req, res, next) {
    const identity = req.identity;
    const admin = await User.findById(identity);

    if (admin.role != "admin") {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
    next();
  };
};
>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1
