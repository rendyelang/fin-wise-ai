import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const COLORS = {
  muted: "#6b7280",
  border: "#e5e7eb",
  focusBorder: "#06b6d4",
  inputBg: "#f9fafb",
  focusBg: "#f0fdfa",
  text: "#1f2937",
};

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  showToggle?: boolean;
}

export default function FormInput({ label, placeholder, value, onChangeText, icon, keyboardType = "default", autoCapitalize = "sentences", secureTextEntry = false, showToggle = false }: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, isFocused && styles.inputRowFocused]}>
        <Ionicons name={icon} size={20} color={isFocused ? COLORS.focusBorder : COLORS.muted} style={styles.icon} />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.textInput}
          placeholderTextColor="#9ca3af"
        />
        {showToggle && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.eyeBtn}>
            <Ionicons name={isSecure ? "eye-outline" : "eye-off-outline"} size={22} color={isFocused ? COLORS.focusBorder : COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    height: 56,
    paddingHorizontal: 14,
  },
  inputRowFocused: {
    borderColor: COLORS.focusBorder,
    backgroundColor: COLORS.focusBg,
  },
  icon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 16, color: COLORS.text, height: "100%" },
  eyeBtn: { padding: 6 },
});
