import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Property = {
  id: string;
  title: string;
  city?: string;
  type?: string;
  price?: number;
  status?: string;
};

type Props = {
  properties?: Property[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onOpen?: (id: string) => void;
};

export default function AdminPropertyTable({
  properties = [],
  onApprove,
  onReject,
  onOpen,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Gestion des annonces
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.titleCol]}>
              Annonce
            </Text>

            <Text style={styles.headerCell}>
              Ville
            </Text>

            <Text style={styles.headerCell}>
              Type
            </Text>

            <Text style={styles.headerCell}>
              Prix
            </Text>

            <Text style={styles.headerCell}>
              Statut
            </Text>

            <Text style={styles.headerCell}>
              Actions
            </Text>
          </View>

          {properties.map((property) => (
            <View key={property.id} style={styles.row}>
              <Text style={[styles.cell, styles.titleCol]}>
                {property.title}
              </Text>

              <Text style={styles.cell}>
                {property.city || "-"}
              </Text>

              <Text style={styles.cell}>
                {property.type || "-"}
              </Text>

              <Text style={styles.cell}>
                {Number(property.price || 0).toLocaleString("fr-FR")} FCFA
              </Text>

              <View style={styles.statusBox}>
                <Text style={styles.statusText}>
                  {property.status || "pending"}
                </Text>
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={styles.openButton}
                  onPress={() => onOpen?.(property.id)}
                >
                  <Text style={styles.openText}>Voir</Text>
                </Pressable>

                <Pressable
                  style={styles.approveButton}
                  onPress={() => onApprove?.(property.id)}
                >
                  <Text style={styles.approveText}>Valider</Text>
                </Pressable>

                <Pressable
                  style={styles.rejectButton}
                  onPress={() => onReject?.(property.id)}
                >
                  <Text style={styles.rejectText}>Refuser</Text>
                </Pressable>
              </View>
            </View>
          ))}

          {properties.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Aucune annonce disponible.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#F5F7F4",
    borderRadius: 14,
    marginBottom: 10,
    paddingVertical: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#EEF2EF",
  },

  headerCell: {
    width: 120,
    color: "#06251A",
    fontWeight: "900",
    fontSize: 13,
    paddingHorizontal: 10,
  },

  cell: {
    width: 120,
    color: "#34433B",
    fontWeight: "700",
    fontSize: 13,
    paddingHorizontal: 10,
  },

  titleCol: {
    width: 240,
  },

  statusBox: {
    width: 120,
    paddingHorizontal: 10,
  },

  statusText: {
    alignSelf: "flex-start",

    backgroundColor: "#EAF4EF",

    color: "#1F5C42",

    paddingVertical: 6,
    paddingHorizontal: 10,

    borderRadius: 999,

    fontSize: 11,
    fontWeight: "900",
  },

  actions: {
    width: 250,

    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 10,
  },

  openButton: {
    backgroundColor: "#EEF2EF",

    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 12,
  },

  approveButton: {
    backgroundColor: "#1F5C42",

    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 12,
  },

  rejectButton: {
    backgroundColor: "#FFF1F0",

    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 12,
  },

  openText: {
    color: "#06251A",
    fontWeight: "900",
    fontSize: 12,
  },

  approveText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  rejectText: {
    color: "#A84A3A",
    fontWeight: "900",
    fontSize: 12,
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