import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  date: { fontSize: 14, marginBottom: 20 },
  table: { display: "flex", width: "100%" },
  row: { flexDirection: "row", borderBottom: "1pt solid black", padding: 5 },
  cell: { flex: 1, textAlign: "center" },
  header: { fontWeight: "bold" },
});
type Props = {
  register: { [key: string]: boolean[] };
};
const WeeklyRegisterPDF = ({ register }: Props) => {
  const recordsPerPage = 12;
  const pages = [];
  const data = { register };
  const now = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const diff_days = now.getDay() - startOfWeek.getDay() + 1;
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const temp_arr = Array.from({ length: diff_days }).fill(1);

  for (
    let i = 0;
    i < Object.entries(data.register).length;
    i += recordsPerPage
  ) {
    pages.push(Object.keys(data.register).slice(i, i + recordsPerPage));
  }

  return (
    <Document>
      {pages.flatMap((pageData, pageIndex) => (
        <Page
          size="A4"
          orientation="landscape"
          style={styles.page}
          key={pageIndex}
        >
          <Text style={styles.title}>Weekly Register</Text>
          <Text style={styles.date}>{now.toDateString()}</Text>
          <View style={styles.table}>
            <View style={[styles.row, styles.header]}>
              <Text style={styles.cell}>Name</Text>
              {temp_arr.slice(0, 5).map((_, idx) => (
                <Text style={styles.cell} key={idx}>
                  {weekdays[idx]}
                </Text>
              ))}
            </View>
            {pageData.map((key, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.cell}>{key}</Text>
                {data.register[key as keyof typeof data.register]
                  .slice(0, 5)
                  .map((value, idx) => (
                    <Text style={styles.cell} key={idx}>
                      {value ? "Present" : "Absent"}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default WeeklyRegisterPDF;
