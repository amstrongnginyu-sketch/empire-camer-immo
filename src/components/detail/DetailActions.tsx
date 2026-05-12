import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  favorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  onReport?: () => void;
};

export default function DetailActions({
  favorite = false,
  onToggleFavorite,
  onShare,
  onReport,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.actionButton, favorite && styles.favoriteActive]}
        onPress={onToggleFavorite}
      >
        <Text style={[styles.actionText, favorite && styles.favoriteText]}>
          {favorite ? "♥ Favori" : "♡ Ajouter aux favoris"}
        </Text>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={onShare}>
        <Text style={styles.actionText}>↗ Partager</Text>
      </Pressable>

      <Pressable style={styles.reportButton} onPress={onReport}>
        <Text style={styles.reportText}>⚠ Signaler l’annonce</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 18,
    gap: 12,
  },

  actionButton: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: "#F7F8F6",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteActive: {
    backgroundColor: "#FFF0F3",
    borderColor: "#F3C7D0",
  },

  actionText: {
    color: "#06251A",
    fontSize: 14,
    fontWeight: "900",
  },

  favoriteText: {
    color: "#A84A3A",
  },

  reportButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#FFF7F4",
    borderWidth: 1,
    borderColor: "#F2D1C7",
    alignItems: "center",
    justifyContent: "center",
  },

  reportText: {
    color: "#A84A3A",
    fontSize: 14,
    fontWeight: "900",
  },
});