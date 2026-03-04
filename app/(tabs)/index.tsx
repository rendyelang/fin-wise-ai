import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Transaction, getBalanceSummary, getTransactions } from "../../src/database/sqlite";

// --- HELPER FUNCTION ---
const formatCurrency = (amount: number) => {
  return `Rp ${Math.abs(amount).toLocaleString("id-ID")}`;
};

type GroupedTransactions = {
  date: string;
  dailyExpense: number;
  items: Transaction[];
};

export default function Home() {
  const router = useRouter();

  const [balanceSummary, setBalanceSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [groupedTx, setGroupedTx] = useState<GroupedTransactions[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, []),
  );

  const loadDashboardData = async () => {
    try {
      const summary = await getBalanceSummary();
      setBalanceSummary(summary);

      const txs = await getTransactions(100);

      // Group by formatted date
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

      const sectioned = Object.keys(grouped).map((key) => ({
        date: key,
        dailyExpense: grouped[key].dailyExpense,
        items: grouped[key].items,
      }));

      setGroupedTx(sectioned);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    }
  };

  const currentMonthYear = new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" });

  return (
    <View className="flex-1 bg-gray-50">
      {/* --- HEADER WARNA BIRU --- */}
      <View className="bg-blue-600 pt-16 pb-20 px-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-semibold">{currentMonthYear}</Text>
          <View className="flex-row space-x-4">
            <Ionicons name="search" size={24} color="white" />
            <Ionicons name="calendar-outline" size={24} color="white" />
          </View>
        </View>
      </View>

      {/* --- KARTU SALDO & RINGKASAN --- */}
      <View className="px-6 -mt-14">
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <Text className="text-gray-500 font-medium mb-1">Total Balance</Text>
          <Text className="text-3xl font-bold text-gray-900 mb-6">
            {balanceSummary.balance < 0 ? "-" : ""}
            {formatCurrency(balanceSummary.balance)}
          </Text>

          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <View className="bg-green-100 p-2 rounded-full mr-3">
                <Ionicons name="arrow-up" size={16} color="#16a34a" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs">Income</Text>
                <Text className="text-green-600 font-bold">{formatCurrency(balanceSummary.totalIncome)}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-red-100 p-2 rounded-full mr-3">
                <Ionicons name="arrow-down" size={16} color="#dc2626" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs">Expense</Text>
                <Text className="text-red-600 font-bold">{formatCurrency(balanceSummary.totalExpense)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* --- KARTU AI HIGHLIGHT --- */}
      <View className="px-6 mt-4">
        <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex-row items-center shadow-sm">
          <View className="bg-blue-200 p-2 rounded-full mr-3">
            <Ionicons name="sparkles" size={20} color="#2563eb" />
          </View>
          <View className="flex-1">
            <Text className="text-blue-900 font-semibold text-sm">FinWise AI Insight</Text>
            <Text className="text-blue-700 text-xs mt-1">Your spending tracker is active! Start adding transactions and I will analyze your habits soon.</Text>
          </View>
        </View>
      </View>

      {/* --- TRANSACTIONS LIST --- */}
      <ScrollView className="flex-1 px-6 mt-4" showsVerticalScrollIndicator={false}>
        {groupedTx.length === 0 ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-gray-400 text-sm">No transactions yet. Click + to add one!</Text>
          </View>
        ) : (
          groupedTx.map((day, index) => (
            <View key={index} className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-400 font-semibold text-sm">{day.date}</Text>
                {day.dailyExpense > 0 && <Text className="text-red-400 font-semibold text-sm">-{formatCurrency(day.dailyExpense)}</Text>}
              </View>

              <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {day.items.map((item, idx) => (
                  <View key={item.id} className={`flex-row justify-between items-center ${idx !== day.items.length - 1 ? "border-b border-gray-100 pb-3 mb-3" : ""}`}>
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${item.categoryColor}20` }}>
                        <Ionicons name={item.categoryIcon as any} size={18} color={item.categoryColor || "#2563eb"} />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-bold text-base">{item.title || item.categoryName}</Text>
                        <Text className="text-gray-400 text-xs">{item.categoryName}</Text>
                      </View>
                    </View>
                    <Text className={`font-bold ${item.type === "expense" ? "text-red-500" : "text-green-500"}`}>
                      {item.type === "expense" ? "-" : "+"}
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
        <View className="h-24" />
      </ScrollView>

      {/* --- FAB --- */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg" onPress={() => router.push("/add-transaction")} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
