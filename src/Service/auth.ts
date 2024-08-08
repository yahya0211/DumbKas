import prisma from "../Database/index";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const getUser = async () => {
  try {
    const getAllUsers = await prisma.$queryRaw`SELECT * FROM "public"."User"`;

    return getAllUsers;
  } catch (error) {
    console.log("Error get all user", error);
    throw error;
  }
};

export const register = async (email: string, password: string, fullname: string, userId: string) => {
  try {
    const isExist: any = await prisma.$queryRaw`SELECT * FROM "User" WHERE "email" = ${email}`;

    if (isExist > 0) {
      throw new Error("Email is already exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$queryRaw`INSERT INTO "User"("id", "fullname", "email", "password") VALUES (${uuidv4()}, ${fullname}, ${email}, ${hashPassword})`;

    const result = await prisma.$queryRaw`SELECT u.id AS "userId", u.fullname, u.email, c.id AS "userId", c.amount, c."Date", c.category, c.note, c.inflow, c.outflow, c.balance, c.summary
    FROM "CashFlow" c INNER JOIN "User" u ON u.id = c."userId"
    WHERE u.id = ${userId}
    `;
    return user;
  } catch (error) {
    console.log("Error during registration:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const emailUser = await prisma.$queryRaw<any[]>`SELECT "id", "email", "password", "fullname" FROM "public"."User" WHERE "email" = ${email}`;

    if (emailUser.length === 0) {
      throw new Error("User not found");
    }

    const user = emailUser[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id, email: user.email, fullname: user.fullname }, process.env.SECRET_KEY!, {
      expiresIn: "1d",
    });

    return {
      token,
      message: "Login successful",
    };
  } catch (error) {
    console.log("Error during login", error);
    throw error;
  }
};
