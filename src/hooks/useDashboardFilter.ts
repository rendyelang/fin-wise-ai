import { useCallback, useState } from "react";
import { PeriodSummaryCardData } from "../types";

/**
 * Custom hook to manage the dashboard drill-down filter state cleanly.
 */

interface FilterState {
  active: boolean;
  label: string;
  startDate: string;
  endDate: string;
}

const INITIAL_FILTER: FilterState = {
  active: false,
  label: "",
  startDate: "",
  endDate: "",
};

export const useDashboardFilter = () => {
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);

  const applyFilter = useCallback((card: PeriodSummaryCardData) => {
    setFilter({
      active: true,
      label: card.label,
      startDate: card.startDate,
      endDate: card.endDate,
    });
  }, []);

  const clearFilter = useCallback(() => {
    setFilter(INITIAL_FILTER);
  }, []);

  return { filter, applyFilter, clearFilter };
};
