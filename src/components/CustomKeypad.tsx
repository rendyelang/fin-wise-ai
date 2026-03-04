import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CustomKeypadProps {
  onKeyPress: (key: string) => void;
  onSave: () => void;
}

export default function CustomKeypad({ onKeyPress, onSave }: CustomKeypadProps) {
  return (
    <View style={styles.keypadWrapper}>
      <View style={styles.keypadRow}>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("1")}>
          <Text style={styles.keypadTxt}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("2")}>
          <Text style={styles.keypadTxt}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("3")}>
          <Text style={styles.keypadTxt}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} disabled>
          <Text style={styles.keypadTxtMath}>÷</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.keypadRow}>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("4")}>
          <Text style={styles.keypadTxt}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("5")}>
          <Text style={styles.keypadTxt}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("6")}>
          <Text style={styles.keypadTxt}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} disabled>
          <Text style={styles.keypadTxtMath}>×</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.keypadRow}>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("7")}>
          <Text style={styles.keypadTxt}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("8")}>
          <Text style={styles.keypadTxt}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("9")}>
          <Text style={styles.keypadTxt}>9</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} disabled>
          <Text style={styles.keypadTxtMath}>-</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.keypadRow}>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("000")}>
          <Text style={styles.keypadTxt}>000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("0")}>
          <Text style={styles.keypadTxt}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} onPress={() => onKeyPress("backspace")}>
          <Ionicons name="backspace-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadBtn} disabled>
          <Text style={styles.keypadTxtMath}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveSubmitBtn} onPress={onSave}>
        <Text style={styles.saveSubmitTxt}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  keypadWrapper: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  keypadBtn: {
    width: "23%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  keypadTxt: {
    fontSize: 26,
    color: "#171717",
  },
  keypadTxtMath: {
    fontSize: 26,
    color: "#171717",
  },
  saveSubmitBtn: {
    backgroundColor: "#1c64f2",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveSubmitTxt: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
