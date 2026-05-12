import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  rightText?: string;
};

export default function HomeSectionTitle({
  title,
  subtitle,
  rightText,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightText ? (
        <Text style={styles.rightText}>
          {rightText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",

    marginBottom: 18,
    gap: 14,
  },

  left: {
    flex: 1,
  },

  title: {
    color: "#06251A",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
  },

  subtitle: {
    color: "#6B6B5F",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    marginTop: 5,
  },

  rightText: {
    color: "#1F5C42",
    fontSize: 13,
    fontWeight: "900",
  },
});