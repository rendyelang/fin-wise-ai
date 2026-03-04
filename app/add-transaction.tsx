import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CategoryGrid from "../src/components/CategoryGrid";
import CustomKeypad from "../src/components/CustomKeypad";
import SegmentedControl from "../src/components/SegmentedControl";
import { Category, addTransaction, getCategories } from "../src/database/sqlite";

export default function AddTransactionScreen() {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const formatted =
      date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    setCurrentDate(formatted);
  }, [date]);

  useEffect(() => {
    loadCategories();
  }, [type]);

  const loadCategories = async () => {
    try {
      const dbCategories = await getCategories(type);
      setCategories(dbCategories);
      if (dbCategories.length > 0) {
        setSelectedCategory(dbCategories[0].id);
      } else {
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (key === "000") {
      if (amount.length > 0) {
        setAmount((prev) => prev + "000");
      }
    } else {
      setAmount((prev) => prev + key);
    }
  };

  const displayAmount = amount ? parseInt(amount, 10).toLocaleString("id-ID") : "0";

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert("Invalid Input", "Please enter a valid amount");
      return;
    }
    if (!selectedCategory) {
      Alert.alert("Invalid Input", "Please select a category");
      return;
    }

    try {
      const dateString = date.toISOString();
      const numAmount = Number(amount);
      const catName = categories.find((c) => c.id === selectedCategory)?.name || "Transaction";

      await addTransaction(numAmount, selectedCategory, catName, dateString, type, notes);
      Alert.alert("Success", "Transaction added successfully!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) {
      console.error("Failed to save transaction", error);
      Alert.alert("Error", "Could not save transaction.");
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Ionicons name="chevron-down" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          <View style={styles.iconBtn} />
        </View>

        <SegmentedControl type={type} setType={setType} />
      </View>

      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}

      <ScrollView style={styles.contentWrapper} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View style={styles.amountArea}>
          <Text style={styles.currencyPrefix}>Rp </Text>
          <Text style={styles.amountDisplay}>{displayAmount}</Text>
        </View>
        <View style={styles.separator} />

        <CategoryGrid categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <View style={styles.noteContainer}>
          <Ionicons name="document-text-outline" size={20} color="#737373" />
          <TextInput style={styles.noteInput} placeholder="Add note" placeholderTextColor="#a3a3a3" value={notes} onChangeText={setNotes} maxLength={80} />
          <Text style={styles.noteCount}>{notes.length}/80</Text>
        </View>
      </ScrollView>

      <CustomKeypad onKeyPress={handleKeyPress} onSave={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#1c64f2",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  amountArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: "700",
    color: "#171717",
  },
  amountDisplay: {
    fontSize: 36,
    fontWeight: "700",
    color: "#171717",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: "auto",
    marginBottom: 10,
    height: 50,
  },
  noteInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#171717",
  },
  noteCount: {
    fontSize: 12,
    color: "#a3a3a3",
  },
});
