import { Request, Response, NextFunction } from "express";
import * as userService from "../Service/auth";

function isError(err: unknown): err is Error {
  return err instanceof Error;
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const getAll = await userService.getUser();
    res.status(200).json(getAll);
  } catch (error) {
    if (isError(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknwon error occured" });
    }
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullname, userId } = req.body;
    const result = await userService.register(email, password, fullname, userId);

    res.json({
      status: true,
      message: "success",
      result,
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);

    res.json({
      status: true,
      message: "success",
      result,
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
  }
};
