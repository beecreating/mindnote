import PaperCard from "@/src/components/PaperCard";
import { deleteDayNote, getMonthNotes, upsertDayNote } from "@/src/storage/db";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthTitle(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
}

function weekdayLetter(year: number, month: number, day: number) {
  const d = new Date(year, month - 1, day);
  const map = ["S", "M", "T", "W", "T", "F", "S"]; // Sun..Sat (Finnish vibe)
  return map[d.getDay()];
}

export default function MonthMain({ year, month }: { year: number; month: number }) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const totalDays = useMemo(() => daysInMonth(year, month), [year, month]);

  async function refresh() {
    const m = await getMonthNotes(year, month);
    setNotes(m ?? {});
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.centerColumn}>
        <PaperCard style={styles.card}>
            <Text style={styles.title}>{monthTitle(year, month)}</Text>

            <View style={styles.list}>
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                const key = isoDate(year, month, day);
                const note = notes[key] ?? "";
                const hasNote = note.trim().length > 0;

                return (
                <Pressable
                    key={key}
                    style={styles.row}
                    onPress={() => {
                    setOpenDay(day);
                    setDraft(note);
                    }}
                >
                    <View style={styles.margin}>
                    <Text style={styles.wd}>{weekdayLetter(year, month, day)}</Text>
                    <Text style={styles.day}>{day}</Text>
                    </View>

                    <View style={styles.noteLane}>
                    <Text style={styles.note} numberOfLines={2}>
                        {hasNote ? note : " "}
                    </Text>
                    </View>
                </Pressable>
                );
            })}
            </View>
        </PaperCard>
        </View>

      <Modal transparent visible={openDay !== null} animationType="fade" onRequestClose={() => setOpenDay(null)}>
        <Pressable style={styles.backdrop} onPress={() => setOpenDay(null)}>
          <Pressable style={styles.modal} onPress={() => {}}>
            <Text style={styles.modalTitle}>
              {openDay ? `${isoDate(year, month, openDay)}` : ""}
            </Text>

            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Write a note…"
              placeholderTextColor="rgba(0,0,0,0.35)"
              multiline
              style={styles.input}
              autoFocus
            />

            <View style={styles.modalRow}>
              <Pressable style={styles.btn} onPress={() => setOpenDay(null)}>
                <Text style={styles.btnText}>Close</Text>
              </Pressable>

              <Pressable
                style={styles.btn}
                onPress={async () => {
                  if (!openDay) return;
                  const k = isoDate(year, month, openDay);
                  const trimmed = draft.trim();

                  if (!trimmed) await deleteDayNote(k);
                  else await upsertDayNote(k, trimmed);

                  setOpenDay(null);
                  await refresh();
                }}
              >
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
  paddingTop: 16,
  paddingBottom: 40,
  paddingHorizontal: 16, // keep symmetric
    },
    
    card: {
    padding: 12,
    width: "100%",
    maxWidth: 420,     // 👈 controls the “sheet width”
    marginHorizontal: -16, // 👈 spills over evenly left + right
    },

    centerColumn: {
    alignItems: "center",
    },


  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },

  list: {
    gap: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },

  margin: {
    width: 68,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "rgba(190, 80, 80, 0.25)", // faint “margin line”
  },

  wd: {
    width: 14,
    color: "rgba(0,0,0,0.55)",
    marginTop: 2,
  },

  day: {
    width: 30,
    fontSize: 18,
    fontWeight: "600",
  },

  noteLane: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 2,
  },

  note: {
    fontSize: 16,
    lineHeight: 20,
    color: "rgba(0,0,0,0.85)",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    padding: 14,
    gap: 10,
  },
  modalTitle: { fontSize: 16, fontWeight: "600" },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    padding: 10,
    fontSize: 16,
  },
  modalRow: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
    paddingVertical: 10,
  },
  btnText: { textAlign: "center", fontWeight: "600" },
});
