import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useProperties } from "../hooks/useProperties";

type Props = {
  onBack: () => void;
};

export function AdminScreen({ onBack }: Props) {
  const { recentProperties, popularProperties } = useProperties(false);

  const [validatedIds, setValidatedIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const properties = useMemo(() => {
    const map = new Map<string, any>();

    [...recentProperties, ...popularProperties].forEach((item: any) => {
      if (item?.id && !deletedIds.includes(item.id)) {
        map.set(item.id, item);
      }
    });

    return Array.from(map.values());
  }, [recentProperties, popularProperties, deletedIds]);

  function validateProperty(id: string) {
    setValidatedIds((current) => [...current, id]);
    Alert.alert("Annonce validée", "L’annonce est maintenant approuvée.");
  }

  function deleteProperty(id: string) {
    Alert.alert(
      "Supprimer l’annonce",
      "Cette action va retirer l’annonce de la liste admin.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => setDeletedIds((current) => [...current, id]),
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack}>
        <Text style={styles.back}>← Retour</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Dashboard Admin</Text>
        <Text style={styles.subtitle}>
          Gérez les annonces, validations et contenus premium.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{properties.length}</Text>
          <Text style={styles.statLabel}>Annonces</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{validatedIds.length}</Text>
          <Text style={styles.statLabel}>Validées</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{deletedIds.length}</Text>
          <Text style={styles.statLabel}>Supprimées</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Annonces à contrôler</Text>

      {properties.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Aucune annonce disponible</Text>
          <Text style={styles.emptyText}>
            Les nouvelles annonces apparaîtront ici.
          </Text>
        </View>
      ) : (
        properties.map((item: any) => {
          const image = item?.images?.[0];
          const isValidated = validatedIds.includes(item.id);

          return (
            <View key={item.id} style={styles.card}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.noImage}>
                  <Text style={styles.noImageText}>Aucune image</Text>
                </View>
              )}

              <View style={styles.content}>
                <View style={styles.badges}>
                  <Text style={styles.badge}>{item.type || "Bien"}</Text>
                  <Text style={styles.badgeGold}>{item.purpose || "Vente"}</Text>
                  {item.boost && <Text style={styles.badgePremium}>Premium</Text>}
                  {isValidated && <Text style={styles.badgeValid}>Validée</Text>}
                </View>

                <Text style={styles.cardTitle}>
                  {item.title || "Annonce immobilière"}
                </Text>

                <Text style={styles.price}>
                  {Number(item.price || 0).toLocaleString("fr-FR")} FCFA
                </Text>

                <Text style={styles.location}>
                  📍 {item.city || "-"} • {item.quartier || "-"}
                </Text>

                <Text style={styles.agent}>
                  Agent : {item.agentName || item.sellerName || "Non renseigné"}
                </Text>

                <Text style={styles.phone}>
                  Contact : {item.sellerPhone || "Non renseigné"}
                </Text>

                <View style={styles.actions}>
                  <Pressable
                    style={[
                      styles.validateButton,
                      isValidated && styles.disabledButton,
                    ]}
                    onPress={() => validateProperty(item.id)}
                    disabled={isValidated}
                  >
                    <Text style={styles.validateText}>
                      {isValidated ? "Déjà validée" : "Valider"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => deleteProperty(item.id)}
                  >
                    <Text style={styles.deleteText}>Supprimer</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F6",
    padding: 18,
  },

  back: {
    color: "#1F5C42",
    fontWeight: "900",
    marginBottom: 14,
    fontSize: 16,
  },

  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 18,
  },

  title: {
    color: "#06251A",
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    color: "#51635A",
    fontWeight: "700",
    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  statValue: {
    color: "#C9A646",
    fontSize: 28,
    fontWeight: "900",
  },

  statLabel: {
    color: "#1F5C42",
    fontWeight: "900",
    marginTop: 4,
  },

  sectionTitle: {
    color: "#06251A",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 18,
  },

  image: {
    width: "100%",
    height: 230,
  },

  noImage: {
    height: 190,
    backgroundColor: "#EDF3EF",
    alignItems: "center",
    justifyContent: "center",
  },

  noImageText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  content: {
    padding: 18,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  badge: {
    backgroundColor: "#1F5C42",
    color: "white",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgeGold: {
    backgroundColor: "#F0D77A",
    color: "#06251A",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgePremium: {
    backgroundColor: "#FFF3C4",
    color: "#8A6A00",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgeValid: {
    backgroundColor: "#EAF4EF",
    color: "#1F5C42",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
    overflow: "hidden",
  },

  cardTitle: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
  },

  price: {
    color: "#C9A646",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 6,
  },

  location: {
    color: "#51635A",
    fontWeight: "800",
    marginTop: 8,
  },

  agent: {
    color: "#1D2E26",
    fontWeight: "800",
    marginTop: 10,
  },

  phone: {
    color: "#1D2E26",
    fontWeight: "800",
    marginTop: 4,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  validateButton: {
    flex: 1,
    backgroundColor: "#1F5C42",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#8BA89A",
  },

  validateText: {
    color: "white",
    fontWeight: "900",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#A84A3A",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  deleteText: {
    color: "white",
    fontWeight: "900",
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  emptyTitle: {
    color: "#06251A",
    fontSize: 20,
    fontWeight: "900",
  },

  emptyText: {
    color: "#51635A",
    fontWeight: "700",
    marginTop: 6,
  },
});