import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CategoryGrid from "../src/components/CategoryGrid";
import ConfirmModal from "../src/components/ConfirmModal";
import CustomKeypad from "../src/components/CustomKeypad";
import SegmentedControl from "../src/components/SegmentedControl";
import { Category, addTransaction, deleteTransaction, getCategories, getTransactionById, updateTransaction } from "../src/database/sqlite";

export default function AddTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const editId = params.id ? Number(params.id) : null;
  const isEditMode = editId !== null;

  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isReady, setIsReady] = useState(!isEditMode);

  // Modal States
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);

  // Format displayed date
  useEffect(() => {
    const formatted = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " " + date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    setCurrentDate(formatted);
  }, [date]);

  // Load existing transaction data when editing
  useEffect(() => {
    if (isEditMode) {
      loadExistingTransaction();
    }
  }, []);

  // Reload categories when screen gains focus or type changes
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [type]),
  );

  const loadExistingTransaction = async () => {
    try {
      const tx = await getTransactionById(editId!);
      if (!tx) {
        setErrorModal({ title: "Error", message: "Transaction not found" });
        return;
      }
      setType(tx.type);
      setAmount(String(tx.amount));
      setNotes(tx.notes || "");
      setDate(new Date(tx.date));
      setSelectedCategory(tx.categoryId);
      setIsReady(true);
    } catch (error) {
      console.error("Failed to load transaction", error);
      Alert.alert("Error", "Could not load transaction.");
      router.back();
    }
  };

  const loadCategories = async () => {
    try {
      const dbCategories = await getCategories(type);
      setCategories(dbCategories);
      // Only auto-select first category in add mode
      if (!isEditMode && dbCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(dbCategories[0].id);
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
      setErrorModal({ title: "Invalid Input", message: "Please enter a valid amount" });
      return;
    }
    if (!selectedCategory) {
      setErrorModal({ title: "Invalid Input", message: "Please select a category" });
      return;
    }

    try {
      const dateString = date.toISOString();
      const numAmount = Number(amount);
      const catName = categories.find((c) => c.id === selectedCategory)?.name || "Transaction";

      if (isEditMode) {
        await updateTransaction(editId!, numAmount, selectedCategory, catName, dateString, type, notes);
      } else {
        await addTransaction(numAmount, selectedCategory, catName, dateString, type, notes);
      }
      router.back(); // No confirmation popup for success, just go back immediately
    } catch (error) {
      console.error("Failed to save transaction", error);
      setErrorModal({ title: "Error", message: "Could not save transaction." });
    }
  };

  const executeDelete = async () => {
    try {
      await deleteTransaction(editId!);
      setDeleteModalVisible(false);
      router.back();
    } catch (error) {
      console.error("Failed to delete transaction", error);
      setDeleteModalVisible(false);
      setErrorModal({ title: "Error", message: "Could not delete transaction." });
    }
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }
    if (event.type === "dismissed") return;
    if (selectedDate) {
      setDate(selectedDate);
      // After picking date, show time picker on Android
      if (Platform.OS !== "ios") {
        setShowTimePicker(true);
      }
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    if (Platform.OS !== "ios") {
      setShowTimePicker(false);
    }
    if (event.type === "dismissed") return;
    if (selectedTime) {
      const updated = new Date(date);
      updated.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(updated);
    }
  };

  if (!isReady) return null;

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
          {isEditMode ? (
            <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconBtn} />
          )}
        </View>

        <SegmentedControl type={type} setType={setType} />
      </View>

      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}
      {showTimePicker && <DateTimePicker value={date} mode="time" display="default" onChange={onChangeTime} is24Hour />}

      <View style={styles.contentWrapper}>
        <View style={styles.amountArea}>
          <Text style={styles.currencyPrefix}>Rp </Text>
          <Text style={styles.amountDisplay}>{displayAmount}</Text>
        </View>
        <View style={styles.separator} />

        <CategoryGrid categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} onCustomPress={() => router.push("/categories")} />

        <View style={styles.noteContainer}>
          <Ionicons name="document-text-outline" size={20} color="#737373" />
          <TextInput style={styles.noteInput} placeholder="Add note" placeholderTextColor="#a3a3a3" value={notes} onChangeText={setNotes} maxLength={80} />
          <Text style={styles.noteCount}>{notes.length}/80</Text>
        </View>
      </View>

      <CustomKeypad onKeyPress={handleKeyPress} onSave={handleSave} />

      {/* Modals */}
      <ConfirmModal
        visible={deleteModalVisible}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />

      <ConfirmModal
        visible={errorModal !== null}
        title={errorModal?.title || "Error"}
        message={errorModal?.message || "An unexpected error occurred."}
        confirmText="OK"
        onConfirm={() => setErrorModal(null)}
        onCancel={() => setErrorModal(null)}
      />
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
    paddingBottom: 14,
    paddingHorizontal: 16,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 14,
    marginBottom: 6,
  },
  currencyPrefix: {
    fontSize: 28,
    fontWeight: "700",
    color: "#171717",
  },
  amountDisplay: {
    fontSize: 32,
    fontWeight: "700",
    color: "#171717",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginBottom: 8,
    marginHorizontal: 10,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 5,
    marginBottom: 6,
    height: 44,
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
