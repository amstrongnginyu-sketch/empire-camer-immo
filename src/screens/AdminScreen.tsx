import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  properties?: any[];
  users?: any[];
  onApproveProperty?: (property: any) => void;
  onRejectProperty?: (property: any) => void;
  onDeleteProperty?: (property: any) => void;
  onBack?: () => void;
};

export function AdminScreen({
  properties = [],
  users = [],
  onApproveProperty,
  onRejectProperty,
  onDeleteProperty,
}: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;
  const isTablet = width >= 700 && width < 1100;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const total = properties.length;

    const pending = properties.filter(
      (item) => item?.status === "pending"
    ).length;

    const approved = properties.filter(
      (item) => item?.status === "approved"
    ).length;

    const rejected = properties.filter(
      (item) => item?.status === "rejected"
    ).length;

    setStats({
      total,
      pending,
      approved,
      rejected,
    });
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const text = `
        ${item?.title || ""}
        ${item?.city || ""}
        ${item?.quartier || ""}
        ${item?.sellerName || ""}
        ${item?.sellerPhone || ""}
      `.toLowerCase();

      const matchSearch = search
        ? text.includes(search.toLowerCase())
        : true;

      const matchFilter =
        filter === "all" ? true : item?.status === filter;

      return matchSearch && matchFilter;
    });
  }, [properties, search, filter]);

  function handleApprove(item: any) {
    Alert.alert(
      "Validation",
      "Valider cette annonce ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Valider",
          onPress: () => onApproveProperty?.(item),
        },
      ]
    );
  }

  function handleReject(item: any) {
    Alert.alert(
      "Refuser",
      "Refuser cette annonce ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Refuser",
          style: "destructive",
          onPress: () => onRejectProperty?.(item),
        },
      ]
    );
  }

  function handleDelete(item: any) {
    Alert.alert(
      "Suppression",
      "Supprimer définitivement cette annonce ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => onDeleteProperty?.(item),
        },
      ]
    );
  }

  function getStatusStyle(status?: string) {
    switch (status) {
      case "approved":
        return styles.statusApproved;

      case "rejected":
        return styles.statusRejected;

      default:
        return styles.statusPending;
    }
  }

  function getStatusText(status?: string) {
    switch (status) {
      case "approved":
        return "Validée";

      case "rejected":
        return "Refusée";

      default:
        return "En attente";
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isPhone && styles.contentMobile,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, isPhone && styles.headerMobile]}>
        <View>
          <Text style={[styles.title, isPhone && styles.titleMobile]}>
            Dashboard Admin
          </Text>

          <Text style={styles.subtitle}>
            Gestion des annonces et sécurité plateforme
          </Text>
        </View>

        <View style={styles.userBox}>
          <Text style={styles.userLabel}>Utilisateurs</Text>
          <Text style={styles.userValue}>{users.length}</Text>
        </View>
      </View>

      <View style={[styles.statsRow, isPhone && styles.statsRowMobile]}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total annonces</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.approved}</Text>
          <Text style={styles.statLabel}>Validées</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>Refusées</Text>
        </View>
      </View>

      <View style={[styles.filterBox, isPhone && styles.filterBoxMobile]}>
        <TextInput
          placeholder="Rechercher une annonce..."
          placeholderTextColor="#6B6B5F"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <View style={[styles.tabs, isPhone && styles.tabsMobile]}>
          {[
            { key: "all", label: "Toutes" },
            { key: "pending", label: "En attente" },
            { key: "approved", label: "Validées" },
            { key: "rejected", label: "Refusées" },
          ].map((tab) => {
            const active = filter === tab.key;

            return (
              <Pressable
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setFilter(tab.key as any)}
              >
                <Text
                  style={[
                    styles.tabText,
                    active && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.list}>
        {filteredProperties.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Aucune annonce trouvée.
            </Text>
          </View>
        ) : (
          filteredProperties.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                isPhone && styles.cardMobile,
              ]}
            >
              <View
                style={[
                  styles.cardTop,
                  isPhone && styles.cardTopMobile,
                ]}
              >
                <View style={styles.cardInfo}>
                  <Text
                    style={[
                      styles.cardTitle,
                      isPhone && styles.cardTitleMobile,
                    ]}
                    numberOfLines={2}
                  >
                    {item?.title || "Annonce immobilière"}
                  </Text>

                  <Text style={styles.cardMeta}>
                    📍 {item?.city || "-"} • {item?.quartier || "-"}
                  </Text>

                  <Text style={styles.cardMeta}>
                    👤 {item?.sellerName || "Non renseigné"}
                  </Text>

                  <Text style={styles.cardMeta}>
                    📞 {item?.sellerPhone || "-"}
                  </Text>

                  <Text style={styles.cardPrice}>
                    {Number(item?.price || 0).toLocaleString("fr-FR")} FCFA
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    getStatusStyle(item?.status),
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(item?.status)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.actions,
                  isPhone && styles.actionsMobile,
                ]}
              >
                <Pressable
                  style={styles.approveButton}
                  onPress={() => handleApprove(item)}
                >
                  <Text style={styles.approveText}>
                    ✅ Valider
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.rejectButton}
                  onPress={() => handleReject(item)}
                >
                  <Text style={styles.rejectText}>
                    ❌ Refuser
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={styles.deleteText}>
                    🗑 Supprimer
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },

  content: {
    padding: 24,
    paddingBottom: 60,
  },

  contentMobile: {
    padding: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },

  headerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#06251A",
  },

  titleMobile: {
    fontSize: 28,
  },

  subtitle: {
    marginTop: 6,
    color: "#51635A",
    fontWeight: "700",
  },

  userBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    alignItems: "center",
    minWidth: 120,
  },

  userLabel: {
    color: "#51635A",
    fontWeight: "700",
  },

  userValue: {
    color: "#1F5C42",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },

  statsRowMobile: {
    flexDirection: "column",
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  statValue: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1F5C42",
  },

  statLabel: {
    marginTop: 6,
    color: "#51635A",
    fontWeight: "700",
  },

  filterBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 22,
  },

  filterBoxMobile: {
    padding: 14,
  },

  searchInput: {
    backgroundColor: "#F4F7F5",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    borderRadius: 16,
    padding: 15,
    fontWeight: "800",
    color: "#06251A",
  },

  tabs: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },

  tabsMobile: {
    flexDirection: "column",
  },

  tab: {
    backgroundColor: "#F4F7F5",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  tabActive: {
    backgroundColor: "#1F5C42",
  },

  tabText: {
    color: "#06251A",
    fontWeight: "900",
  },

  tabTextActive: {
    color: "white",
  },

  list: {
    gap: 16,
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  emptyText: {
    color: "#51635A",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  cardMobile: {
    borderRadius: 18,
    padding: 16,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  cardTopMobile: {
    flexDirection: "column",
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#06251A",
  },

  cardTitleMobile: {
    fontSize: 18,
  },

  cardMeta: {
    marginTop: 8,
    color: "#51635A",
    fontWeight: "700",
  },

  cardPrice: {
    marginTop: 14,
    color: "#C9A646",
    fontWeight: "900",
    fontSize: 24,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  statusPending: {
    backgroundColor: "#FFF3C4",
  },

  statusApproved: {
    backgroundColor: "#EAF4EF",
  },

  statusRejected: {
    backgroundColor: "#FFE8EC",
  },

  statusText: {
    fontWeight: "900",
    color: "#06251A",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    flexWrap: "wrap",
  },

  actionsMobile: {
    flexDirection: "column",
  },

  approveButton: {
    backgroundColor: "#1F5C42",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  approveText: {
    color: "white",
    fontWeight: "900",
  },

  rejectButton: {
    backgroundColor: "#FFF3C4",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  rejectText: {
    color: "#7A5B00",
    fontWeight: "900",
  },

  deleteButton: {
    backgroundColor: "#FFE8EC",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  deleteText: {
    color: "#A84A3A",
    fontWeight: "900",
  },
});