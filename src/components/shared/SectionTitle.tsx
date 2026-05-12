import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  rightText?: string;
};

export default function SectionTitle({
  title,
  subtitle,
  rightText,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>

        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>

      {rightText ? (
        <Text style={styles.rightText}>{rightText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,

    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    gap: 12,
  },

  left: {
    flex: 1,
  },

  title: {
    color: "#06251A",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },

  subtitle: {
    color: "#6B6B5F",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
    lineHeight: 20,
  },

  rightText: {
    color: "#1F5C42",
    fontSize: 13,
    fontWeight: "900",
  },
});