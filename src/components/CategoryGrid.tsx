import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Category } from "../database/sqlite";

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number) => void;
}

export default function CategoryGrid({ categories, selectedCategory, onSelectCategory }: CategoryGridProps) {
  if (!categories || categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No categories available</Text>
      </View>
    );
  }

  return (
    <View style={styles.categoriesGrid}>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => onSelectCategory(cat.id)} activeOpacity={0.7}>
            <View style={styles.categoryIconWrap}>
              <Ionicons name={cat.icon as any} size={28} color={isSelected ? cat.color : "#737373"} />
            </View>
            <Text style={[styles.categoryName, isSelected && { color: cat.color, fontWeight: "600" }]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryIconWrap: {
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    color: "#525252",
    textAlign: "center",
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#a3a3a3",
    fontSize: 14,
  },
});
