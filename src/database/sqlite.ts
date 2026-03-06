import * as SQLite from "expo-sqlite";

// Define the database variable
let db: SQLite.SQLiteDatabase | null = null;

// Types
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  isDefault: boolean;
}

export interface Transaction {
  id: number;
  amount: number;
  categoryId: number;
  title: string;
  date: string; // ISO String
  type: "income" | "expense";
  notes?: string;
  // Joined fields for display
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
}

// 1. Initialize Database & Tables
export const initDB = async () => {
  try {
    const database = await SQLite.openDatabaseAsync("finwise.db");

    // Enable foreign keys
    await database.execAsync("PRAGMA foreign_keys = ON;");

    // Check if we need to migrate or recreate due to invalid schema earlier
    const tableInfo: any[] = await database.getAllAsync("PRAGMA table_info(Categories)");
    if (tableInfo.length > 0) {
      const hasIsDefault = tableInfo.some((info) => info.name === "isDefault");
      if (!hasIsDefault) {
        console.log("Old schema detected. Dropping tables...");
        await database.execAsync("DROP TABLE IF EXISTS Transactions; DROP TABLE IF EXISTS Categories;");
      }
    }

    // Create Categories Table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        isDefault INTEGER DEFAULT 0
      );
    `);

    // Create Transactions Table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS Transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        categoryId INTEGER NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        notes TEXT,
        FOREIGN KEY (categoryId) REFERENCES Categories (id) ON DELETE RESTRICT
      );
    `);

    db = database; // Assign globally only after success

    // Seed Default Categories if empty
    const cats = await getCategories();
    if (cats.length === 0) {
      await seedDefaultCategories();
    }

    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};

const seedDefaultCategories = async () => {
  if (!db) return;
  const defaultCats = [
    // Expenses
    { name: "Food & Dining", icon: "restaurant-outline", color: "#f59e0b", type: "expense", isDefault: 1 },
    { name: "Transportation", icon: "car-outline", color: "#3b82f6", type: "expense", isDefault: 1 },
    { name: "Shopping", icon: "bag-handle-outline", color: "#ec4899", type: "expense", isDefault: 1 },
    { name: "Entertainment", icon: "game-controller-outline", color: "#8b5cf6", type: "expense", isDefault: 1 },
    { name: "Housing", icon: "home-outline", color: "#10b981", type: "expense", isDefault: 1 },
    { name: "Bills", icon: "receipt-outline", color: "#6366f1", type: "expense", isDefault: 1 },
    { name: "Others", icon: "ellipsis-horizontal-circle-outline", color: "#6b7280", type: "expense", isDefault: 1 },
    // Income
    { name: "Salary", icon: "cash-outline", color: "#10b981", type: "income", isDefault: 1 },
    { name: "Freelance", icon: "laptop-outline", color: "#6366f1", type: "income", isDefault: 1 },
    { name: "Investments", icon: "trending-up-outline", color: "#14b8a6", type: "income", isDefault: 1 },
    { name: "Others", icon: "ellipsis-horizontal-circle-outline", color: "#6b7280", type: "income", isDefault: 1 },
  ];

  for (const cat of defaultCats) {
    await db.runAsync("INSERT INTO Categories (name, icon, color, type, isDefault) VALUES (?, ?, ?, ?, ?)", cat.name, cat.icon, cat.color, cat.type, cat.isDefault);
  }
};

