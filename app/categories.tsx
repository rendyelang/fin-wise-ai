import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ConfirmModal from "../src/components/ConfirmModal";
import { Category, addCategory, deleteCategory, getCategories } from "../src/database/sqlite";

const DEFAULT_COLOR = "#1c64f2";
const ICONS = ["cash-outline", "cart-outline", "restaurant-outline", "car-outline", "home-outline", "game-controller-outline", "laptop-outline", "heart-outline", "gift-outline", "airplane-outline", "bus-outline"];

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState(ICONS[0]);

  // Confirm Modal States
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    loadCategories();
  }, [activeTab]);

  const loadCategories = async () => {
    try {
      const data = await getCategories(activeTab);
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      setErrorModal({ title: "Invalid Input", message: "Please enter a category name" });
      return;
    }
    try {
      await addCategory(newName, newIcon, DEFAULT_COLOR, activeTab);
      setModalVisible(false);
      setNewName("");
      loadCategories();
    } catch (error) {
      setErrorModal({ title: "Error", message: "Failed to add category" });
    }
  };

  const executeDeleteCategory = async () => {
    if (deleteCategoryId === null) return;
    try {
      await deleteCategory(deleteCategoryId);
      loadCategories();
      setDeleteCategoryId(null);
    } catch (error: any) {
      setDeleteCategoryId(null);
      setErrorModal({ title: "Error", message: error.message || "Failed to delete category" });
    }
  };

  const handleDeleteCategory = (id: number) => {
    setDeleteCategoryId(id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="chevron-back" size={28} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Categories</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={28} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === "expense" && styles.activeTab]} onPress={() => setActiveTab("expense")}>
          <Text style={[styles.tabText, activeTab === "expense" && styles.activeTabText]}>Expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === "income" && styles.activeTab]} onPress={() => setActiveTab("income")}>
          <Text style={[styles.tabText, activeTab === "income" && styles.activeTabText]}>Income</Text>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <ScrollView contentContainerStyle={styles.list}>
        {categories.map((cat) => (
          <View key={cat.id} style={styles.categoryCard}>
            <View style={[styles.iconBox, { backgroundColor: cat.color + "20" }]}>
              <Ionicons name={cat.icon as any} size={24} color={cat.color} />
            </View>
            <View style={styles.catInfo}>
              <Text style={styles.catName}>{cat.name}</Text>
              {Number(cat.isDefault) === 1 && <Text style={styles.defaultBadge}>Default</Text>}
            </View>
            {Number(cat.isDefault) === 0 && (
              <TouchableOpacity onPress={() => handleDeleteCategory(cat.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Add Category Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New {activeTab === "expense" ? "Expense" : "Income"} Category</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput style={styles.input} placeholder="Category Name" value={newName} onChangeText={setNewName} placeholderTextColor="#9ca3af" />

            <Text style={styles.label}>Select Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
              {ICONS.map((i) => (
                <TouchableOpacity key={i} style={[styles.iconCircle, newIcon === i && { backgroundColor: DEFAULT_COLOR + "20", borderColor: DEFAULT_COLOR }]} onPress={() => setNewIcon(i)}>
                  <Ionicons name={i as any} size={24} color={newIcon === i ? DEFAULT_COLOR : "#6b7280"} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddCategory}>
              <Text style={styles.submitBtnText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Modals */}
      <ConfirmModal
        visible={deleteCategoryId !== null}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Delete"
        isDestructive={true}
        onConfirm={executeDeleteCategory}
        onCancel={() => setDeleteCategoryId(null)}
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
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1f2937" },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  activeTab: { borderBottomColor: "#4f46e5" },
  tabText: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
  activeTabText: { color: "#4f46e5" },
  list: { padding: 20 },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginRight: 16 },
  catInfo: { flex: 1 },
  catName: { fontSize: 16, fontWeight: "600", color: "#1f2937", marginBottom: 4 },
  defaultBadge: { fontSize: 11, fontWeight: "600", color: "#6b7280", backgroundColor: "#f3f4f6", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  deleteBtn: { padding: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#ffffff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1f2937" },
  input: { backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#4b5563", marginBottom: 12 },
  colorScroll: { flexDirection: "row", marginBottom: 24 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, marginRight: 12, borderWidth: 2, borderColor: "transparent" },
  colorSelected: { borderColor: "#1f2937" },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center", marginRight: 12, borderWidth: 2, borderColor: "transparent" },
  submitBtn: { backgroundColor: "#4f46e5", paddingVertical: 16, borderRadius: 16, alignItems: "center", marginTop: 10 },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
