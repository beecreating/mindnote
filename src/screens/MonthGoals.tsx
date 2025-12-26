import { paperStyles } from "@/src/styles/paper";
import { theme, typography } from "@/src/styles/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MonthGoals(props: { year: number; month: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>GOALS</Text>

      <View style={styles.headerRow}>
        <Text style={styles.goalHead}>🟣 h&h</Text>
        <Text style={styles.goalHead}>🚶 walk10</Text>
        <Text style={styles.goalHead}>🏊 swim</Text>
      </View>

      <View style={paperStyles.rule} />

      <View style={styles.grid}>
        <Text style={styles.row}>m 01     x        x        x</Text>
        <Text style={styles.row}>t 02       x      x</Text>
        <Text style={styles.row}>w 03     x        x</Text>
        <Text style={styles.row}>t 04</Text>
        <Text style={styles.row}>f 05              x</Text>
        <Text style={styles.row}>…</Text>
      </View>

      <View style={paperStyles.rule} />

      <Text style={styles.sectionTitle}>NOTES</Text>
      <View style={styles.block}>
        <Text style={styles.note}>🟣 h&h = hulahoop 10 min</Text>
        <Text style={styles.note}>🚶 walk10 = 10 000 steps</Text>
        <Text style={styles.note}>🏊 swim = swimming hall</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: {
    color: "rgba(17,17,17,0.75)",
    fontSize: typography.size.sm,
    letterSpacing: 1.2,
    fontWeight: typography.weight.medium,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  goalHead: {
    color: theme.ink,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
  },
  grid: {
    gap: 6,
  },
  row: {
    color: theme.ink,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.regular,
  },
  block: { gap: 6 },
  note: {
    color: theme.ink,
    fontSize: typography.size.lg,
  },
});
