import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, loading = false, icon, color = "#4f46e5", style }: PrimaryButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.8} style={[styles.btn, { backgroundColor: color }, loading && styles.btnDisabled, style]}>
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <Text style={styles.label}>{label}</Text>
          {icon && <Ionicons name={icon} size={22} color="#fff" style={styles.icon} />}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    marginTop: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  btnDisabled: { opacity: 0.6 },
  label: { color: "#fff", fontSize: 18, fontWeight: "700" },
  icon: { marginLeft: 8 },
});
