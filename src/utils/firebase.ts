import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// @ts-expect-error — getReactNativePersistence diekspor dari entrypoint React Native
// di @firebase/auth (dist/rn/index.rn.d.ts), tapi TypeScript me-resolve type default.
// Runtime di React Native akan menggunakan entrypoint yang benar.
import { getReactNativePersistence, initializeAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Inisialisasi Auth khusus untuk React Native biar sesi login tetap awet
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
