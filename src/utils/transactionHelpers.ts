import { Transaction } from "../database/sqlite";
import { GroupedTransactions } from "../types";

/**
 * Groups a flat list of transactions by formatted date string.
 */
export const groupTransactionsByDate = (txs: Transaction[]): GroupedTransactions[] => {
  const grouped: Record<string, { dailyExpense: number; items: Transaction[] }> = {};

  txs.forEach((t) => {
    const d = new Date(t.date);
    const dateKey = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    if (!grouped[dateKey]) {
      grouped[dateKey] = { dailyExpense: 0, items: [] };
    }

    grouped[dateKey].items.push(t);
    if (t.type === "expense") {
      grouped[dateKey].dailyExpense += t.amount;
    }
  });

  return Object.keys(grouped).map((key) => ({
    date: key,
    dailyExpense: grouped[key].dailyExpense,
    items: grouped[key].items,
  }));
};
