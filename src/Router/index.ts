import { Router } from "express";
import userRouter from "./userRouter";
import cashFlowRouter from "./cashFlowRouter";

const router = Router();

router.use(userRouter);
router.use(cashFlowRouter)

export default router;
