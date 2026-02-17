import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// --- 1. MANEKIN (DUMMY DATA) ---
// Nanti ini diganti dengan data asli dari database SQLite lu
const dummyData = [
  {
    date: "16 Feb 2026",
    dailyTotal: 24500,
    items: [{ id: 1, category: "Food", title: "Greenfield full cream", amount: -24500, type: "expense", icon: "fast-food" }],
  },
  {
    date: "15 Feb 2026",
    dailyTotal: 29500,
    items: [{ id: 2, category: "Food", title: "kopi dan aren", amount: -29500, type: "expense", icon: "cafe" }],
  },
  {
    date: "14 Feb 2026",
    dailyTotal: 65500,
    items: [
      { id: 3, category: "Transportation", title: "bensin", amount: -38500, type: "expense", icon: "car" },
      { id: 4, category: "Health", title: "berenang", amount: -25000, type: "expense", icon: "medical" },
      { id: 5, category: "Transportation", title: "tambah angin", amount: -2000, type: "expense", icon: "car" },
    ],
  },
];

// --- 2. HELPER FUNCTION ---
// Nanti fungsi ini bisa kita pindah ke folder utils/ dan dibuat dinamis sesuai Settings
const formatCurrency = (amount: number) => {
  return `Rp ${Math.abs(amount).toLocaleString("id-ID")}`;
};

// --- 3. KOMPONEN UTAMA ---
export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* --- HEADER WARNA BIRU --- */}
      <View className="bg-blue-600 pt-16 pb-20 px-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-semibold">Feb 2026</Text>
          <View className="flex-row space-x-4">
            <Ionicons name="search" size={24} color="white" />
            <Ionicons name="calendar-outline" size={24} color="white" />
          </View>
        </View>
      </View>

      {/* --- KARTU SALDO & RINGKASAN (Numpang di atas Header) --- */}
      <View className="px-6 -mt-14">
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <Text className="text-gray-500 font-medium mb-1">Balance</Text>
          {/* Angka Saldo Utama */}
          <Text className="text-3xl font-bold text-gray-900 mb-6">-Rp 406.000</Text>

          {/* Row Pemasukan & Pengeluaran */}
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <View className="bg-green-100 p-2 rounded-full mr-3">
                <Ionicons name="arrow-up" size={16} color="#16a34a" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs">Income</Text>
                <Text className="text-green-600 font-bold">{formatCurrency(1300000)}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-red-100 p-2 rounded-full mr-3">
                <Ionicons name="arrow-down" size={16} color="#dc2626" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs">Expense</Text>
                <Text className="text-red-600 font-bold">{formatCurrency(1706000)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* --- KARTU AI HIGHLIGHT (Ide Inovasi Lu) --- */}
      <View className="px-6 mt-4">
        <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex-row items-center shadow-sm">
          <View className="bg-blue-200 p-2 rounded-full mr-3">
            <Ionicons name="sparkles" size={20} color="#2563eb" />
          </View>
          <View className="flex-1">
            <Text className="text-blue-900 font-semibold text-sm">FinWise AI Insight</Text>
            <Text className="text-blue-700 text-xs mt-1">Pengeluaran transportasi hari ini aman bro, tapi hati-hati budget jajan kopi udah mau limit!</Text>
          </View>
        </View>
      </View>

      {/* --- DAFTAR TRANSAKSI SCROLLABLE --- */}
      <ScrollView className="flex-1 px-6 mt-4" showsVerticalScrollIndicator={false}>
        {dummyData.map((day, index) => (
          <View key={index} className="mb-6">
            {/* Header Tanggal & Total Harian */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-400 font-semibold text-sm">{day.date}</Text>
              {/* Ini Total Pengeluaran Harian yang lu request */}
              <Text className="text-red-400 font-semibold text-sm">-{formatCurrency(day.dailyTotal)}</Text>
            </View>

            {/* List Item Transaksi */}
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              {day.items.map((item, idx) => (
                <View key={item.id} className={`flex-row justify-between items-center ${idx !== day.items.length - 1 ? "border-b border-gray-100 pb-3 mb-3" : ""}`}>
                  <View className="flex-row items-center">
                    <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                      <Ionicons name={item.icon as any} size={18} color="#2563eb" />
                    </View>
                    <View>
                      <Text className="text-gray-800 font-bold text-base">{item.category}</Text>
                      <Text className="text-gray-400 text-xs">{item.title}</Text>
                    </View>
                  </View>
                  <Text className="text-red-500 font-bold">-{formatCurrency(item.amount)}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        {/* Padding bawah biar gak ketutupan Bottom Tabs atau tombol Add */}
        <View className="h-24" />
      </ScrollView>

      {/* --- TOMBOL FLOATING ACTION (FAB) BUAT NAMBAH TRANSAKSI --- */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg" onPress={() => router.push("/add-transaction")} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
