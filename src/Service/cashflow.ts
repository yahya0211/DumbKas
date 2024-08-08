import prisma from "../Database";
import { v4 as uuidv4 } from "uuid";

const convertBigIntToString = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === "bigint") {
        (acc as any)[key] = value.toString();
      } else if (value instanceof Date) {
        (acc as any)[key] = value.toISOString();
      } else {
        (acc as any)[key] = convertBigIntToString(value);
      }
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
};

export const getAllTransactions = async () => {
  try {
    const getAllTransactions = await prisma.$queryRaw`SELECT * FROM "public"."CashFlow"`;
    return convertBigIntToString(getAllTransactions);
  } catch (error) {
    console.log("Error get all transactions", error);
    throw error;
  }
};

export const getTransactionsUser = async (userId: string) => {
  try {
    const getUserId = await prisma.$queryRaw`SELECT * FROM "public"."CashFlow" WHERE "userId" = ${userId}`;
    return convertBigIntToString(getUserId);
  } catch (error) {
    console.log("Error get transactions user:", error);
    throw error;
  }
};

export const addTransaction = async (userId: string, amount: number, category: string, note: string, inflow: number, outflow: number) => {
  try {
    const findUser = await prisma.$queryRaw`SELECT * FROM "public"."User" WHERE "id" = ${userId}`;

    if (!findUser) {
      throw new Error("User not found");
    }

    const latestBalanceQuery: any = await prisma.$queryRaw`
      SELECT "balance" FROM "public"."CashFlow" WHERE "userId" = ${userId} ORDER BY "Date" DESC LIMIT 1
    `;
    console.log(latestBalanceQuery);

    const latestBalance = BigInt(latestBalanceQuery[0]?.balance || 0);

    if (amount < 0) {
      const outflow = BigInt(amount);
      const newBalance = latestBalance + outflow;
      const updateBalance = await prisma.$queryRaw`
        INSERT INTO "public"."CashFlow"(
          "id", "amount", "Date", "category", "note", "inflow", "outflow", "balance", "summary", "userId"
        ) VALUES (
          ${uuidv4()}::uuid, ${BigInt(amount)}::bigint, NOW(), ${category}::text, ${note}::text, 0::bigint, ${BigInt(outflow)}::bigint, ${BigInt(newBalance)}::bigint, ${BigInt(outflow)}::bigint, ${userId}::uuid
        )
      `;
      return updateBalance;
    }

    if (amount > 0) {
      const inflow = BigInt(amount);
      const newBalance = latestBalance + inflow;
      const updateBalance = await prisma.$queryRaw`
        INSERT INTO "public"."CashFlow"(
          "id", "amount", "Date", "category", "note", "inflow", "outflow", "balance", "summary", "userId"
        ) VALUES (
          ${uuidv4()}::uuid, ${BigInt(amount)}::bigint, NOW(), ${category}::text, ${note}::text, ${BigInt(inflow)}::bigint, 0::bigint, ${BigInt(newBalance)}::bigint, ${BigInt(inflow)}::bigint, ${userId}::uuid
        )
      `;
      return updateBalance;
    }
  } catch (error) {
    console.log("Error insert transaction:", error);
    throw error;
  }
};

export const summaryCashflow = async (userId: string) => {
  try {
    const summary = await prisma.$queryRaw`SELECT SUM("inflow") AS "inflow", SUM("outflow") AS "outflow" FROM "public"."CashFlow" WHERE "userId" = ${userId}`;
    return summary;
  } catch (error) {
    console.log("Error summary cashflow:", error);
    throw error;
  }
};
