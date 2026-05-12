import { StyleSheet, Text, View } from "react-native";

type Props = {
  totalProperties?: number;
  pendingProperties?: number;
  totalUsers?: number;
  totalViews?: number;
};

export default function AdminStats({
  totalProperties = 0,
  pendingProperties = 0,
  totalUsers = 0,
  totalViews = 0,
}: Props) {
  const stats = [
    {
      label: "Annonces",
      value: totalProperties,
      icon: "🏠",
      color: "#1F5C42",
    },
    {
      label: "En attente",
      value: pendingProperties,
      icon: "⏳",
      color: "#C98A00",
    },
    {
      label: "Utilisateurs",
      value: totalUsers,
      icon: "👥",
      color: "#2457C5",
    },
    {
      label: "Vues",
      value: totalViews,
      icon: "📈",
      color: "#A84A3A",
    },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((item) => (
        <View key={item.label} style={styles.card}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: `${item.color}15`,
              },
            ]}
          >
            <Text style={styles.icon}>{item.icon}</Text>
          </View>

          <Text style={styles.value}>
            {item.value}
          </Text>

          <Text style={styles.label}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: "100%",

    flexDirection: "row",
    flexWrap: "wrap",

    gap: 16,
    marginBottom: 20,
  },

  card: {
    flex: 1,
    minWidth: 180,

    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    padding: 22,

    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  iconBox: {
    width: 54,
    height: 54,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,
  },

  icon: {
    fontSize: 24,
  },

  value: {
    color: "#06251A",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    marginBottom: 6,
  },

  label: {
    color: "#6B6B5F",
    fontSize: 14,
    fontWeight: "700",
  },
});