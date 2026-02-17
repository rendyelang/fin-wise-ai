import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import "../global.css";
import { useAuthStore } from "../src/store/useAuthStore";
import { auth } from "../src/utils/firebase";

export default function RootLayout() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const segments = useSegments(); // Untuk tau kita lagi di URL mana
  const router = useRouter();

  // 1. Pantau status login dari Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Satpam selesai ngecek
    });
    return unsubscribe;
  }, []);

  // 2. Logika Penjaga Gerbang (Tendang atau Persilakan Masuk)
  useEffect(() => {
    if (isLoading) return; // Kalau masih ngecek, diem dulu

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Belum login tapi nyoba masuk ke area privat? Tendang ke login!
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Udah login tapi iseng buka halaman login lagi? Suruh masuk ke Home!
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments]);

  // Bisa diganti pakai UI Loading Screen yang keren nanti
  if (isLoading) return null;

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-transaction" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="create-budget" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
}
