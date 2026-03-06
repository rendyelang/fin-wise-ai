import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { initDB } from "../src/database/sqlite";
import { useAuthStore } from "../src/store/useAuthStore";
import { auth } from "../src/utils/firebase";

function RootLayoutNav() {
  const { user, isLoading: authLoading, setUser, setLoading } = useAuthStore();
  const [dbInitialized, setDbInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // 1. Inisialisasi Database SQLite
  useEffect(() => {
    initDB()
      .then(() => setDbInitialized(true))
      .catch((e) => console.error("DB init error", e));
  }, []);

  // 2. Pantau status login dari Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  // 3. Logika Penjaga Gerbang
  useEffect(() => {
    if (authLoading || !dbInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, authLoading, dbInitialized, segments, router]);

  if (authLoading || !dbInitialized) return null;

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-transaction" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="categories" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="create-budget" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayoutNav />
    </GestureHandlerRootView>
  );
}
