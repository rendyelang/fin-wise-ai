import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthHeader from "../../src/components/AuthHeader";
import FormInput from "../../src/components/FormInput";
import PrimaryButton from "../../src/components/PrimaryButton";
import { auth } from "../../src/utils/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password to continue.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      let msg = "Something went wrong.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") msg = "Invalid email or password.";
      if (error.code === "auth/invalid-email") msg = "The email format is incorrect.";
      if (error.code === "auth/too-many-requests") msg = "Too many attempts. Try again later.";
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
          <AuthHeader title="Welcome " titleAccent="Back." subtitle="Your intelligent financial insights are waiting for you." showBrand />

          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <FormInput label="Email Address" placeholder="name@example.com" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />

              <FormInput label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} icon="lock-closed-outline" secureTextEntry showToggle />

              <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <PrimaryButton label="Sign In" onPress={handleLogin} loading={loading} icon="arrow-forward-circle" color="#4f46e5" />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Register link */}
              <View style={styles.bottomRow}>
                <Text style={styles.bottomLabel}>New to FinWise? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.bottomLink}>Create Account</Text>
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
  forgotRow: { alignSelf: "flex-end", marginTop: -4, marginBottom: 4 },
  forgotText: { color: "#4f46e5", fontSize: 13, fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { color: "#9ca3af", fontSize: 13, fontWeight: "600", marginHorizontal: 12 },
  bottomRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  bottomLabel: { color: "#6b7280", fontSize: 15 },
  bottomLink: { color: "#06b6d4", fontSize: 15, fontWeight: "800" },
});
