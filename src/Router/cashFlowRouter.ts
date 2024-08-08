import { Router } from "express";
import { addTransaction, getAllTransactions, getUserId, summaryCashflow } from "../Controller/cashflow";
import authentication from "../Middleware/authMiddleware";
const cashFlowRouter = Router();

cashFlowRouter.get("/getAllTransactions", getAllTransactions);
cashFlowRouter.get("/getAllTransactions/:userId", getUserId);
cashFlowRouter.post("/addTransaction", authentication, addTransaction);
cashFlowRouter.get("/summaryTransaction", authentication, summaryCashflow)

export default cashFlowRouter;
