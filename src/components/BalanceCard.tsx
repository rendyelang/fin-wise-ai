import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { BalanceSummary } from "../types";
import { formatCurrency } from "../utils/formatters";

interface BalanceCardProps {
  summary: BalanceSummary;
}

export default function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <View>
      <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <Text className="text-gray-500 font-medium mb-1">Total</Text>
        <Text className="text-3xl font-bold text-gray-900 mb-6">
          {summary.balance < 0 ? "-" : ""}
          {formatCurrency(summary.balance)}
        </Text>
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <View className="bg-green-100 p-2 rounded-full mr-3">
              <Ionicons name="arrow-up" size={16} color="#16a34a" />
            </View>
            <View>
              <Text className="text-gray-400 text-xs">Income</Text>
              <Text className="text-green-600 font-bold">{formatCurrency(summary.totalIncome)}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="bg-red-100 p-2 rounded-full mr-3">
              <Ionicons name="arrow-down" size={16} color="#dc2626" />
            </View>
            <View>
              <Text className="text-gray-400 text-xs">Expense</Text>
              <Text className="text-red-600 font-bold">{formatCurrency(summary.totalExpense)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
