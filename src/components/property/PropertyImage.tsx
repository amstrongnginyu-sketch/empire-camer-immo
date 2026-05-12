import { useState } from "react";
import {
    Animated,
    DimensionValue,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  image?: string;
  height?: DimensionValue;
  favorite: boolean;
  scaleAnim: any;
  onToggleFavorite: (e?: any) => void;
};

export function PropertyImage({
  image,
  height = 220,
  favorite,
  scaleAnim,
  onToggleFavorite,
}: Props) {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <>
      <Pressable
        style={[styles.imageBox, { height }]}
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
          style={[
            styles.favoriteButton,
            favorite && styles.favoriteButtonActive,
          ]}
          onPress={onToggleFavorite}
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

      <Modal
        visible={imageOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setImageOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.closeModal}
            onPress={() => setImageOpen(false)}
          >
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

export default PropertyImage;

const styles = StyleSheet.create({
  imageBox: {
    width: "100%",
    backgroundColor: "#EDF3EF",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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