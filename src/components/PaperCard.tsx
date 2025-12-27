import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export default function PaperCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 8,

    // soft “paper on desk” shadow
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,

    padding: 12,
  },
});
