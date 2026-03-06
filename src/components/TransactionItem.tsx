import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Transaction } from "../database/sqlite";
import { formatCurrency } from "../utils/formatters";

interface TransactionItemProps {
  item: Transaction;
  isLast: boolean;
  onPress: () => void;
}

export default function TransactionItem({ item, isLast, onPress }: TransactionItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} className={`flex-row justify-between items-center ${!isLast ? "border-b border-gray-100 pb-3 mb-3" : ""}`}>
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${item.categoryColor}20` }}>
          <Ionicons name={item.categoryIcon as any} size={18} color={item.categoryColor || "#2563eb"} />
        </View>
        <View>
          <Text className="text-gray-800 font-bold text-base">{item.categoryName}</Text>
          {item.notes ? (
            <Text className="text-gray-400 text-sm" numberOfLines={1}>
              {item.notes}
            </Text>
          ) : null}
        </View>
      </View>
      <Text className={`font-bold ${item.type === "expense" ? "text-red-500" : "text-green-500"}`}>
        {item.type === "expense" ? "-" : "+"}
        {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );
}
