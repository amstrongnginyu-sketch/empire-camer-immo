import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  property: any;
  onBack: () => void;
};

export function PropertyDetailScreen({ property, onBack }: Props) {
  const [isBoosted, setIsBoosted] = useState(Boolean(property?.boost));

  const phone = String(property?.sellerPhone || "").replace("+", "");
  const images = property?.images || [];

  function callSeller() {
    if (!property?.sellerPhone) {
      Alert.alert("Contact indisponible", "Aucun numéro trouvé.");
      return;
    }

    Linking.openURL(`tel:${property.sellerPhone}`);
  }

  function whatsappSeller() {
    if (!property?.sellerPhone) {
      Alert.alert("WhatsApp indisponible", "Aucun numéro WhatsApp trouvé.");
      return;
    }

    const message = `Bonjour, je suis intéressé par votre annonce : ${property.title}`;
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  }

  function openMap() {
    const address = `${property.city || ""} ${property.quartier || ""} ${
      property.reference || ""
    } Cameroun`;

    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    );
  }

  function handleBoost() {
    setIsBoosted(true);
  }

  return (
    <LinearGradient colors={["#FFFFFF", "#F7F8F6", "#EEF2F0"]} style={styles.bg}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>← Retour aux annonces</Text>
        </Pressable>

        <View style={styles.gallery}>
          <View style={styles.mainImageBox}>
            {images[0] ? (
              <Image source={{ uri: images[0] }} style={styles.mainImage} />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>Aucune image</Text>
              </View>
            )}

            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>
                📷 {images.length} photo{images.length > 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          <View style={styles.sideImages}>
            {[1, 2, 3].map((index) =>
              images[index] ? (
                <Image key={index} source={{ uri: images[index] }} style={styles.sideImage} />
              ) : (
                <View key={index} style={styles.sidePlaceholder}>
                  <Text style={styles.sidePlaceholderText}>+</Text>
                </View>
              )
            )}
          </View>
        </View>

        <View style={styles.layout}>
          <View style={styles.contentCard}>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>{property.type || "Bien"}</Text>
              <Text style={styles.badgeGold}>{property.purpose || "Vente"}</Text>
              <Text style={styles.badgeRed}>Vérifié</Text>

              {isBoosted && <Text style={styles.badgePremium}>💎 Premium / Boosté</Text>}
            </View>

            <Text style={styles.price}>
              {Number(property.price || 0).toLocaleString("fr-FR")} FCFA
            </Text>

            <Text style={styles.location}>
              📍 {property.city || "-"} • {property.quartier || "-"}
            </Text>

            <Text style={styles.title}>
              {property.title || "Annonce immobilière"}
            </Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>🛏</Text>
                <Text style={styles.infoValue}>{property.bedrooms || "-"}</Text>
                <Text style={styles.infoLabel}>Chambres</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>🚿</Text>
                <Text style={styles.infoValue}>{property.bathrooms || "-"}</Text>
                <Text style={styles.infoLabel}>Douches</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>📐</Text>
                <Text style={styles.infoValue}>{property.surface || "-"} m²</Text>
                <Text style={styles.infoLabel}>Habitable</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>🌍</Text>
                <Text style={styles.infoValue}>{property.landSurface || "-"} m²</Text>
                <Text style={styles.infoLabel}>Terrain</Text>
              </View>
            </View>

            {!isBoosted ? (
              <Pressable style={styles.boostButton} onPress={handleBoost}>
                <Text style={styles.boostText}>🚀 Booster cette annonce</Text>
              </Pressable>
            ) : (
              <View style={styles.boostedBox}>
                <Text style={styles.boostedText}>
                  💎 Cette annonce est maintenant en mode Premium / Boosté
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description du bien</Text>
              <Text style={styles.description}>
                {property.description || "Aucune description disponible."}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Localisation</Text>
              <Text style={styles.description}>
                {property.city || "-"} • {property.quartier || "-"}
                {property.reference ? ` • ${property.reference}` : ""}
              </Text>

              <Pressable style={styles.mapWideButton} onPress={openMap}>
                <Text style={styles.mapWideText}>Voir sur Google Maps</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.agentCard}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentAvatarText}>
                {(property.agentName || property.sellerName || "E")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>

            <Text style={styles.agentName}>
              {property.agentName || property.sellerName || "Empire Immo"}
            </Text>

            <Text style={styles.agentCompany}>
              {property.company || "Compagnie non renseignée"}
            </Text>

            <View style={styles.agentBadges}>
              <Text style={styles.agentBadge}>Annonce vérifiée</Text>
              <Text style={styles.agentBadgeGold}>Réponse rapide</Text>
            </View>

            <Pressable style={styles.callButton} onPress={callSeller}>
              <Text style={styles.callText}>Appeler</Text>
            </Pressable>

            <Pressable style={styles.whatsappButton} onPress={whatsappSeller}>
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </Pressable>

            <Pressable style={styles.mapButton} onPress={openMap}>
              <Text style={styles.mapText}>Map</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    padding: 18,
  },

  back: {
    color: "#1F5C42",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 16,
  },

  gallery: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  mainImageBox: {
    flex: 2.2,
    height: 390,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#F1F4EF",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E1E8DF",
  },

  mainImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  noImageText: {
    color: "#1F5C42",
    fontWeight: "900",
    fontSize: 16,
  },

  imageBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(31,92,66,0.92)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  imageBadgeText: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
  },

  sideImages: {
    flex: 0.9,
    gap: 10,
  },

  sideImage: {
    flex: 1,
    width: "100%",
    borderRadius: 18,
    backgroundColor: "#F1F4EF",
  },

  sidePlaceholder: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#F1F4EF",
    borderWidth: 1,
    borderColor: "#E1E8DF",
    alignItems: "center",
    justifyContent: "center",
  },

  sidePlaceholderText: {
    fontSize: 28,
    color: "#1F5C42",
    fontWeight: "900",
  },

  layout: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },

  contentCard: {
    flex: 2.1,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E1E8DF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },

  agentCard: {
    flex: 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E1E8DF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  badge: {
    backgroundColor: "#1F5C42",
    color: "white",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgeGold: {
    backgroundColor: "#F0D77A",
    color: "#06251A",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgeRed: {
    backgroundColor: "#A84A3A",
    color: "white",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgePremium: {
    backgroundColor: "#FFF3C4",
    color: "#8A6A00",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    overflow: "hidden",
  },

  price: {
    color: "#C9A646",
    fontSize: 32,
    fontWeight: "900",
  },

  location: {
    marginTop: 8,
    color: "#51635A",
    fontSize: 16,
    fontWeight: "800",
  },

  title: {
    marginTop: 18,
    fontSize: 24,
    lineHeight: 31,
    color: "#06251A",
    fontWeight: "900",
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },

  infoBox: {
    flex: 1,
    minWidth: 140,
    backgroundColor: "#F8FAF7",
    borderWidth: 1,
    borderColor: "#E1E8DF",
    borderRadius: 18,
    padding: 14,
  },

  infoIcon: {
    fontSize: 18,
  },

  infoValue: {
    marginTop: 4,
    color: "#06251A",
    fontSize: 20,
    fontWeight: "900",
  },

  infoLabel: {
    marginTop: 3,
    color: "#6B6B5F",
    fontSize: 13,
    fontWeight: "800",
  },

  boostButton: {
    backgroundColor: "#F0D77A",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 22,
  },

  boostText: {
    color: "#06251A",
    fontWeight: "900",
    fontSize: 16,
  },

  boostedBox: {
    backgroundColor: "#FFF3C4",
    borderWidth: 1,
    borderColor: "#F0D77A",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 22,
  },

  boostedText: {
    color: "#8A6A00",
    fontWeight: "900",
    fontSize: 15,
  },

  section: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E1E8DF",
  },

  sectionTitle: {
    fontSize: 20,
    color: "#1F5C42",
    fontWeight: "900",
    marginBottom: 10,
  },

  description: {
    color: "#1D2E26",
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "600",
  },

  mapWideButton: {
    marginTop: 16,
    backgroundColor: "#A84A3A",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  mapWideText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },

  agentAvatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#1F5C42",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  agentAvatarText: {
    color: "#F0D77A",
    fontSize: 32,
    fontWeight: "900",
  },

  agentName: {
    color: "#06251A",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  agentCompany: {
    color: "#6B6B5F",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6,
    textAlign: "center",
  },

  agentBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginVertical: 16,
    justifyContent: "center",
  },

  agentBadge: {
    backgroundColor: "#EAF4EF",
    color: "#1F5C42",
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 11,
    fontWeight: "900",
    fontSize: 11,
    overflow: "hidden",
  },

  agentBadgeGold: {
    backgroundColor: "#FFF3C4",
    color: "#6B5715",
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 11,
    fontWeight: "900",
    fontSize: 11,
    overflow: "hidden",
  },

  callButton: {
    width: "100%",
    backgroundColor: "#1F5C42",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 6,
  },

  whatsappButton: {
    width: "100%",
    backgroundColor: "#F0D77A",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 9,
  },

  mapButton: {
    width: "100%",
    backgroundColor: "#A84A3A",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 9,
  },

  callText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },

  whatsappText: {
    color: "#06251A",
    fontSize: 16,
    fontWeight: "900",
  },

  mapText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
});