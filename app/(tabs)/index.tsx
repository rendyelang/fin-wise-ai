import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Components
import BalanceCard from "../../src/components/BalanceCard";
import MonthYearPicker from "../../src/components/MonthYearPicker";
import PeriodFilter, { PeriodType } from "../../src/components/PeriodFilter";
import SummaryCard from "../../src/components/SummaryCard";
import TransactionItem from "../../src/components/TransactionItem";

// Database
import { getBalanceSummaryByDateRange, getTransactionsByDateRange } from "../../src/database/sqlite";

// Hooks
import { useDashboardFilter } from "../../src/hooks/useDashboardFilter";
import { useAuthStore } from "../../src/store/useAuthStore";

// Types & Utils
import { BalanceSummary, GroupedTransactions, PeriodSummaryCardData } from "../../src/types";
import { MONTH_NAMES_SHORT, getMonthsInYear, getWeeksInMonth, getYearsRange } from "../../src/utils/dateHelpers";
import { formatCurrency } from "../../src/utils/formatters";
import { groupTransactionsByDate } from "../../src/utils/transactionHelpers";

export default function Home() {
  const router = useRouter();
  const now = new Date();
  const { user } = useAuthStore();

  // Dynamic greeting based on time of day
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Good night";

  // Extract username from email (part before @)
  const userName = user?.email?.split("@")[0] || "User";

  // Bottom Sheet Ref & Setup
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["65%", "95%"], []);

  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [period, setPeriod] = useState<PeriodType>("daily");
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const [balanceSummary, setBalanceSummary] = useState<BalanceSummary>({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [groupedTx, setGroupedTx] = useState<GroupedTransactions[]>([]);
  const [summaryCards, setSummaryCards] = useState<PeriodSummaryCardData[]>([]);

  const { filter, applyFilter, clearFilter } = useDashboardFilter();

  // --- DATA LOADING ---
  useFocusEffect(
    useCallback(() => {
      if (filter.active) {
        loadFilteredDaily();
      } else {
        loadDashboardData();
      }
    }, [selectedMonth, selectedYear, period, filter.active, filter.startDate, filter.endDate]),
  );

  const loadDashboardData = async () => {
    try {
      if (period === "daily") {
        const start = new Date(selectedYear, selectedMonth, 1).toISOString();
        const end = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999).toISOString();

        const summary = await getBalanceSummaryByDateRange(start, end);
        setBalanceSummary(summary);

        const txs = await getTransactionsByDateRange(start, end);
        setGroupedTx(groupTransactionsByDate(txs));
        setSummaryCards([]);
      } else {
        let cards: PeriodSummaryCardData[] = [];
        if (period === "weekly") cards = getWeeksInMonth(selectedMonth, selectedYear);
        else if (period === "monthly") cards = getMonthsInYear(selectedYear);
        else cards = getYearsRange(selectedYear);

        const enriched = await Promise.all(
          cards.map(async (card) => {
            const summary = await getBalanceSummaryByDateRange(card.startDate, card.endDate);
            return { ...card, income: summary.totalIncome, expense: summary.totalExpense };
          }),
        );

        setSummaryCards(enriched);
        setGroupedTx([]);

        let overallStart: string;
        let overallEnd: string;
        if (period === "weekly" || period === "monthly") {
          overallStart = new Date(selectedYear, period === "weekly" ? selectedMonth : 0, 1).toISOString();
          overallEnd = new Date(selectedYear, period === "weekly" ? selectedMonth + 1 : 12, 0, 23, 59, 59, 999).toISOString();
        } else {
          overallStart = new Date(selectedYear - 2, 0, 1).toISOString();
          overallEnd = new Date(selectedYear + 2, 11, 31, 23, 59, 59, 999).toISOString();
        }
        setBalanceSummary(await getBalanceSummaryByDateRange(overallStart, overallEnd));
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    }
  };

  const loadFilteredDaily = async () => {
    try {
      const summary = await getBalanceSummaryByDateRange(filter.startDate, filter.endDate);
      setBalanceSummary(summary);

      const txs = await getTransactionsByDateRange(filter.startDate, filter.endDate);
      setGroupedTx(groupTransactionsByDate(txs));
      setSummaryCards([]);
    } catch (error) {
      console.error("Failed to load filtered data", error);
    }
  };

  // --- EVENT HANDLERS ---
  const handleCardPress = (card: PeriodSummaryCardData) => {
    applyFilter(card);
    setPeriod("daily");
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handlePeriodChange = (newPeriod: PeriodType) => {
    if (filter.active) clearFilter();
    setPeriod(newPeriod);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleMonthSelect = (m: number, y: number) => {
    if (filter.active) clearFilter();
    setSelectedMonth(m);
    setSelectedYear(y);
  };

  const goToPreviousMonth = () => {
    if (filter.active) clearFilter();
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else setSelectedMonth((m) => m - 1);
  };

  const goToNextMonth = () => {
    if (filter.active) clearFilter();
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else setSelectedMonth((m) => m + 1);
  };

  const headerLabel = `${MONTH_NAMES_SHORT[selectedMonth]} ${selectedYear}`;

  // --- RENDER ---
  return (
    <View className="flex-1 bg-gray-50">
      {/* 1. BACKGROUND / HEADER LEVEL (Static) */}
      <View className="bg-blue-600 pt-12 pb-7 px-6 rounded-b-[20px] relative" style={styles.headerShadow}>
        {/* User Greeting Row */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white/70 text-sm font-medium mb-1">{greeting},</Text>
            <Text className="text-white text-2xl font-bold">{userName}</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20">
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
            <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-blue-600" />
          </TouchableOpacity>
        </View>

        {/* Date Selector Pill */}
        <View className="flex-row items-center justify-between bg-white/10 rounded-2xl p-1.5 border border-white/20">
          <TouchableOpacity onPress={goToPreviousMonth} className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMonthPicker(true)} className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#ffffff" />
            <Text className="text-white text-base font-bold ml-2">{headerLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextMonth} className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <PeriodFilter selected={period} onSelect={handlePeriodChange} />

        {/* Filter Banner */}
        {filter.active && (
          <View className="mt-4 bg-white/20 border border-white/30 rounded-xl px-4 py-3 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="funnel" size={16} color="#ffffff" />
              <Text className="text-white font-semibold text-sm ml-2">Filter active: {filter.label}</Text>
            </View>
            <TouchableOpacity onPress={clearFilter}>
              <Text className="text-blue-100 font-bold text-sm">Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 2. BOTTOM SHEET FOREGROUND (Draggable & Scrollable) */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: "#f9fafb",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderColor: "#2563eb",
          shadowColor: "#2563eb",
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 15,
        }}
        handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 40, height: 5 }}
      >
        <View className="px-6 pt-2 pb-6">
          {(period === "daily" || filter.active) && (
            <>
              {/* Balance Card directly inserted */}
              <View>
                <BalanceCard summary={balanceSummary} />
              </View>

              {/* AI Insight */}
              <View className="mt-4">
                <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex-row items-center shadow-sm">
                  <View className="bg-blue-200 p-2 rounded-full mr-3">
                    <Ionicons name="sparkles" size={18} color="#2563eb" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-blue-900 font-semibold text-sm">FinWise AI Insight</Text>
                    <Text className="text-blue-700 text-xs mt-0.5">Your spending tracker is active! Add transactions and I will analyze your habits soon.</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
        <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Transactions List */}
          <View className="px-6 mt-2">
            {/* Summary Cards */}
            {summaryCards.length > 0 && !filter.active && summaryCards.map((card, index) => <SummaryCard key={index} card={card} onPress={() => handleCardPress(card)} />)}

            {/* Daily Transactions */}
            {(period === "daily" || filter.active) && (
              <>
                {groupedTx.length === 0 ? (
                  <View className="py-10 items-center justify-center">
                    <Text className="text-gray-400 text-sm">No transactions for this period.</Text>
                  </View>
                ) : (
                  groupedTx.map((day, index) => (
                    <View key={index} className="mb-6">
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-400 font-semibold text-sm">{day.date}</Text>
                        {day.dailyExpense > 0 && <Text className="text-red-400 font-semibold text-sm">-{formatCurrency(day.dailyExpense)}</Text>}
                      </View>
                      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        {day.items.map((item, idx) => (
                          <TransactionItem key={item.id} item={item} isLast={idx === day.items.length - 1} onPress={() => router.push({ pathname: "/add-transaction", params: { id: String(item.id) } })} />
                        ))}
                      </View>
                    </View>
                  ))
                )}
              </>
            )}
            <View className="h-20" />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* 3. ABSOLUTE OVERLAYS */}
      <MonthYearPicker visible={showMonthPicker} selectedMonth={selectedMonth} selectedYear={selectedYear} onSelect={handleMonthSelect} onClose={() => setShowMonthPicker(false)} />

      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg" onPress={() => router.push("/add-transaction")} activeOpacity={0.8} style={{ zIndex: 100 }}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: "#543BCE",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 24,
  },
});
