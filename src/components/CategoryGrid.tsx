import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Category } from "../database/sqlite";

const ACTIVE_COLOR = "#1c64f2";

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number) => void;
  onCustomPress?: () => void;
}

export default function CategoryGrid({ categories, selectedCategory, onSelectCategory, onCustomPress }: CategoryGridProps) {
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
          <TouchableOpacity key={cat.id} style={[styles.categoryItem, isSelected && styles.categoryItemActive]} onPress={() => onSelectCategory(cat.id)} activeOpacity={0.7}>
            <Ionicons name={cat.icon as any} size={24} color={isSelected ? ACTIVE_COLOR : "#737373"} />
            <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]} numberOfLines={1}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Custom category button */}
      {onCustomPress && (
        <TouchableOpacity style={styles.categoryItem} onPress={onCustomPress} activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={24} color="#737373" />
          <Text style={styles.categoryName}>Custom</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 4,
  },
  categoryItem: {
    width: "23%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginHorizontal: "1%",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  categoryItemActive: {
    borderColor: ACTIVE_COLOR,
    backgroundColor: "#eff6ff",
  },
  categoryName: {
    fontSize: 11,
    color: "#525252",
    textAlign: "center",
    marginTop: 6,
  },
  categoryNameActive: {
    color: ACTIVE_COLOR,
    fontWeight: "600",
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
