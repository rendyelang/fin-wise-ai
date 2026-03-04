import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";
import { auth } from "../../src/utils/firebase";

export default function SettingsScreen() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await signOut(auth);
            // The RootLayout auth listener will handle the redirect
          } catch (error) {
            Alert.alert("Error", "Failed to log out. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderSettingItem = (iconName: keyof typeof Ionicons.glyphMap, title: string, color: string, showChevron: boolean = true, onPress?: () => void) => (
    <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
        <Ionicons name={iconName} size={22} color={color} />
      </View>
      <Text style={styles.settingText}>{title}</Text>
      {showChevron && <Ionicons name="chevron-forward" size={20} color="#9ca3af" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Header Profile Section */}
      <View style={styles.header}>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarText}>{user?.email?.[0]?.toUpperCase() || "U"}</Text>
        </View>
        <Text style={styles.profileName}>{user?.displayName || "FinWise User"}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financials</Text>
        <View style={styles.card}>{renderSettingItem("grid-outline", "Manage Categories", "#10b981", true, () => router.push("/categories"))}</View>
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          {renderSettingItem("person-outline", "Account Information", "#4f46e5")}
          <View style={styles.divider} />
          {renderSettingItem("notifications-outline", "Notifications", "#0ea5e9")}
          <View style={styles.divider} />
          {renderSettingItem("color-palette-outline", "Appearance", "#db2777")}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & About</Text>
        <View style={styles.card}>
          {renderSettingItem("help-buoy-outline", "Help Center", "#10b981")}
          <View style={styles.divider} />
          {renderSettingItem("shield-checkmark-outline", "Privacy Policy", "#8b5cf6")}
          <View style={styles.divider} />
          {renderSettingItem("information-circle-outline", "About FinWise", "#f59e0b")}
        </View>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7} onPress={handleLogout} disabled={loading}>
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={styles.logoutText}>{loading ? "Logging out..." : "Log Out"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    backgroundColor: "#1e1b4b",
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  profileAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#e0e7ff",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: "#a5b4fc",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#1e1b4b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 17,
    color: "#1f2937",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginLeft: 80,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ef4444",
    marginLeft: 10,
  },
});
