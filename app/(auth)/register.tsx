import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthHeader from "../../src/components/AuthHeader";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";
import { auth } from "../../src/utils/firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Your passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success ✨", "Your account has been created! Welcome aboard.");
      router.replace("/(tabs)");
    } catch (error: any) {
      let msg = "Something went wrong.";
      if (error.code === "auth/email-already-in-use") msg = "This email is already registered.";
      if (error.code === "auth/weak-password") msg = "Password should be at least 6 characters.";
      if (error.code === "auth/invalid-email") msg = "The email format is incorrect.";
      Alert.alert("Registration Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
          <AuthHeader title="Start your " titleAccent="Journey." subtitle="Join FinWise AI and take control of your financial destiny today." showBack onBack={() => router.back()} />

          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <FormInput label="Email Address" placeholder="name@example.com" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />

              <FormInput label="Create Password" placeholder="At least 6 characters" value={password} onChangeText={setPassword} icon="lock-closed-outline" secureTextEntry showToggle />

              <FormInput label="Confirm Password" placeholder="Repeat password" value={confirmPassword} onChangeText={setConfirmPassword} icon="checkmark-done-circle-outline" secureTextEntry showToggle />

              <PrimaryButton label="Create Account" onPress={handleRegister} loading={loading} icon="rocket-outline" color="#06b6d4" />

              {/* Login link */}
              <View style={styles.bottomRow}>
                <Text style={styles.bottomLabel}>Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.bottomLink}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  cardWrapper: { paddingHorizontal: 20, marginTop: -60, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 28,
    elevation: 12,
    shadowColor: "#1e1b4b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  bottomLabel: { color: "#6b7280", fontSize: 15 },
  bottomLink: { color: "#4f46e5", fontSize: 15, fontWeight: "800" },
});
