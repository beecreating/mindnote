import { theme } from "@/src/styles/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  grid: number;        // grid size, e.g. 24
  variant?: "main" | "goals";
};

export default function BinderHoles({ grid, variant = "main" }: Props) {
  const holeSize = grid;                 // 1 full square
  const holeRadius = holeSize / 2;
  const edgeOffset = grid;               // 1 square from edge
  const spacing = grid * 2;              // 2 squares between holes

  const opacity = variant === "goals" ? 0.55 : 0.4;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Top holes */}
      {[2, 3, 4].map((i) => (
        <View
          key={`top-${i}`}
          style={[
            styles.hole,
            {
              width: holeSize,
              height: holeSize,
              borderRadius: holeRadius,
              left: edgeOffset - holeRadius,
              top: edgeOffset + i * spacing,
              opacity,
            },
          ]}
        />
      ))}

      {/* Bottom holes */}
      {[2, 3, 4].map((i) => (
        <View
          key={`bottom-${i}`}
          style={[
            styles.hole,
            {
              width: holeSize,
              height: holeSize,
              borderRadius: holeRadius,
              left: edgeOffset - holeRadius,
              bottom: edgeOffset + i * spacing,
              opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hole: {
    position: "absolute",
    backgroundColor: theme.paper,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
  },
});
