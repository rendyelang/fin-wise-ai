import { Transaction } from "../database/sqlite";

/**
 * Shared type definitions used across the app.
 */

export type GroupedTransactions = {
  date: string;
  dailyExpense: number;
  items: Transaction[];
};

export type PeriodSummaryCardData = {
  label: string;
  sublabel: string;
  isCurrent: boolean;
  income: number;
  expense: number;
  startDate: string;
  endDate: string;
};

export type BalanceSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};
