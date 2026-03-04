import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SegmentedControlProps {
  type: "expense" | "income";
  setType: (type: "expense" | "income") => void;
}

export default function SegmentedControl({ type, setType }: SegmentedControlProps) {
  return (
    <View style={styles.segmentedControl}>
      <TouchableOpacity style={[styles.segmentBtn, type === "expense" && styles.segmentBtnActive]} onPress={() => setType("expense")}>
        <Text style={[styles.segmentText, type === "expense" && styles.segmentTextExpenseActive]}>Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.segmentBtn, type === "income" && styles.segmentBtnActive]} onPress={() => setType("income")}>
        <Text style={[styles.segmentText, type === "income" && styles.segmentTextIncomeActive]}>Income</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 2,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: "#ffffff",
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#bfdbfe",
  },
  segmentTextExpenseActive: {
    color: "#ef4444",
  },
  segmentTextIncomeActive: {
    color: "#10b981",
  },
});
