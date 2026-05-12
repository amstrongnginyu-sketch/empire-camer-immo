import { useEffect, useRef, useState } from "react";
import { Animated, Linking, useWindowDimensions } from "react-native";

import DesktopPropertyCard from "./DesktopPropertyCard";
import MobilePropertyCard from "./MobilePropertyCard";

export type PropertyCardProps = {
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
    return data.map((fav: any) =>
      typeof fav === "string" ? { id: fav, date: 0 } : fav
    );
  } catch {
    return [];
  }
}

function saveFavorites(ids: any[]) {
  try {
    globalThis?.localStorage?.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {}
}

export function PropertyCard({ item, onPress, compact }: PropertyCardProps) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;
  const propertyId = String(item?.id || "");
  const phone = String(item?.sellerPhone || "").replace("+", "");

  const [favorite, setFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

    Linking.openURL(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    );
  }

  const sharedProps = {
    item,
    onPress,
    compact,
    favorite,
    scaleAnim,
    toggleFavorite,
    callSeller,
    whatsappSeller,
  };

  if (isPhone) {
    return <MobilePropertyCard {...sharedProps} />;
  }

  return <DesktopPropertyCard {...sharedProps} />;
}

export default PropertyCard;