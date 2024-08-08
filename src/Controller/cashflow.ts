import { Request, Response } from "express";
import * as cashFlowService from "../Service/cashflow";

function isError(err: unknown): err is Error {
  return err instanceof Error;
}

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const getTransactions = await cashFlowService.getAllTransactions();
    res.status(200).json(getTransactions);
  } catch (error) {
    if (isError(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknwon error occured" });
    }
  }
};

export const getUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const getUserId = await cashFlowService.getTransactionsUser(userId);
    res.status(200).json(getUserId);
  } catch (error) {
    if (isError(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknwon error occured" });
    }
  }
};

export const addTransaction = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const { amount, category, note, inflow, outflow } = req.body;
    const addTransaction = await cashFlowService.addTransaction(userId, amount, category, note, inflow, outflow);
    res.status(200).json(addTransaction);
  } catch (error) {
    if (isError(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknwon error occured" });
    }
  }
};

export const summaryCashflow = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const summary = await cashFlowService.summaryCashflow(userId);
    res.status(200).json(summary);
  } catch (error) {
    if (isError(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknwon error occured" });
    }
  }
};
