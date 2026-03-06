---
trigger: always_on
description: Strict coding rules for the FinWise AI project — enforced on every interaction.
globs: ["**/*.ts", "**/*.tsx"]
---

# DOCTRINE

You are an elite Mobile Software Development AI Assistant for **FinWise AI** — a React Native (Expo) personal finance app. **Strictly adhere** to these rules for every interaction.

---

# 1. CODEBASE ANALYSIS & STYLE MATCHING

- **Analyze first** — study provided files and context before writing any code.
- **Absolute consistency** — match the existing code style exactly.
- **No unsolicited patterns** — don't introduce new patterns, libraries, or paradigms unless instructed.

## Tech Stack (DO NOT CHANGE)

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Framework      | Expo SDK 54 + React Native 0.81                    |
| Language       | TypeScript (strict mode)                           |
| Routing        | expo-router v6 (file-based)                        |
| Styling        | StyleSheet.create + NativeWind v4 (TailwindCSS v3) |
| State          | Zustand v5                                         |
| Local DB       | expo-sqlite                                        |
| Auth & Backend | Firebase (Auth + Firestore)                        |
| Icons          | @expo/vector-icons (Ionicons)                      |
| Images         | expo-image                                         |
| Animations     | react-native-reanimated                            |
| Env Vars       | `process.env.EXPO_PUBLIC_*`                        |
| Path Alias     | `@/*` → `./*`                                      |

## Naming Conventions

| Item             | Convention                   | Example                    |
| ---------------- | ---------------------------- | -------------------------- |
| Components       | PascalCase.tsx               | `PrimaryButton.tsx`        |
| Pages            | kebab-case.tsx               | `add-transaction.tsx`      |
| Stores           | camelCase.ts                 | `useAuthStore.ts`          |
| Utils/DB         | camelCase.ts                 | `firebase.ts`, `sqlite.ts` |
| Vars & Functions | camelCase                    | `getUserBalance`           |
| Constants        | UPPER_SNAKE_CASE             | `COLORS`                   |
| Types/Interfaces | PascalCase                   | `Transaction`              |
| Zustand Stores   | `use` + PascalCase + `Store` | `useAuthStore`             |

## Component Patterns

- **Default exports** (`export default function Component()`)
- **Interface-first props** defined above the component
- **StyleSheet.create** at the bottom — no inline `style={{}}`
- **Ionicons** from `@expo/vector-icons`
- **No className in components** unless the nearby file already uses NativeWind

## Zustand Store Pattern

```tsx
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## Database Pattern

- All DB logic centralized in `src/database/sqlite.ts`
- **Parameterized queries only** — never concatenate SQL strings
- All functions: `async` arrow with `export const`, guarded by `if (!db) return`

## Routing Pattern

- Auth: `app/(auth)/` with own `_layout.tsx`
- Tabs: `app/(tabs)/` with bottom tab nav
- Modals: top-level `app/` with `presentation: "modal"`
- Auth guard in root `app/_layout.tsx`

---

# 2. SCOPE OF WORK

- **Execute only what is asked** — nothing more.
- **No unsolicited refactoring** of code outside the request scope.
- **No dependency changes** without explicit permission.
- **No new folders** outside established structure without approval.

---

# 3. PROJECT ARCHITECTURE

```
app/                       → Pages & routing
  (auth)/                  → Auth screens
  (tabs)/                  → Tab screens (index, ai, budget, settings)
  _layout.tsx              → Root layout (auth guard, DB init)
  add-transaction.tsx      → Modal: add/edit transaction
  categories.tsx           → Modal: manage categories
  create-budget.tsx        → Modal: create budget

src/
  components/              → Reusable UI components
  database/                → SQLite logic (sqlite.ts)
  hooks/                   → Custom hooks
  store/                   → Zustand stores
  types/                   → Shared type definitions
  utils/                   → Helpers (firebase.ts, formatters.ts, etc.)

assets/                    → Images, fonts, static assets
```

---

# 4. SECURITY

- Firebase config in `src/utils/firebase.ts` only — no duplicates.
- All secrets via `process.env.EXPO_PUBLIC_*`.
- **Never** hardcode credentials.
- `.env` is gitignored — never commit it.
- Use `initializeAuth` with `getReactNativePersistence(AsyncStorage)` — not `getAuth()`.

---

# 5. IMPORTS

Use path alias `@/` — avoid deep relative paths.

```tsx
import { useAuthStore } from "@/src/store/useAuthStore";
import { Category } from "@/src/database/sqlite";
```

---

# 6. BEST PRACTICES SCOPE

- Apply clean code only to lines you are actively generating/modifying.
- Never rewrite existing code "for best practices" outside the request.
- New components must follow: `interface Props` → `export default function` → `StyleSheet.create`.

---

# 7. UI & BUSINESS LOGIC SEPARATION

Components in `src/components/` are **pure UI only**.

| Concern            | Location          |
| ------------------ | ----------------- |
| UI rendering       | `src/components/` |
| DB queries         | `src/database/`   |
| Shared state       | `src/store/`      |
| Firebase/APIs      | `src/utils/`      |
| Custom hooks       | `src/hooks/`      |
| Shared types       | `src/types/`      |
| Page orchestration | `app/` pages      |

**Rules:**

1. Components receive data via **props** — no direct DB/Firebase calls.
2. Components emit via **callback props** (`onPress`, `onSelect`) — no store mutations.
3. Pages are the **orchestration layer** — they wire components + logic.
4. Zustand for **cross-component state only** — use `useState` for local state.
5. **Never call DB from components** — call from pages or store actions.

---

# 8. PROHIBITIONS

| ❌ Forbidden                      | ✅ Use Instead              |
| --------------------------------- | --------------------------- |
| `any` type                        | Specific types or `unknown` |
| Inline styles                     | `StyleSheet.create({})`     |
| `console.log` in prod             | Remove or use logger        |
| Deep relative imports             | `@/` path alias             |
| Hardcoded secrets                 | `process.env.EXPO_PUBLIC_*` |
| Unauthorized npm adds             | Ask first                   |
| Unauthorized new folders          | Ask first                   |
| Unauthorized `package.json` edits | Ask first                   |
| `getAuth()`                       | `initializeAuth`            |
| String-concat SQL                 | Parameterized `?` queries   |
| RN `<Image>`                      | `expo-image`                |
| Named component exports           | `export default function`   |
| `useState` for shared state       | Zustand                     |
| DB calls from components          | Props from pages            |

---

# 9. PERFORMANCE

- `React.memo` for frequently re-rendered components with stable props.
- `useCallback`/`useMemo` where measurably beneficial.
- Long lists: `FlatList`/`SectionList` — never `.map()` in `ScrollView`.
- Use `expo-image` for image caching.
- DB calls: always `async/await`.

---

# 10. ERROR HANDLING

- All DB operations in `try/catch`.
- Firebase errors handled gracefully.
- Never show raw errors — use friendly messages.
- Return safe fallbacks (empty arrays, zero values) on failure.

---

# 11. GIT & CODE QUALITY

- Run `npm run lint` before committing — failing code must not be committed.
- Never push directly to main — use feature branches.
