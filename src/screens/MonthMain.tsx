import { paperStyles } from "@/src/styles/paper";
import { theme, typography } from "@/src/styles/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MonthMain(props: { year: number; month: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>CALENDAR</Text>

      <View style={styles.block}>
        <Text style={styles.line}>m 1</Text>
        <Text style={styles.line}>t 2   sister’s birthday 🎂</Text>
        <Text style={styles.line}>w 3</Text>
        <Text style={styles.line}>t 4</Text>
        <Text style={styles.line}>f 5</Text>
        <Text style={styles.line}>…</Text>
      </View>

      <View style={paperStyles.rule} />

      <Text style={styles.sectionTitle}>RUNNING TASKS</Text>
      <View style={styles.block}>
        <Text style={styles.line}>☐ buy present</Text>
        <Text style={styles.line}>☐ buy socks</Text>
        <Text style={styles.line}>☐ renew passport</Text>
      </View>

      <View style={paperStyles.rule} />

      <Text style={styles.sectionTitle}>NOTES</Text>
      <View style={styles.block}>
        <Text style={styles.line}>• random thought</Text>
        <Text style={styles.line}>• reminder</Text>
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
  block: {
    gap: 6,
  },
  line: {
    color: theme.ink,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.regular,
  },
});
