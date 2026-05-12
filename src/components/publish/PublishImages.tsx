import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  images?: string[];
  onAddImage?: () => void;
  onRemoveImage?: (index: number) => void;
};

export default function PublishImages({
  images = [],
  onAddImage,
  onRemoveImage,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Photos du bien</Text>

      <Text style={styles.subtitle}>
        Ajoutez plusieurs photos claires du bien. La première image sera utilisée
        comme photo principale.
      </Text>

      <View style={styles.grid}>
        {images.map((image, index) => (
          <View key={`${image}-${index}`} style={styles.imageBox}>
            <Image source={{ uri: image }} style={styles.image} />

            <Pressable
              style={styles.removeButton}
              onPress={() => onRemoveImage?.(index)}
            >
              <Text style={styles.removeText}>×</Text>
            </Pressable>

            {index === 0 && (
              <View style={styles.mainBadge}>
                <Text style={styles.mainBadgeText}>Principale</Text>
              </View>
            )}
          </View>
        ))}

        <Pressable style={styles.addBox} onPress={onAddImage}>
          <Text style={styles.addIcon}>＋</Text>
          <Text style={styles.addText}>Ajouter une photo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#06251A",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },

  subtitle: {
    color: "#6B6B5F",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  imageBox: {
    width: 150,
    height: 120,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F7F8F6",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(168,74,58,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },

  removeText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 22,
  },

  mainBadge: {
    position: "absolute",
    left: 8,
    bottom: 8,
    backgroundColor: "rgba(31,92,66,0.95)",
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
  },

  mainBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  addBox: {
    width: 150,
    height: 120,
    borderRadius: 18,
    backgroundColor: "#F7F8F6",
    borderWidth: 1,
    borderColor: "#DDE5E0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },

  addIcon: {
    color: "#1F5C42",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 6,
  },

  addText: {
    color: "#1F5C42",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
});