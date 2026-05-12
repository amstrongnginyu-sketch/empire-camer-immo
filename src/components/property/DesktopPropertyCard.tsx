import { Pressable, StyleSheet, Text, View } from "react-native";
import PropertyImage from "./PropertyImage";

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

function DesktopPropertyCard({
  item,
  onPress,
  favorite,
  scaleAnim,
  toggleFavorite,
  callSeller,
  whatsappSeller,
}: Props) {
  const image = item?.images?.[0];
  const isPremium = Boolean(item?.boost);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <PropertyImage
        image={image}
        height={240}
        favorite={favorite}
        scaleAnim={scaleAnim}
        onToggleFavorite={toggleFavorite}
      />

      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={styles.listed}>Annonce récente</Text>
          {isPremium && <Text style={styles.premium}>Premium</Text>}
        </View>

        <Text style={styles.price} numberOfLines={1}>
          {Number(item?.price || 0).toLocaleString("fr-FR")} FCFA
        </Text>

        <Text style={styles.title} numberOfLines={1}>
          {item?.title || item?.type || "Annonce immobilière"}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          🛏 {item?.bedrooms || "-"} | 🚿 {item?.bathrooms || "-"} | 📐{" "}
          {item?.surface || "-"} m² | {item?.type || "Bien"}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          📍 {item?.quartier || "-"}, {item?.city || "-"}
        </Text>

        <View style={styles.divider} />

        <View style={styles.agentRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(item?.agentName || item?.sellerName || "A").charAt(0)}
            </Text>
          </View>

          <View style={styles.agentTextBox}>
            <Text style={styles.agentBadge}>AGENT</Text>
            <Text style={styles.agentName} numberOfLines={1}>
              {item?.agentName || item?.sellerName || "Non renseigné"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.callButton} onPress={callSeller}>
            <Text style={styles.callText}>☎ Appeler</Text>
          </Pressable>

          <Pressable style={styles.whatsappButton} onPress={whatsappSeller}>
            <Text style={styles.whatsappText}>WhatsApp</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export { DesktopPropertyCard };
export default DesktopPropertyCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DDE3E0",
    marginBottom: 24,
  },

  body: {
    padding: 18,
  },

  topLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  listed: {
    color: "#777777",
    fontSize: 13,
    fontWeight: "800",
  },

  premium: {
    color: "#7A641C",
    fontSize: 13,
    fontWeight: "900",
  },

  price: {
    color: "#2B2B2B",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 6,
  },

  title: {
    color: "#5F5F5F",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 18,
  },

  meta: {
    color: "#6B6B6B",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 9,
  },

  location: {
    color: "#6B6B6B",
    fontSize: 15,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: 16,
    marginBottom: 14,
  },

  agentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1F5C42",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  agentTextBox: {
    flex: 1,
    minWidth: 0,
  },

  agentBadge: {
    color: "#3B2E83",
    fontSize: 12,
    fontWeight: "900",
  },

  agentName: {
    color: "#2F2F2F",
    fontSize: 15,
    fontWeight: "900",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  callButton: {
    flex: 1,
    backgroundColor: "#F4F2FB",
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: "center",
  },

  whatsappButton: {
    flex: 1,
    backgroundColor: "#F4F2FB",
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: "center",
  },

  callText: {
    color: "#3B2E83",
    fontSize: 15,
    fontWeight: "900",
  },

  whatsappText: {
    color: "#3B2E83",
    fontSize: 15,
    fontWeight: "900",
  },
});