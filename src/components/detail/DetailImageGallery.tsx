import { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

type Props = {
  images?: string[];
};

export default function DetailImageGallery({ images = [] }: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;
  const isTablet = width >= 700 && width < 1024;
  const isDesktop = width >= 1024;

  const [imageIndex, setImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const currentImage = images[imageIndex];
  const gallerySlots = images.length > 0 ? images.slice(0, 4) : [null, null, null];

  function nextImage() {
    if (images.length === 0) return;
    setImageIndex((current) => (current + 1) % images.length);
  }

  function prevImage() {
    if (images.length === 0) return;
    setImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  return (
    <>
      <View style={[styles.gallery, isPhone && styles.galleryPhone]}>
        <Pressable
          style={[
            styles.mainImageBox,
            isPhone && styles.mainImageBoxPhone,
            isTablet && styles.mainImageBoxTablet,
            isDesktop && styles.mainImageBoxDesktop,
          ]}
          onPress={() => setGalleryOpen(true)}
        >
          {currentImage ? (
            <Image source={{ uri: currentImage }} style={styles.mainImage} />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>Aucune image</Text>
            </View>
          )}

          {images.length > 1 && (
            <>
              <Pressable
                style={[styles.imageArrow, styles.imageArrowLeft]}
                onPress={prevImage}
              >
                <Text style={styles.imageArrowText}>‹</Text>
              </Pressable>

              <Pressable
                style={[styles.imageArrow, styles.imageArrowRight]}
                onPress={nextImage}
              >
                <Text style={styles.imageArrowText}>›</Text>
              </Pressable>
            </>
          )}

          <View style={[styles.imageBadge, isPhone && styles.imageBadgePhone]}>
            <Text style={styles.imageBadgeText}>
              📷 {images.length} photo{images.length > 1 ? "s" : ""}
            </Text>
          </View>
        </Pressable>

        {!isPhone && (
          <View style={styles.sideThumbs}>
            {gallerySlots.map((img: string | null, index: number) => (
              <Pressable
                key={`thumb-${index}`}
                style={[
                  styles.sideThumb,
                  index === imageIndex && img && styles.sideThumbActive,
                ]}
                onPress={() => {
                  if (img) setImageIndex(index);
                }}
              >
                {img ? (
                  <Image source={{ uri: img }} style={styles.sideThumbImage} />
                ) : (
                  <View style={styles.emptyThumb}>
                    <Text style={styles.emptyThumbText}>+</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <Modal visible={galleryOpen} transparent animationType="fade">
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.modalBackButton}
            onPress={() => setGalleryOpen(false)}
          >
            <Text style={styles.modalBackText}>‹</Text>
          </Pressable>

          <View style={[styles.modalImageBox, isPhone && styles.modalImageBoxPhone]}>
            {currentImage ? (
              <Image source={{ uri: currentImage }} style={styles.modalImage} />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>Aucune image</Text>
              </View>
            )}

            {images.length > 1 && (
              <>
                <Pressable
                  style={[styles.fullArrow, styles.fullArrowLeft]}
                  onPress={prevImage}
                >
                  <Text style={styles.fullArrowText}>‹</Text>
                </Pressable>

                <Pressable
                  style={[styles.fullArrow, styles.fullArrowRight]}
                  onPress={nextImage}
                >
                  <Text style={styles.fullArrowText}>›</Text>
                </Pressable>

                <View style={styles.modalCounter}>
                  <Text style={styles.modalCounterText}>
                    {imageIndex + 1}/{images.length}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  gallery: {
    marginBottom: 14,
    flexDirection: "row",
    gap: 12,
  },

  galleryPhone: {
    marginBottom: 0,
    flexDirection: "column",
  },

  mainImageBox: {
    flex: 1,
    height: 360,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#F1F4EF",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E1E8DF",
  },

  mainImageBoxPhone: {
    width: "100%",
    height: 300,
    borderRadius: 0,
    borderWidth: 0,
  },

  mainImageBoxTablet: {
    height: 360,
  },

  mainImageBoxDesktop: {
    height: 420,
  },

  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  sideThumbs: {
    width: 170,
    gap: 10,
  },

  sideThumb: {
    flex: 1,
    minHeight: 90,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F1F4EF",
    borderWidth: 2,
    borderColor: "#E1E8DF",
  },

  sideThumbActive: {
    borderColor: "#1F5C42",
  },

  sideThumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  emptyThumb: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F4EF",
  },

  emptyThumbText: {
    color: "#1F5C42",
    fontSize: 34,
    fontWeight: "900",
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

  imageArrow: {
    position: "absolute",
    top: "44%",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  imageArrowLeft: {
    left: 12,
  },

  imageArrowRight: {
    right: 12,
  },

  imageArrowText: {
    color: "#06251A",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 36,
  },

  imageBadge: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "rgba(31,92,66,0.96)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    zIndex: 10,
  },

  imageBadgePhone: {
    bottom: 46,
    right: 18,
  },

  imageBadgeText: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
  },

  modalRoot: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(6,37,26,0.92)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingBottom: 110,
  },

  modalBackButton: {
    position: "absolute",
    top: 34,
    left: 18,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.96)",
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBackText: {
    color: "#1F5C42",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 40,
  },

  modalImageBox: {
    width: "92%",
    height: "72%",
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#EDF3EF",
  },

  modalImageBoxPhone: {
    width: "92%",
    height: "62%",
    marginTop: 30,
  },

  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  fullArrow: {
    position: "absolute",
    top: "45%",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  fullArrowLeft: {
    left: 15,
  },

  fullArrowRight: {
    right: 15,
  },

  fullArrowText: {
    color: "#06251A",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 44,
  },

  modalCounter: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    backgroundColor: "rgba(6,37,26,0.75)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  modalCounterText: {
    color: "white",
    fontWeight: "900",
  },
});