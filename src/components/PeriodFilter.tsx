import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

const PERIODS: { label: string; value: PeriodType }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

interface PeriodFilterProps {
  selected: PeriodType;
  onSelect: (period: PeriodType) => void;
}

export default function PeriodFilter({ selected, onSelect }: PeriodFilterProps) {
  return (
    <View style={styles.container}>
      {PERIODS.map((p) => {
        const isActive = selected === p.value;
        return (
          <TouchableOpacity key={p.value} style={[styles.tab, isActive && styles.tabActive]} onPress={() => onSelect(p.value)}>
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Glass effect background
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)", // Translucent white for inactive text
  },
  tabTextActive: {
    color: "#2563eb", // Blue-600 to match the new header
  },
});
