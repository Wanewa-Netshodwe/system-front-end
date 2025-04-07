import { AttendanceData, UserAttendance } from "../redux/AttendanceSlice";

export type Metrics = {
  datasets: {
    lunch: number[];
    work: number[];
    late: number[];
    ontime: number[];
  };
  late_perc: number;
  ontime_perc: number;
  working_hours: { seconds: number; hours: number; minutes: number };
  lunch_hours: number;
  total_records: number;
};

export type AnalyticsWithComparison = {
  current: Metrics;
  compare: Metrics;
  changes: {
    late_perc_change: number;
    ontime_perc_change: number;
    working_hours_change: { seconds: number; hours: number; minutes: number };
    lunch_hours_change: number;
    attendance_change: number;
  };
};
export type DataChange = {
  changes: {
    late_perc_change: number;
    ontime_perc_change: number;
    attendance_change: number;
  };
  total_records_current: number;
  total_records_prev: number;
};
export type Analytics = Metrics | AnalyticsWithComparison;

export const isOnTime = (clockin: Date): boolean => {
  // console.log("my hours " + clockin.getHours());
  if (
    clockin.getHours() > 8 ||
    (clockin.getHours() === 8 && clockin.getMinutes() > 10)
  ) {
    return false;
  } else {
    return true;
  }
};

const calculateMetrics = (data: AttendanceData[]) => {
  console.log("calculateMetrics - Processing data length:", data.length);
  let ontime_dataset: number[] = [];
  let late_dataset: number[] = [];
  const lunch_hours_dataset: number[] = [];
  const working_hours_dataset: number[] = [];
  let ontime = 0;
  let late = 0;
  let working_hours = {
    seconds: 0,
    hours: 0,
    minutes: 0,
  };
  let lunch_hours = 0;

  data.forEach((record) => {
    if (isOnTime(new Date(record.clock_in))) {
      ontime++;
      ontime_dataset.push(
        new Date(record.clock_in).getHours() +
          new Date(record.clock_in).getMinutes()
      );
    } else {
      late++;
      late_dataset.push(
        new Date(record.clock_in).getHours() +
          new Date(record.clock_in).getMinutes()
      );
    }
    lunch_hours += 1;
    lunch_hours_dataset.push(1);
    working_hours_dataset.push(
      record.workHours.minutes + record.workHours.seconds
    );

    working_hours = {
      hours: working_hours.hours + record.workHours.hours,
      minutes: working_hours.minutes + record.workHours.minutes,
      seconds: working_hours.seconds + record.workHours.seconds,
    };
  });

  while (ontime_dataset.length < data.length) {
    ontime_dataset.push(1);
  }
  while (late_dataset.length < data.length) {
    late_dataset.push(1);
  }
  late_dataset = late_dataset.reverse();
  ontime_dataset = ontime_dataset.reverse();

  const ontime_perc =
    data.length > 0 ? Math.round((ontime / data.length) * 100) : 0;
  const late_perc =
    data.length > 0 ? Math.round((late / data.length) * 100) : 0;

  console.log("calculateMetrics - Results:", {
    ontime_perc,
    late_perc,
    total_records: data.length,
  });

  return {
    datasets: {
      lunch: lunch_hours_dataset,
      work: working_hours_dataset,
      late: late_dataset,
      ontime: ontime_dataset,
    },
    late_perc,
    lunch_hours,
    ontime_perc,
    total_records: data.length,
    working_hours,
  };
};

const calculateMetricsDaily = (data: AttendanceData) => {
  console.log(
    "calculateMetricsDaily - Processing single record:",
    JSON.stringify(data)
  );
  const ontime_dataset: number[] = [];
  const late_dataset: number[] = [];
  const lunch_hours_dataset: number[] = [];
  const working_hours_dataset: number[] = [];
  let ontime = 0;
  let late = 0;
  let working_hours = {
    seconds: 0,
    hours: 0,
    minutes: 0,
  };
  let lunch_hours = 0;

  if (isOnTime(new Date(data.clock_in))) {
    ontime++;
    ontime_dataset.push(
      new Date(data.clock_in).getHours() + new Date(data.clock_in).getMinutes()
    );
  } else {
    late++;
    late_dataset.push(
      new Date(data.clock_in).getHours() + new Date(data.clock_in).getMinutes()
    );
  }
  lunch_hours += 1;
  lunch_hours_dataset.push(1);
  working_hours = {
    hours: data.workHours.hours ? data.workHours.hours : 0,
    minutes: data.workHours.minutes ? data.workHours.hours : 0,
    seconds: data.workHours.seconds ? data.workHours.hours : 0,
  };
  working_hours_dataset.push(data.workHours.minutes);

  const ontime_perc = Math.round((ontime / 1) * 100);
  const late_perc = Math.round((late / 1) * 100);

  console.log("calculateMetricsDaily - Results:", {
    ontime_perc,
    late_perc,
  });

  return {
    datasets: {
      lunch: lunch_hours_dataset,
      work: working_hours_dataset,
      late: late_dataset,
      ontime: ontime_dataset,
    },
    late_perc,
    lunch_hours,
    ontime_perc,
    total_records: 1,
    working_hours,
  };
};

