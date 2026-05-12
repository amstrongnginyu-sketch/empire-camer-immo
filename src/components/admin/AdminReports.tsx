import { Pressable, StyleSheet, Text, View } from "react-native";

type Report = {
  id: string;
  reason: string;
  propertyTitle?: string;
  reporter?: string;
};

type Props = {
  reports?: Report[];
  onReview?: (id: string) => void;
};

export default function AdminReports({
  reports = [],
  onReview,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Signalements annonces
      </Text>

      {reports.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Aucun signalement actuellement.
          </Text>
        </View>
      ) : (
        reports.map((report) => (
          <View key={report.id} style={styles.card}>
            <View style={styles.top}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Signalement</Text>
              </View>

              <Text style={styles.reporter}>
                {report.reporter || "Utilisateur"}
              </Text>
            </View>

            <Text style={styles.propertyTitle}>
              {report.propertyTitle || "Annonce"}
            </Text>

            <Text style={styles.reason}>
              {report.reason}
            </Text>

            <Pressable
              style={styles.reviewButton}
              onPress={() => onReview?.(report.id)}
            >
              <Text style={styles.reviewText}>
                Examiner
              </Text>
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",

    borderRadius: 24,
    padding: 22,

    borderWidth: 1,
    borderColor: "#E3EAE6",

    marginBottom: 20,
  },

  title: {
    color: "#06251A",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
  },

  card: {
    backgroundColor: "#FFF7F4",

    borderRadius: 18,

    padding: 18,

    borderWidth: 1,
    borderColor: "#F3D7D0",

    marginBottom: 14,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 12,
  },

  badge: {
    backgroundColor: "#A84A3A",

    paddingVertical: 6,
    paddingHorizontal: 10,

    borderRadius: 999,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  reporter: {
    color: "#6B6B5F",
    fontSize: 12,
    fontWeight: "700",
  },

  propertyTitle: {
    color: "#06251A",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  reason: {
    color: "#5F655F",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    marginBottom: 14,
  },

  reviewButton: {
    alignSelf: "flex-start",

    backgroundColor: "#1F5C42",

    paddingVertical: 10,
    paddingHorizontal: 16,

    borderRadius: 14,
  },

  reviewText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  empty: {
    paddingVertical: 30,
    alignItems: "center",
  },

  emptyText: {
    color: "#6B6B5F",
    fontWeight: "700",
  },
});