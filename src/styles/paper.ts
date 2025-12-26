import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const paperStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.paper,
  },

  // A faint red margin line on the left
  marginLine: {
    position: "absolute",
    left: 72, // on 3rd notebook line
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: theme.marginRed,
    opacity: 0.55,
  },

  content: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingLeft: 72, // pushes content to the right of the red margin line
  },

  rule: {
    height: 1,
    backgroundColor: theme.rule,
    marginVertical: 10,
  },
});

