import { User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Default-nya true, satpam lagi ngecek identitas
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));