const calculateChange = (prev: number, current: number) => {
  console.log("calculateChange - Inputs:", { prev, current });
  if (prev === 0) {
    const result = current > 0 ? 100 : 0;
    console.log("calculateChange - Result (prev=0):", result);
    return result;
  }
  const result = Math.round(((current - prev) / prev) * 100);
  console.log("calculateChange - Result:", result);
  return result;
};

const getDailyKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const getDataForMonth = (
  attendance_data_map: Map<string, AttendanceData[]>,
  date: Date
) => {
  const key = getMonthKey(new Date(date));
  console.log(`getDataForMonth - Looking for key: ${key}`);
  console.log(`Available keys: ${[...attendance_data_map.keys()]}`);
  const result = attendance_data_map.get(key);
  console.log(`getDataForMonth - Found data: ${!!result}`);
  return result;
};

const getDataForDay = (
  attendance_data_map: Map<string, AttendanceData>,
  date: Date
) => {
  const key = getDailyKey(date);
  console.log(`getDataForDay - Looking for key: ${key}`);
  console.log(`Available keys: ${[...attendance_data_map.keys()]}`);
  let result = attendance_data_map.get(key);

  if (result === undefined) {
    console.log(
      `getDataForDay - No data for today, looking for next available key`
    );

    const allKeys = [...attendance_data_map].sort();
    console.log(`getDataForDay - All sorted keys: ${allKeys}`);

    if (allKeys.length > 0) {
      const mostRecentKey = allKeys[allKeys.length - 1];
      console.log(`getDataForDay - Using most recent key: ${mostRecentKey}`);
      result = attendance_data_map.get(mostRecentKey[0]);
    }
  }

  console.log(`getDataForDay - Found data: ${!!result}`);
  return result;
};

