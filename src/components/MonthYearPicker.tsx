import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MonthYearPickerProps {
  visible: boolean;
  selectedMonth: number; // 0-indexed
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}

export default function MonthYearPicker({ visible, selectedMonth, selectedYear, onSelect, onClose }: MonthYearPickerProps) {
  const [displayYear, setDisplayYear] = React.useState(selectedYear);

  React.useEffect(() => {
    if (visible) setDisplayYear(selectedYear);
  }, [visible, selectedYear]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.yearRow}>
            <TouchableOpacity onPress={() => setDisplayYear((y) => y - 1)}>
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.yearText}>{displayYear}</Text>
            <TouchableOpacity onPress={() => setDisplayYear((y) => y + 1)}>
              <Ionicons name="chevron-forward" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.monthsGrid}>
            {MONTHS.map((label, index) => {
              const isSelected = index === selectedMonth && displayYear === selectedYear;
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.monthBtn, isSelected && styles.monthBtnActive]}
                  onPress={() => {
                    onSelect(index, displayYear);
                    onClose();
                  }}
                >
                  <Text style={[styles.monthText, isSelected && styles.monthTextActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  yearRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1c64f2",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  yearText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthBtn: {
    width: "30%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  monthBtnActive: {
    backgroundColor: "#1c64f2",
    borderColor: "#1c64f2",
  },
  monthText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  monthTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
