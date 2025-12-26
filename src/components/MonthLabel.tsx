/*


    // src/components/MonthLabel.tsx
    import React, { useMemo } from "react";
    import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

    // Muted, paper-friendly month palette (same hue family used everywhere).
    // These are intentionally dusty/academic, not neon.
    export const MONTH_TAPE_COLORS: Record<number, string> = {
    1: "#E7DCC7",  // Jan parchment
    2: "#E4C4C9",  // Feb dusty rose
    3: "#CFE0C8",  // Mar sage
    4: "#CFE3E3",  // Apr mist
    5: "#D6D2EA",  // May lavender-gray
    6: "#F0D7B8",  // Jun apricot paper
    7: "#F1E3A6",  // Jul soft ochre
    8: "#D8E6B8",  // Aug light olive
    9: "#C6D7EF",  // Sep dusty blue
    10: "#E8C8A8", // Oct clay
    11: "#D2D2D2", // Nov graphite
    12: "#C7DDEE", // Dec winter blue
    };

    type Variant = "main" | "goals";

    type Props = {
    year: number;
    month: number; // 1..12
    variant: Variant;
    subtitle?: string; // "Main" | "Goals"
    locale?: string; // default "en-US"
    };

   
    function shiftHex(hex: string, percent: number) {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return hex;

    const num = parseInt(clean, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent) / 100;

    r = Math.round((t - r) * p + r);
    g = Math.round((t - g) * p + g);
    b = Math.round((t - b) * p + b);

    const out = (1 << 24) + (r << 16) + (g << 8) + b;
    return `#${out.toString(16).slice(1)}`;
    }

    function monthLabel(year: number, month: number, locale: string) {
    const d = new Date(year, month - 1, 1);
    return d.toLocaleString(locale, { month: "long", year: "numeric" });
    }


    export default function MonthLabel({
    year,
    month,
    variant,
    locale = "en-US",
    }: Props) {
    const { width } = useWindowDimensions();

    const base = MONTH_TAPE_COLORS[month] ?? "#D8D8D8";

    // Main: lighter, Goals: darker (same hue).
    const tapeColor = useMemo(() => {
        return variant === "main" ? shiftHex(base, +6) : shiftHex(base, -10);
    }, [base, variant]);

    // Tape length relative to screen (keeps it consistent across phones).
    const tapeWidth = useMemo(() => {
        const w = variant === "main" ? width * 0.72 : width * 0.58;
        // Keep it sane on very wide screens
        return Math.min(w, 520);
    }, [width, variant]);

    const title = useMemo(() => monthLabel(year, month, locale), [year, month, locale]);

    return (
        <View style={styles.wrap}>
        {/* Tape lives behind both lines }
        <View
            pointerEvents="none"
            style={[
            styles.tape,
            {
                width: tapeWidth,
                backgroundColor: tapeColor,
                opacity: variant === "main" ? 0.85 : 0.92,
                transform: [{ rotate: variant === "main" ? "-0.4deg" : "-0.6deg" }],
            },
            ]}
        />

        {/* Tiny texture layer to stop it feeling flat (still subtle) }
        <View
            pointerEvents="none"
            style={[
            styles.tapeTexture,
            {
                width: tapeWidth,
                opacity: 0.10,
            },
            ]}
        />

            <Text style={styles.month}>{title}</Text>
            {subtitle && (
            <Text style={styles.subtitle}>· {subtitle}</Text>
            )}
        </View>
    );
    }

    const styles = StyleSheet.create({
    wrap: {
        position: "relative",
        alignSelf: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 6,
    },

    subtitle: {
        marginTop: 2,
        fontSize: 13,
        color: "rgba(17,17,17,0.6)",
        letterSpacing: 0.2,
        },

    // Washi tape block behind the text
    tape: {
        position: "absolute",
        left: -4,
        top: 12, // sits through ~half of "MindNote" and continues behind month line
        height: 52, // ~2 grid squares if your spacing is 24
        borderRadius: 2, // not pill-shaped
    },

    // Micro texture: thin lines like paper fibers (super faint)
    tapeTexture: {
        position: "absolute",
        left: -4,
        top: 12,
        height: 52,
        borderRadius: 2,
        // A simple faux-texture using semi-transparent stripes
        backgroundColor: "transparent",
        borderWidth: 0,
        // We'll simulate texture with a few overlay rules below
    },

    brand: {
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 0.2,
        color: "#111111",
    },
    month: {
        marginTop: 6,
        fontSize: 20,
        fontWeight: "500",
        color: "#111111",
    },
    }); 

*/
