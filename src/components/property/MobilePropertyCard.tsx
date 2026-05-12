import { Pressable, StyleSheet, Text, View } from "react-native";
import { PropertyActions } from "./PropertyActions";
import { PropertyBadges } from "./PropertyBadges";
import { PropertyImage } from "./PropertyImage";
import { PropertyMeta } from "./PropertyMeta";

type Props = {
  item: any;
  onPress?: () => void;
  compact?: boolean;
  favorite: boolean;
  scaleAnim: any;
  toggleFavorite: (e?: any) => void;
  callSeller: (e?: any) => void;
  whatsappSeller: (e?: any) => void;
};

export function MobilePropertyCard({
  item,
  onPress,
  favorite,
  scaleAnim,
  toggleFavorite,
  callSeller,
  whatsappSeller,
}: Props) {
  const images = item?.images || [];
  const image = images[0];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <PropertyImage
        image={image}
        height={220}
        favorite={favorite}
        scaleAnim={scaleAnim}
        onToggleFavorite={toggleFavorite}
      />

      <View style={styles.details}>
        <PropertyBadges item={item} />

        <Text style={styles.price}>
          {Number(item?.price || 0).toLocaleString("fr-FR")} FCFA
        </Text>

        <PropertyMeta item={item} />

        <Text style={styles.title} numberOfLines={2}>
          {item?.title || "Annonce immobilière"}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          📍 {item?.city || "-"} • {item?.quartier || "-"}
        </Text>

        <Text style={styles.agent} numberOfLines={1}>
          Agent : {item?.agentName || item?.sellerName || "Non renseigné"}
        </Text>

        <PropertyActions
          onCall={callSeller}
          onWhatsapp={whatsappSeller}
          mobile
        />
      </View>
    </Pressable>
  );
}

export default MobilePropertyCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    marginBottom: 18,
  },

  details: {
    padding: 16,
  },

  price: {
    color: "#C9A646",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },

  title: {
    color: "#06251A",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
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
});