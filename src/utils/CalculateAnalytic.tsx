import { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { AttendanceData } from "../redux/AttendanceSlice";
interface Metrics {
    late_perc: number;
    ontime_perc: number;
    working_hours: { seconds: number; hours: number; minutes: number };
    lunch_hours: number;
    total_records: number;
  }
  
  interface AnalyticsWithComparison {
    current: Metrics;
    compare: Metrics;
    changes: {
      late_perc_change: number;
      ontime_perc_change: number;
      working_hours_change: number;
      lunch_hours_change: number;
      attendance_change: number;
    };
  }
  
  type Analytics = Metrics | AnalyticsWithComparison;
export const useAttendanceAnalytics = () => {
  const attendance_data_map = useSelector(
    (state: RootState) => state.attendance_data.my_attendance_data
  ) as Map<string, AttendanceData[]>;

  const [compareMonth, setCompareMonth] = useState<Date | null>(null);

  const isOnTime = useCallback((clockin: Date): boolean => {
    if (
      clockin.getHours() > 8 ||
      (clockin.getHours() === 8 && clockin.getMinutes() > 10)
    ) {
      return false;
    } else {
      return true;
    }
  }, []);

  const calculateMetrics = useCallback(
    (data: AttendanceData[]) => {
      let ontime = 0;
      let late = 0;
      let working_hours = {
        seconds: 0,
        hours: 0,
        minutes: 0,
      };
      let lunch_hours = 0;

      data.forEach((record) => {
        if (isOnTime(record.clock_in)) {
          ontime++;
        } else {
          late++;
        }
        lunch_hours += 1;
        working_hours = {
          hours: working_hours.hours + record.workHours.hours,
          minutes: working_hours.minutes + record.workHours.minutes,
          seconds: working_hours.seconds + record.workHours.seconds,
        };
      });

      working_hours.minutes += Math.floor(working_hours.seconds / 60);
      working_hours.seconds %= 60;
      working_hours.hours += Math.floor(working_hours.minutes / 60);
      working_hours.minutes %= 60;

      const ontime_perc = data.length > 0 ? (ontime / data.length) * 100 : 0;
      const late_perc = data.length > 0 ? (late / data.length) * 100 : 0;

      return {
        late_perc,
        ontime_perc,
        working_hours,
        lunch_hours,
        total_records: data.length,
      };
    },
    [isOnTime]
  );

  const calculateChange = useCallback(
    (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    },
    []
  );

  const getMonthKey = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }, []);

  const getDataForMonth = useCallback(
    (date: Date): AttendanceData[] => {
      const key = getMonthKey(date);
      return attendance_data_map.get(key) || [];
    },
    [attendance_data_map, getMonthKey]
  );

  const calculateDashBoardAnalytic = useCallback(
    (compareDate: Date) => {
      const now = new Date();

      const compareMonth_data = getDataForMonth(compareDate);

      const current_month_data = getDataForMonth(now);

      const current_metrics = calculateMetrics(current_month_data);

      if (compareMonth_data.length < 1) {
        return current_metrics;
      } else {
        const compare_metrics = calculateMetrics(compareMonth_data);

        const currentTotalMinutes =
          current_metrics.working_hours.hours * 60 +
          current_metrics.working_hours.minutes +
          current_metrics.working_hours.seconds / 60;

        const compareTotalMinutes =
          compare_metrics.working_hours.hours * 60 +
          compare_metrics.working_hours.minutes +
          compare_metrics.working_hours.seconds / 60;

        return {
          current: current_metrics,
          compare: compare_metrics,
          changes: {
            late_perc_change: calculateChange(
              current_metrics.late_perc,
              compare_metrics.late_perc
            ),
            ontime_perc_change: calculateChange(
              current_metrics.ontime_perc,
              compare_metrics.ontime_perc
            ),
            working_hours_change: calculateChange(
              currentTotalMinutes,
              compareTotalMinutes
            ),
            lunch_hours_change: calculateChange(
              current_metrics.lunch_hours,
              compare_metrics.lunch_hours
            ),
            attendance_change: calculateChange(
              current_metrics.total_records,
              compare_metrics.total_records
            ),
          },
        };
      }
    },
    [calculateMetrics, calculateChange, getDataForMonth]
  );

  const analytics = useMemo<Analytics|null>(() => {
    if (compareMonth) {
      return calculateDashBoardAnalytic(compareMonth);
    }
    return null;
  }, [compareMonth, calculateDashBoardAnalytic]);

  const availableMonths = useMemo(() => {
    const months: Date[] = [];

    attendance_data_map.forEach((_, key) => {
      const year = parseInt(key.substring(0, 4));
      const month = parseInt(key.substring(4, 6)) - 1;
      months.push(new Date(year, month));
    });

    return months.sort((a, b) => a.getTime() - b.getTime());
  }, [attendance_data_map]);

  return {
    analytics,
    compareMonth,
    setCompareMonth,
    calculateDashBoardAnalytic,
    availableMonths,
    isOnTime,
  };
};
