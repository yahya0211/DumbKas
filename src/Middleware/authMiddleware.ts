import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("token required").json({
      status: false,
    });
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY || "secret") as User;

  if (!decoded) {
    return res.status(403).json({
      status: false,
      message: "Unauthorized",
    });
  }


  res.locals.userId = decoded.id;

  next();
};

export default authentication;