// =======================
// CATEGORY CRUD
// =======================
export const getCategories = async (type?: "income" | "expense"): Promise<Category[]> => {
  if (!db) return [];
  try {
    if (type) {
      return await db.getAllAsync("SELECT * FROM Categories WHERE type = ? ORDER BY id ASC", [type]);
    }
    return await db.getAllAsync("SELECT * FROM Categories ORDER BY type, id ASC");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const addCategory = async (name: string, icon: string, color: string, type: "income" | "expense") => {
  if (!db) return null;
  const result = await db.runAsync("INSERT INTO Categories (name, icon, color, type, isDefault) VALUES (?, ?, ?, ?, 0)", [name, icon, color, type]);
  return result.lastInsertRowId;
};

export const deleteCategory = async (id: number) => {
  if (!db) return false;

  // Prevent deleting default categories
  const cat: any = await db.getFirstAsync("SELECT isDefault FROM Categories WHERE id = ?", [id]);
  if (cat?.isDefault === 1) {
    throw new Error("Cannot delete default categories");
  }

  // Check if category is used in transactions
  const count: any = await db.getFirstAsync("SELECT COUNT(*) as count FROM Transactions WHERE categoryId = ?", id);
  if (count?.count > 0) {
    throw new Error("Cannot delete category because it is used in existing transactions");
  }

  await db.runAsync("DELETE FROM Categories WHERE id = ?", id);
  return true;
};

// =======================
// TRANSACTION CRUD
// =======================
export const getTransactions = async (limit: number = 50): Promise<Transaction[]> => {
  if (!db) return [];
  try {
    return await db.getAllAsync(
      `SELECT t.*, c.name as categoryName, c.icon as categoryIcon, c.color as categoryColor 
       FROM Transactions t
       JOIN Categories c ON t.categoryId = c.id
       ORDER BY date DESC
       LIMIT ?`,
      limit,
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const addTransaction = async (amount: number, categoryId: number, title: string, date: string, type: "income" | "expense", notes?: string) => {
  if (!db) return null;
  const result = await db.runAsync("INSERT INTO Transactions (amount, categoryId, title, date, type, notes) VALUES (?, ?, ?, ?, ?, ?)", amount, categoryId, title, date, type, notes || null);
  return result.lastInsertRowId;
};

export const deleteTransaction = async (id: number) => {
  if (!db) return false;
  await db.runAsync("DELETE FROM Transactions WHERE id = ?", id);
  return true;
};

export const getTransactionById = async (id: number): Promise<Transaction | null> => {
  if (!db) return null;
  try {
    return await db.getFirstAsync(
      `SELECT t.*, c.name as categoryName, c.icon as categoryIcon, c.color as categoryColor 
       FROM Transactions t
       JOIN Categories c ON t.categoryId = c.id
       WHERE t.id = ?`,
      id,
    );
  } catch (error) {
    console.error("Error fetching transaction by id:", error);
    return null;
  }
};

export const updateTransaction = async (id: number, amount: number, categoryId: number, title: string, date: string, type: "income" | "expense", notes?: string) => {
  if (!db) return false;
  await db.runAsync("UPDATE Transactions SET amount = ?, categoryId = ?, title = ?, date = ?, type = ?, notes = ? WHERE id = ?", amount, categoryId, title, date, type, notes || null, id);
  return true;
};

export const getBalanceSummary = async () => {
  if (!db) return { totalIncome: 0, totalExpense: 0, balance: 0 };

  try {
    const income: any = await db.getFirstAsync("SELECT SUM(amount) as total FROM Transactions WHERE type = 'income'");
    const expense: any = await db.getFirstAsync("SELECT SUM(amount) as total FROM Transactions WHERE type = 'expense'");

    const totalIncome = income?.total || 0;
    const totalExpense = expense?.total || 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  } catch (error) {
    console.error("Error calculating balance summary:", error);
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
};

export const getTransactionsByDateRange = async (startDate: string, endDate: string): Promise<Transaction[]> => {
  if (!db) return [];
  try {
    return await db.getAllAsync(
      `SELECT t.*, c.name as categoryName, c.icon as categoryIcon, c.color as categoryColor 
       FROM Transactions t
       JOIN Categories c ON t.categoryId = c.id
       WHERE t.date >= ? AND t.date <= ?
       ORDER BY t.date DESC`,
      startDate,
      endDate,
    );
  } catch (error) {
    console.error("Error fetching transactions by date range:", error);
    return [];
  }
};

export const getBalanceSummaryByDateRange = async (startDate: string, endDate: string) => {
  if (!db) return { totalIncome: 0, totalExpense: 0, balance: 0 };

  try {
    const income: any = await db.getFirstAsync("SELECT SUM(amount) as total FROM Transactions WHERE type = 'income' AND date >= ? AND date <= ?", startDate, endDate);
    const expense: any = await db.getFirstAsync("SELECT SUM(amount) as total FROM Transactions WHERE type = 'expense' AND date >= ? AND date <= ?", startDate, endDate);

    const totalIncome = income?.total || 0;
    const totalExpense = expense?.total || 0;

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  } catch (error) {
    console.error("Error calculating balance summary by range:", error);
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
};
