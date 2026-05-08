import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  item: any;
  onPress?: () => void;
  onBoost?: (item: any) => void;
  compact?: boolean;
};

const FAVORITES_KEY = "empire_camer_immo_favorites";

function getSavedFavorites(): any[] {
  try {
    const raw = globalThis?.localStorage?.getItem(FAVORITES_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return data.map((fav: any) => (typeof fav === "string" ? { id: fav, date: 0 } : fav));
  } catch {
    return [];
  }
}

function saveFavorites(ids: any[]) {
  try {
    globalThis?.localStorage?.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {}
}

export function PropertyCard({ item, onPress }: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;
  const isTablet = width >= 700 && width < 1024;
  const isDesktop = width >= 1024;

  const images = item?.images || [];
  const image = images[0];

  const [favorite, setFavorite] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const propertyId = String(item?.id || "");
  const phone = String(item?.sellerPhone || "").replace("+", "");

  useEffect(() => {
    const favorites = getSavedFavorites();
    setFavorite(favorites.some((fav) => String(fav.id) === propertyId));
  }, [propertyId]);

  function animateHeart() {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.25,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function toggleFavorite(e?: any) {
    e?.stopPropagation?.();

    const favorites = getSavedFavorites();
    const exists = favorites.some((fav) => String(fav.id) === propertyId);

    let nextFavorites;

    if (exists) {
      nextFavorites = favorites.filter((fav) => String(fav.id) !== propertyId);
      setFavorite(false);
    } else {
      nextFavorites = [{ id: propertyId, date: Date.now() }, ...favorites];
      setFavorite(true);
      animateHeart();
    }

    saveFavorites(nextFavorites);
  }

  function callSeller(e?: any) {
    e?.stopPropagation?.();
    if (!item?.sellerPhone) return;
    Linking.openURL(`tel:${item.sellerPhone}`);
  }

  function whatsappSeller(e?: any) {
    e?.stopPropagation?.();
    if (!item?.sellerPhone) return;

    const message = `Bonjour, je suis intéressé par votre annonce : ${
      item?.title || "Annonce immobilière"
    }`;

    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  }

  return (
    <>
      <Pressable
        style={[
          styles.card,
          isPhone && styles.cardPhone,
          isTablet && styles.cardTablet,
          isDesktop && styles.cardDesktop,
        ]}
        onPress={onPress}
      >
        <Pressable
          style={[
            styles.imageBox,
            isPhone && styles.imageBoxPhone,
            isTablet && styles.imageBoxTablet,
            isDesktop && styles.imageBoxDesktop,
          ]}
          onPress={(e: any) => {
            e?.stopPropagation?.();
            setImageOpen(true);
          }}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>Aucune image</Text>
            </View>
          )}

          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Vérifié</Text>
          </View>

          <Pressable
            style={[styles.favoriteButton, favorite && styles.favoriteButtonActive]}
            onPress={toggleFavorite}
          >
            <Animated.Text
              style={[
                styles.favoriteText,
                favorite && styles.favoriteTextActive,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              {favorite ? "♥" : "♡"}
            </Animated.Text>
          </Pressable>
        </Pressable>

        <View
          style={[
            styles.details,
            isPhone && styles.detailsPhone,
            isTablet && styles.detailsTablet,
            isDesktop && styles.detailsDesktop,
          ]}
        >
          <View style={styles.badgeRow}>
            <Text style={styles.badgeGreen}>{item.type || "Bien"}</Text>
            <Text style={styles.badgeGold}>{item.purpose || "Vente"}</Text>
            {item.boost && <Text style={styles.badgePremium}>💎 Premium</Text>}
          </View>

          <Text style={[styles.price, isPhone && styles.pricePhone]}>
            {Number(item.price || 0).toLocaleString("fr-FR")} FCFA
          </Text>

          <Text style={styles.meta} numberOfLines={1}>
            🛏 {item.bedrooms || "-"} | 🚿 {item.bathrooms || "-"} | 📐 {item.surface || "-"} m²
          </Text>

          <Text style={[styles.title, isPhone && styles.titlePhone]} numberOfLines={2}>
            {item.title || "Annonce immobilière"}
          </Text>

          <Text style={styles.location} numberOfLines={1}>
            📍 {item.city || "-"} • {item.quartier || "-"}
          </Text>

          <Text style={styles.agent} numberOfLines={1}>
            Agent : {item.agentName || item.sellerName || "Non renseigné"}
          </Text>

          <View style={styles.actions}>
            <Pressable style={styles.callButton} onPress={callSeller}>
              <Text style={styles.callText}>Appeler</Text>
            </Pressable>

            <Pressable style={styles.whatsappButton} onPress={whatsappSeller}>
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>

      <Modal visible={imageOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.closeModal} onPress={() => setImageOpen(false)}>
            <Text style={styles.closeModalText}>×</Text>
          </Pressable>

          <View style={styles.modalImageBox}>
            {image ? (
              <Image source={{ uri: image }} style={styles.modalImage} />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>Aucune image</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 18,
  },

  cardPhone: {
    flexDirection: "column",
    borderRadius: 22,
  },

  cardTablet: {
    flexDirection: "row",
    minHeight: 260,
  },

  cardDesktop: {
    flexDirection: "row",
    minHeight: 300,
  },

  imageBox: {
    backgroundColor: "#EDF3EF",
    position: "relative",
  },

  imageBoxPhone: {
    width: "100%",
    height: 220,
  },

  imageBoxTablet: {
    width: "52%",
    minHeight: 260,
  },

  imageBoxDesktop: {
    width: "56%",
    minHeight: 300,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF3EF",
  },

  noImageText: {
    color: "#1F5C42",
    fontWeight: "900",
    fontSize: 15,
  },

  verifiedBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  verifiedText: {
    color: "#06251A",
    fontWeight: "900",
    fontSize: 12,
  },

  favoriteButton: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(6,37,26,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteButtonActive: {
    backgroundColor: "#FFE8EC",
  },

  favoriteText: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
  },

  favoriteTextActive: {
    color: "#D71920",
  },

  details: {
    flex: 1,
    justifyContent: "center",
  },

  detailsPhone: {
    padding: 16,
  },

  detailsTablet: {
    padding: 18,
  },

  detailsDesktop: {
    padding: 22,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 10,
  },

  badgeGreen: {
    backgroundColor: "#EAF4EF",
    color: "#1F5C42",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "900",
    fontSize: 12,
  },

  badgeGold: {
    backgroundColor: "#F0D77A",
    color: "#06251A",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "900",
    fontSize: 12,
  },

  badgePremium: {
    backgroundColor: "#FFF3C4",
    color: "#8A6A00",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "900",
    fontSize: 12,
  },

  price: {
    color: "#C9A646",
    fontSize: 25,
    fontWeight: "900",
  },

  pricePhone: {
    fontSize: 22,
  },

  meta: {
    color: "#1D2E26",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
  },

  title: {
    color: "#06251A",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 10,
  },

  titlePhone: {
    fontSize: 18,
  },

  location: {
    color: "#51635A",
    fontWeight: "800",
    marginTop: 7,
    fontSize: 13,
  },

  agent: {
    color: "#6B6B5F",
    fontWeight: "800",
    marginTop: 6,
    fontSize: 12,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  callButton: {
    flex: 1,
    backgroundColor: "#1F5C42",
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: "center",
  },

  whatsappButton: {
    flex: 1,
    backgroundColor: "#F0D77A",
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: "center",
  },

  callText: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
  },

  whatsappText: {
    color: "#06251A",
    fontWeight: "900",
    fontSize: 13,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,37,26,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  closeModal: {
    position: "absolute",
    top: 28,
    right: 28,
    zIndex: 10,
  },

  closeModalText: {
    color: "white",
    fontSize: 42,
    fontWeight: "900",
  },

  modalImageBox: {
    width: "100%",
    height: "72%",
    backgroundColor: "#EDF3EF",
    borderRadius: 24,
    overflow: "hidden",
  },

  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});