import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  titleAccent: string;
  subtitle: string;
  showBrand?: boolean;
  showBack?: boolean;
  onBack?: () => void;
}

export default function AuthHeader({ title, titleAccent, subtitle, showBrand = false, showBack = false, onBack }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Decorative circles */}
      <View style={styles.deco1} />
      <View style={styles.deco2} />

      {showBack && onBack && (
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {showBrand && (
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Ionicons name="logo-electron" size={22} color="#fff" />
          </View>
          <Text style={styles.brandLabel}>FINWISE AI</Text>
        </View>
      )}

      <Text style={styles.title}>
        {title}
        {"\n"}
        <Text style={styles.accent}>{titleAccent}</Text>
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1e1b4b",
    paddingTop: 68,
    paddingBottom: 100,
    paddingHorizontal: 28,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  deco1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(99,102,241,0.15)",
  },
  deco2: {
    position: "absolute",
    bottom: 10,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(6,182,212,0.1)",
  },
  backBtn: {
    backgroundColor: "rgba(79,70,229,0.35)",
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 14,
    marginBottom: 20,
  },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  brandIcon: {
    backgroundColor: "#06b6d4",
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  brandLabel: {
    color: "#06b6d4",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
  },
  title: { color: "#fff", fontSize: 38, fontWeight: "900", lineHeight: 46 },
  accent: { color: "#06b6d4" },
  subtitle: { color: "#a5b4fc", fontSize: 16, marginTop: 10, lineHeight: 22 },
});