export const extractWeek = (
  attendance_data_map: Map<string, AttendanceData>
): AttendanceData[] => {
  console.log("extractWeek - Start");
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  console.log(
    `extractWeek - Date range: ${weekAgo.toISOString()} to ${now.toISOString()}`
  );

  const list_attendance: AttendanceData[] = [];
  const currentDate = new Date(weekAgo);
  while (currentDate <= now) {
    const dateKey = getDailyKey(currentDate);
    console.log(`extractWeek - Checking date: ${dateKey}`);

    const attendance = attendance_data_map.get(dateKey);
    if (attendance !== undefined) {
      console.log(`extractWeek - Found data for ${dateKey}`);
      list_attendance.push(attendance);
    } else {
      console.log(`extractWeek - No data for ${dateKey}`);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`extractWeek - Total records found: ${list_attendance.length}`);
  return list_attendance;
};

export const calculateDashBoardAnalyticMonthly = (
  attendance_data_map: Map<string, AttendanceData[]>,
  compareDate: Date
): Analytics | AnalyticsWithComparison | undefined => {
  const now = new Date();
  console.log("calculateDashBoardAnalyticMonthly - Start");
  console.log("Current date:", now);
  console.log("Compare date:", new Date(compareDate));

  const current_month_data = getDataForMonth(attendance_data_map, now);
  console.log("Current month data exists:", !!current_month_data);
  console.log(
    "Current month data length:",
    current_month_data ? current_month_data.length : 0
  );

  if (current_month_data) {
    const compareMonth_data = getDataForMonth(attendance_data_map, compareDate);
    console.log("Compare month data exists:", !!compareMonth_data);
    console.log(
      "Compare month data length:",
      compareMonth_data ? compareMonth_data.length : 0
    );

    const current_metrics = calculateMetrics(current_month_data);
    console.log("Current metrics calculated:", current_metrics);

    if (compareMonth_data) {
      if (compareMonth_data?.length < 1) {
        console.log("Returning only current metrics - compare data length < 1");
        return current_metrics;
      } else {
        console.log("Calculating comparison metrics");
        const compare_metrics = calculateMetrics(compareMonth_data);

        const currentTotalMinutes =
          current_metrics.working_hours.hours * 60 +
          current_metrics.working_hours.minutes +
          current_metrics.working_hours.seconds / 60;

        const compareTotalMinutes =
          compare_metrics.working_hours.hours * 60 +
          compare_metrics.working_hours.minutes +
          compare_metrics.working_hours.seconds / 60;

        const total_work_hours = {
          seconds:
            compare_metrics.working_hours.seconds +
            current_metrics.working_hours.seconds,
          minutes:
            compare_metrics.working_hours.minutes +
            current_metrics.working_hours.minutes,
          hours:
            compare_metrics.working_hours.hours +
            current_metrics.working_hours.hours,
        };

        console.log("Returning metrics with comparison");
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
            working_hours_change: total_work_hours,
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
    } else {
      console.log("UNDEFINED RETURN #1: compareMonth_data is undefined");
      return undefined;
    }
  } else {
    console.log("UNDEFINED RETURN #2: current_month_data is undefined");
    return undefined;
  }
};

export const calculateDashBoardAnalyticDaily = (
  my_attendance_data_daily: Map<string, AttendanceData>
): Analytics | AnalyticsWithComparison | undefined => {
  console.log("calculateDashBoardAnalyticDaily - Start");
  console.log("Input data map size:", my_attendance_data_daily.size);
  console.log("Input data keys:", my_attendance_data_daily);

  const now = new Date();
  console.log("Current date:", now);
  console.log("Current date key:", getDailyKey(now));

  const compareDaily_data = extractWeek(my_attendance_data_daily);
  console.log("Extracted week data length:", compareDaily_data.length);

  const current_day_data = getDataForDay(my_attendance_data_daily, now);
  console.log("Current day data exists:", !!current_day_data);

  if (current_day_data !== undefined) {
    console.log("Processing current day data");
    const current_metrics = calculateMetricsDaily(current_day_data);

    if (compareDaily_data && compareDaily_data.length > 0) {
      console.log("Calculating comparison with week data");
      const compare_metrics = calculateMetrics(compareDaily_data);

      const total_work_hours = {
        seconds: compare_metrics.working_hours.seconds,
        minutes: compare_metrics.working_hours.minutes,
        hours: compare_metrics.working_hours.hours,
      };

      console.log("Returning full comparison analytics");
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
          working_hours_change: total_work_hours,
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
    } else {
      console.log(
        "UNDEFINED/PARTIAL RETURN #3: compareDaily_data is empty or undefined"
      );
      return current_metrics;
    }
  } else {
    console.log("UNDEFINED RETURN #4: current_day_data is undefined");
    return undefined;
  }
};
const how_late_iam_in_minutes = (clockin: Date): number => {
  const referenceTime = new Date();
  referenceTime.setHours(8, 10, 0, 0);
  const differenceInMs = new Date().getTime() - clockin.getTime();
  const differenceInMinutes = Math.floor(differenceInMs / 1000 / 60);
  const lateMinutes =
    differenceInMinutes -
    Math.floor((new Date().getTime() - referenceTime.getTime()) / 1000 / 60);

  return lateMinutes;
};
const how_early_am_i_in_minutes = (clockin: Date): number => {
  const referenceTime = new Date();
  referenceTime.setHours(8, 5, 0, 0);
  const differenceInMs = referenceTime.getTime() - clockin.getTime();
  const differenceInMinutes = Math.floor(differenceInMs / 1000 / 60);
  return Math.abs(differenceInMinutes);
};
const calculateMetricsHR = (data: UserAttendance[]) => {
  let ontime_dataset: number[] = [];
  let late_dataset: number[] = [];
  let lunch_hours_dataset: number[] = [];
  let working_hours_dataset: number[] = [];
  let ontime = 0;
  let late = 0;
  let total_working_seconds = 0;
  let total_lunch_seconds = 1;

  data.forEach((record) => {
    // Check if the user was on time
    if (isOnTime(new Date(record.clock_in))) {
      ontime++;
      ontime_dataset.push(how_early_am_i_in_minutes(new Date(record.clock_in)));
    } else {
      late++;
      late_dataset.push(how_late_iam_in_minutes(new Date(record.clock_in)));
    }
    if (record.work_hours) {
      const { hours, minutes, seconds } = record.work_hours;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      total_working_seconds += totalSeconds;
      working_hours_dataset.push(totalSeconds);
    }
  });
  ontime_dataset = ontime_dataset.reverse();
  for (let i = ontime_dataset.length; i < data.length; i++) {
    ontime_dataset.push(0);
  }
  late_dataset = late_dataset.reverse();
  for (let i = late_dataset.length; i < data.length; i++) {
    late_dataset.push(0);
  }

  const ontime_perc =
    data.length > 0 ? Math.round((ontime / data.length) * 100) : 0;
  const late_perc =
    data.length > 0 ? Math.round((late / data.length) * 100) : 0;

  const working_hours = {
    hours: Math.floor(total_working_seconds / 3600),
    minutes: Math.floor((total_working_seconds % 3600) / 60),
    seconds: total_working_seconds % 60,
  };

  console.log("calculateMetricsHR - Results:", {
    ontime_perc,
    late_perc,
    total_records: data.length,
    working_hours,
  });

  return {
    datasets: {
      lunch: lunch_hours_dataset,
      work: working_hours_dataset,
      late: late_dataset,
      ontime: ontime_dataset,
    },
    late_perc,
    lunch_hours: total_lunch_seconds,
    ontime_perc,
    total_records: data.length,
    working_hours,
  };
};

export const calculateChangeHR = (
  prev: UserAttendance[],
  current: UserAttendance[]
): DataChange => {
  console.log("calculateChangeHR - Start");
  console.log("Prev data length:", prev.length);
  console.log("Current data length:", current.length);

  const prev_meterics = calculateMetricsHR(prev);
  const current_meterics = calculateMetricsHR(current);

  console.log("calculateChangeHR - Metrics calculated");

  return {
    changes: {
      late_perc_change: calculateChange(
        prev_meterics.late_perc,
        current_meterics.late_perc
      ),
      ontime_perc_change: calculateChange(
        prev_meterics.ontime_perc,
        current_meterics.ontime_perc
      ),
      attendance_change: calculateChange(
        prev_meterics.total_records,
        current_meterics.total_records
      ),
    },
    total_records_current: current_meterics.total_records,
    total_records_prev: prev_meterics.total_records,
  };
};

const weeklyData = (data: UserAttendance[]) => {
  const last_5_days: UserAttendance[] = [];
  const last_5_days_empty_array: number[] = [];

  const now = new Date();
  const todayDayOfWeek = now.getDay(); 

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);
console.log("start of week : ",startOfWeek)
  for (let i = 0; i <= 5; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateString = date.toISOString().split("T")[0];

    const record = data.find((v) => {
      console.log(v.todayDate)
      const recordDate = new Date(v.todayDate);
      return recordDate.toISOString().split("T")[0] === dateString;
    });

    if (record) {
      last_5_days.push(record);
      last_5_days_empty_array.push(0); 
    } else {
      last_5_days_empty_array.push(0); 
    }
  }

  return { last_5_days, last_5_days_empty_array };
};


export const onTimeData = (data: UserAttendance[]) => {
  let {last_5_days,last_5_days_empty_array} = weeklyData(data);
  console.log('last 5 days rec :  ',last_5_days)

  console.log("last_5_days_empty_array:",last_5_days_empty_array)

  let lateData: number[] = [];
  let earlyData: number[] = [];

  if (last_5_days.length > 0) {
    for (let i = 0; i < last_5_days.length; i++) {
      const record = last_5_days[i];
      console.log('record ',record)
      const clockInTime = new Date(record.clock_in);
      const officialTime = new Date(clockInTime);
      officialTime.setHours(8, 10, 0, 0);

      let difference = Math.floor(
        (clockInTime.getTime() - officialTime.getTime()) / 60000
      );
      console.log('diffrence : ',difference)

      if (difference > 0) {
        lateData.push(difference);
      } else if (difference < 0) {
        earlyData.push(difference);
      }
    }
  }
  lateData = lateData.reverse();
  for (let i = lateData.length; i < last_5_days_empty_array.length-1; i++) {
    lateData.push(0);
  }
  lateData = lateData.reverse();
  earlyData = earlyData.reverse();
  for (let i = earlyData.length; i < last_5_days_empty_array.length-1; i++) {
    earlyData.push(0);
  }
  earlyData = earlyData.reverse();

  return { lateData, earlyData };
};
