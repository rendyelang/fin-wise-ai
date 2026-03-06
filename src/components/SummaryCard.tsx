import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PeriodSummaryCardData } from "../types";
import { formatCurrency } from "../utils/formatters";

interface SummaryCardProps {
  card: PeriodSummaryCardData;
  onPress: () => void;
}

export default function SummaryCard({ card, onPress }: SummaryCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} className={`bg-white rounded-2xl p-4 shadow-sm mb-3 ${card.isCurrent ? "border border-blue-500" : "border border-gray-100"}`}>
      <View className="flex-row items-center mb-1">
        <Text className="text-gray-800 font-bold text-base mr-2">{card.label}</Text>
        {card.isCurrent && (
          <View className="bg-gray-100 rounded-md px-2 py-0.5">
            <Text className="text-gray-600 text-xs font-semibold">Current</Text>
          </View>
        )}
      </View>
      <Text className="text-gray-400 text-xs mb-3">{card.sublabel}</Text>
      <View className="flex-row justify-between">
        <View>
          <Text className="text-gray-400 text-xs">Income</Text>
          <Text className="text-green-600 font-bold">{formatCurrency(card.income)}</Text>
        </View>
        <View>
          <Text className="text-gray-400 text-xs">Expense</Text>
          <Text className="text-red-500 font-bold">{formatCurrency(card.expense)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
