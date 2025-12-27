//import BinderHoles from "@/src/components/BinderHoles";
import MonthGoals from "@/src/screens/MonthGoals";
import MonthMain from "@/src/screens/MonthMain";
import { paperStyles } from "@/src/styles/paper";
import { theme, typography } from "@/src/styles/theme";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { migrate } from "../storage/db";




type PageKind = "main" | "goals";
type Page = { year: number; month: number; kind: PageKind }; // month 1..12

function monthLabel(year: number, month: number) {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month - 1, 1);
  d.setMonth(d.getMonth() + delta);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function isFutureMonth(year: number, month: number) {
  const now = new Date();
  const a = year * 12 + (month - 1);
  const b = now.getFullYear() * 12 + now.getMonth();
  return a > b;
}

function buildPages(centerYear: number, centerMonth: number) {
  // Past = full, Present = full, Future = main only.
  // We'll build a window around the current month for now.
  const pages: Page[] = [];

  // show 6 months back, current, 6 forward (light scaffolding)
  for (let i = -6; i <= 6; i++) {
    const { year, month } = addMonths(centerYear, centerMonth, i);
    pages.push({ year, month, kind: "main" });
    if (!isFutureMonth(year, month)) {
      pages.push({ year, month, kind: "goals" });
    }
  }
  return pages;
}

// Simple grid overlay component (faint blue graph paper)
function GridOverlay() {
  const spacing = 24;
  const lines = 70; // enough to cover most screens vertically
  const vLines = 25; // enough horizontally

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Horizontal lines */}
      {Array.from({ length: lines }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: i * spacing,
            height: 1,
            backgroundColor: theme.gridBlue,
            opacity: 0.25,
          }}
        />
      ))}
      {/* Vertical lines */}
      {Array.from({ length: vLines }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: i * spacing,
            width: 1,
            backgroundColor: theme.gridBlue,
            opacity: 0.18,
          }}
        />
      ))}
    </View>
  );
}

export default function NotebookPager() {
  const now = new Date();
  const [anchor, setAnchor] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [pickerOpen, setPickerOpen] = useState(false);

  const pages = useMemo(() => buildPages(anchor.year, anchor.month), [anchor.year, anchor.month]);

  // Find current month main page index
  const initialPage = useMemo(() => {
    const idx = pages.findIndex((p) => p.year === anchor.year && p.month === anchor.month && p.kind === "main");
    return Math.max(0, idx);
  }, [pages, anchor.year, anchor.month]);


  const [pageIndex, setPageIndex] = useState(initialPage);

  const current = pages[pageIndex] ?? pages[0];
  const title = monthLabel(current.year, current.month);
  const subtitle = current.kind === "main" ? "Main" : "Goals";

  const [ready, setReady] = useState(false);

    useEffect(() => {
    (async () => {
        await migrate();
        setReady(true);
    })();
    }, []);

    if (!ready) return null;

  return (
    <View style={paperStyles.page}>
      <GridOverlay />

      {/*<BinderHoles grid={24} variant={current.kind} />*/}

      <View style={paperStyles.marginLine} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>MindNote</Text>

        <Pressable onPress={() => setPickerOpen(true)} style={styles.monthRow}>
          <Text style={styles.monthText}>{title}</Text>
          <Text style={styles.subText}>· {subtitle}</Text>
        </Pressable>
      </View>

      <View style={paperStyles.rule} />

      {/* Pages */}
      <PagerView
        style={{ flex: 1 }}
        initialPage={initialPage}
        onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
        overdrag={false}
      >
        {pages.map((p, idx) => (
          <View key={`${p.year}-${p.month}-${p.kind}-${idx}`} style={paperStyles.content}>
            {p.kind === "main" ? (
              <MonthMain year={p.year} month={p.month} />
            ) : (
              <MonthGoals year={p.year} month={p.month} />
            )}
          </View>
        ))}
      </PagerView>
      

      {/* Very minimal month picker for big jumps (MVP placeholder) */}
      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Jump to month</Text>
            <Text style={styles.modalHint}>
              For MVP we’ll keep this simple. Next, we’ll add a proper month/year picker here.
            </Text>

            <View style={styles.modalRow}>
              <Pressable
                style={styles.modalBtn}
                onPress={() => {
                  const prev = addMonths(anchor.year, anchor.month, -1);
                  setAnchor(prev);
                  setPickerOpen(false);
                  setPageIndex(0);
                }}
              >
                <Text style={styles.modalBtnText}>← Prev</Text>
              </Pressable>

              <Pressable
                style={styles.modalBtn}
                onPress={() => {
                  const next = addMonths(anchor.year, anchor.month, 1);
                  setAnchor(next);
                  setPickerOpen(false);
                  setPageIndex(0);
                }}
              >
                <Text style={styles.modalBtnText}>Next →</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSmall}>
              Android: {Platform.OS} · Pager swipe is your page flip.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingLeft: 75, // align with content past margin
  },
  brand: {
    color: theme.ink,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.2,
  },
  monthRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  monthText: {
    color: theme.ink,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.medium,
  },
  subText: {
    color: "rgba(17,17,17,0.65)",
    fontSize: typography.size.md,
    fontWeight: typography.weight.regular,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    backgroundColor: theme.paper,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    padding: 14,
  },
  modalTitle: {
    color: theme.ink,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  modalHint: {
    marginTop: 6,
    color: "rgba(17,17,17,0.75)",
    fontSize: typography.size.md,
  },
  modalRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
  modalBtn: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
  },
  modalBtnText: {
    color: theme.ink,
    fontSize: typography.size.md,
    textAlign: "center",
    fontWeight: typography.weight.medium,
  },
  modalSmall: {
    marginTop: 10,
    color: "rgba(17,17,17,0.55)",
    fontSize: typography.size.sm,
  },
});
