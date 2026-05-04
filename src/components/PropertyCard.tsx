import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  item: any;
  onPress?: () => void;
  onBoost?: (item: any) => void; // 💎 NEW
};

const FAVORITES_KEY = "empire_camer_immo_favorites";

function getSavedFavorites(): any[] {
  try {
    const raw = globalThis?.localStorage?.getItem(FAVORITES_KEY);
    const data = raw ? JSON.parse(raw) : [];

    return data.map((fav: any) => {
      if (typeof fav === "string") {
        return { id: fav, date: 0 };
      }
      return fav;
    });
  } catch {
    return [];
  }
}

function saveFavorites(ids: any[]) {
  try {
    globalThis?.localStorage?.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {}
}

export function PropertyCard({ item, onPress, onBoost }: Props) {
  const images = item?.images || [];
  const [imageIndex, setImageIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const lastTap = useRef<number | null>(null);

  const image = images[imageIndex];
  const propertyId = String(item?.id || "");
  const phone = String(item?.sellerPhone || "").replace("+", "");

  useEffect(() => {
    const favorites = getSavedFavorites();
    setFavorite(favorites.some((fav) => String(fav.id) === propertyId));
  }, [propertyId]);

  function animateHeart() {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.35,
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

  function nextImage(e?: any) {
    e?.stopPropagation?.();
    if (images.length === 0) return;
    setImageIndex((current) => (current + 1) % images.length);
  }

  function prevImage(e?: any) {
    e?.stopPropagation?.();
    if (images.length === 0) return;
    setImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  function handleImagePress(e?: any) {
    e?.stopPropagation?.();

    const now = Date.now();

    if (lastTap.current && now - lastTap.current < 300) {
      setImageOpen(true);
    }

    lastTap.current = now;
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

    Linking.openURL(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    );
  }

  return (
    <>
      <Pressable style={styles.card} onPress={onPress}>
        <View style={styles.imageBox}>
          {image ? (
            <Pressable onPress={handleImagePress} style={styles.imagePress}>
              <Image source={{ uri: image }} style={styles.image} />
            </Pressable>
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>Aucune image</Text>
            </View>
          )}

          <View style={styles.imageTopLeft}>
            <Text style={styles.verifyBadge}>✓ Vérifié</Text>
          </View>

          <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
            <Animated.Text
              style={[
                styles.favoriteText,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              {favorite ? "♥" : "♡"}
            </Animated.Text>
          </Pressable>

          {images.length > 1 && (
            <>
              <Pressable style={styles.prevButton} onPress={prevImage}>
                <Text style={styles.arrowText}>‹</Text>
              </Pressable>

              <Pressable style={styles.nextButton} onPress={nextImage}>
                <Text style={styles.arrowText}>›</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeGreen}>{item.type || "Bien"}</Text>
            <Text style={styles.badgeGold}>{item.purpose || "Vente"}</Text>

            {item.boost && (
              <Text style={styles.badgePremium}>💎 Premium / Boosté</Text>
            )}

            {favorite && <Text style={styles.badgeFavorite}>❤️ Favori</Text>}
          </View>

          <Text style={styles.price}>
            {Number(item.price || 0).toLocaleString("fr-FR")} FCFA
          </Text>

          <Text style={styles.meta} numberOfLines={1}>
            {item.type || "Bien"} | 🛏 {item.bedrooms || "-"} | 🚿{" "}
            {item.bathrooms || "-"} | 📐 {item.surface || "-"} m²
          </Text>

          <Text style={styles.title} numberOfLines={2}>
            {item.title || "Annonce immobilière"}
          </Text>

          <Text style={styles.location} numberOfLines={1}>
            📍 {item.city || "-"} • {item.quartier || "-"}
          </Text>

          <Text style={styles.agent} numberOfLines={1}>
            Agent : {item.agentName || item.sellerName || "Non renseigné"}
          </Text>

          <View style={styles.actions}>
            <Pressable style={styles.detailButton} onPress={onPress}>
              <Text style={styles.detailText}>Voir détails</Text>
            </Pressable>

            <Pressable style={styles.callButton} onPress={callSeller}>
              <Text style={styles.callText}>Appeler</Text>
            </Pressable>

            <Pressable style={styles.whatsappButton} onPress={whatsappSeller}>
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </Pressable>

            {/* 💎 BOOST */}
            <Pressable
              style={styles.boostButton}
              onPress={() => onBoost?.(item)}
            >
              <Text style={styles.boostText}>💎 Booster</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>

      <Modal visible={imageOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.closeModal}
            onPress={() => setImageOpen(false)}
          >
            <Text style={styles.closeModalText}>×</Text>
          </Pressable>

          <View style={styles.fullImageBox}>
            {image ? (
              <Image source={{ uri: image }} style={styles.fullImage} />
            ) : (
              <Text style={styles.noImageText}>Aucune image</Text>
            )}

            <Pressable style={styles.fullFavorite} onPress={toggleFavorite}>
              <Animated.Text
                style={[
                  styles.fullFavoriteText,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                {favorite ? "♥" : "♡"}
              </Animated.Text>
            </Pressable>
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
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 18,
    minHeight: 285,
  },

  imageBox: {
    width: "44%",
    minHeight: 285,
    backgroundColor: "#EDF3EF",
    position: "relative",
  },

  imagePress: { width: "100%", height: "100%" },

  image: { width: "100%", height: "100%" },

  noImage: {
    flex: 1,
    backgroundColor: "#EDF3EF",
    alignItems: "center",
    justifyContent: "center",
  },

  noImageText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  imageTopLeft: {
    position: "absolute",
    top: 14,
    left: 14,
  },

  verifyBadge: {
    backgroundColor: "rgba(255,255,255,0.96)",
    color: "#06251A",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
    overflow: "hidden",
  },

  favoriteButton: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(6,37,26,0.66)",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteText: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },

  prevButton: {
    position: "absolute",
    left: 12,
    top: "45%",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },

  nextButton: {
    position: "absolute",
    right: 12,
    top: "45%",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },

  arrowText: {
    color: "#06251A",
    fontSize: 28,
    fontWeight: "900",
  },

  details: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  badgeGreen: {
    backgroundColor: "#EAF4EF",
    color: "#1F5C42",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
  },

  badgeGold: {
    backgroundColor: "#F0D77A",
    color: "#06251A",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
  },

  badgePremium: {
    backgroundColor: "#FFF3C4",
    color: "#8A6A00",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
  },

  badgeFavorite: {
    backgroundColor: "#FFE8EC",
    color: "#A84A3A",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "900",
  },

  price: {
    color: "#C9A646",
    fontSize: 28,
    fontWeight: "900",
  },

  meta: {
    color: "#1D2E26",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 8,
  },

  title: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 14,
  },

  location: {
    color: "#51635A",
    fontWeight: "800",
    marginTop: 10,
  },

  agent: {
    color: "#6B6B5F",
    fontWeight: "800",
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },

  detailButton: {
    backgroundColor: "#EAF4EF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  detailText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  callButton: {
    backgroundColor: "#1F5C42",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  callText: {
    color: "white",
    fontWeight: "900",
  },

  whatsappButton: {
    backgroundColor: "#F0D77A",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  whatsappText: {
    color: "#06251A",
    fontWeight: "900",
  },

  boostButton: {
    backgroundColor: "#C9A646",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  boostText: {
    color: "#06251A",
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,37,26,0.88)",
    justifyContent: "center",
    alignItems: "center",
  },

  closeModal: {
    position: "absolute",
    top: 24,
    right: 28,
  },

  closeModalText: {
    color: "white",
    fontSize: 44,
    fontWeight: "900",
  },

  fullImageBox: {
    width: "92%",
    height: "82%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#EDF3EF",
  },

  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  fullFavorite: {
    position: "absolute",
    right: 22,
    bottom: 22,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(6,37,26,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },

  fullFavoriteText: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
  },
});