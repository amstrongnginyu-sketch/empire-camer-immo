import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { PropertyCard } from "../components/PropertyCard";

type Props = {
  property: any;
  onBack: () => void;
  similarProperties?: any[];
  onOpenProperty?: (property: any) => void;
};

export function PropertyDetailScreen({
  property,
  onBack,
  similarProperties = [],
  onOpenProperty,
}: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;
  const isTablet = width >= 700 && width < 1024;
  const isDesktop = width >= 1024;

  const images = property?.images || [];
  const [imageIndex, setImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const currentImage = images[imageIndex];
  const phone = String(property?.sellerPhone || "").replace("+", "");
  const gallerySlots = images.length > 0 ? images.slice(0, 4) : [null, null, null];

  const sameType = useMemo(() => {
    return similarProperties
      .filter((item) => item?.id !== property?.id)
      .filter((item) => item?.type === property?.type || item?.purpose === property?.purpose)
      .slice(0, 6);
  }, [similarProperties, property]);

  function nextImage() {
    if (images.length === 0) return;
    setImageIndex((current) => (current + 1) % images.length);
  }

  function prevImage() {
    if (images.length === 0) return;
    setImageIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

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

    const message = `Bonjour, je suis intéressé par votre annonce : ${
      property.title || "Annonce immobilière"
    }`;

    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  }

  function openMap() {
    const address = `${property.city || ""} ${property.quartier || ""} Cameroun`;

    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    );
  }

  function BottomActions() {
    return (
      <SafeAreaView style={styles.bottomSafe}>
        <View style={styles.bottomBar}>
          <Pressable style={styles.bottomCallButton} onPress={callSeller}>
            <Text style={styles.bottomCallText}>Appel</Text>
          </Pressable>

          <Pressable style={styles.bottomMapButton} onPress={openMap}>
            <Text style={styles.bottomMapText}>Localisation</Text>
          </Pressable>

          <Pressable style={styles.bottomWhatsappButton} onPress={whatsappSeller}>
            <Text style={styles.bottomWhatsappText}>WhatsApp</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={["#FFFFFF", "#F7F8F6", "#EEF2F0"]} style={styles.bg}>
      <View style={styles.page}>
        {isPhone && (
          <Pressable style={styles.mobileBackButton} onPress={onBack}>
            <Text style={styles.mobileBackText}>‹</Text>
          </Pressable>
        )}

        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            isPhone && styles.contentPhone,
            isPhone && styles.contentPhoneBottom,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {!isPhone && (
            <Pressable onPress={onBack}>
              <Text style={styles.back}>← Retour aux annonces</Text>
            </Pressable>
          )}

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
                  <Pressable style={[styles.imageArrow, styles.imageArrowLeft]} onPress={prevImage}>
                    <Text style={styles.imageArrowText}>‹</Text>
                  </Pressable>

                  <Pressable style={[styles.imageArrow, styles.imageArrowRight]} onPress={nextImage}>
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

          <View style={[styles.layout, (isPhone || isTablet) && styles.layoutPhone]}>
            <View style={styles.leftColumn}>
              <View style={[styles.contentCard, isPhone && styles.contentCardPhone]}>
                {isPhone && (
                  <>
                    <View style={styles.dragIndicator} />
                    <Text style={styles.mobileDetailsTitle}>Détails</Text>
                  </>
                )}

                <View style={styles.badgeRow}>
                  <Text style={styles.badge}>{property.type || "Bien"}</Text>
                  <Text style={styles.badgeGold}>{property.purpose || "Vente"}</Text>
                  <Text style={styles.badgeRed}>Vérifié</Text>
                  {property?.boost && <Text style={styles.badgePremium}>💎 Premium</Text>}
                </View>

                <Text style={[styles.price, isPhone && styles.pricePhone]}>
                  {Number(property.price || 0).toLocaleString("fr-FR")} FCFA
                </Text>

                <Text style={[styles.location, isPhone && styles.locationPhone]}>
                  📍 {property.city || "-"} • {property.quartier || "-"}
                </Text>

                <Text style={[styles.title, isPhone && styles.titlePhone]}>
                  {property.title || "Annonce immobilière"}
                </Text>

                <View style={styles.infoInline}>
                  <Text style={styles.infoInlineText}>🛏 {property.bedrooms || "-"} Ch.</Text>
                  <Text style={styles.infoInlineText}>🚿 {property.bathrooms || "-"} Dch.</Text>
                  <Text style={styles.infoInlineText}>📐 {property.surface || "-"} m²</Text>
                  <Text style={styles.infoInlineText}>🌍 {property.landSurface || "-"} m²</Text>
                </View>

                {!isPhone && (
                  <View style={styles.quickActions}>
                    <Pressable style={styles.callButton} onPress={callSeller}>
                      <Text style={styles.callText}>Appeler</Text>
                    </Pressable>

                    <Pressable style={styles.mapButton} onPress={openMap}>
                      <Text style={styles.mapText}>Localisation</Text>
                    </Pressable>

                    <Pressable style={styles.whatsappButton} onPress={whatsappSeller}>
                      <Text style={styles.whatsappText}>WhatsApp</Text>
                    </Pressable>
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description du bien</Text>
                  <Text style={[styles.description, isPhone && styles.descriptionPhone]}>
                    {property.description || "Aucune description disponible."}
                  </Text>
                </View>

                <View style={styles.infoTable}>
                  <Text style={styles.infoTableTitle}>Informations du bien</Text>

                  <View style={styles.infoTableRow}>
                    <Text style={styles.infoTableLabel}>Type</Text>
                    <Text style={styles.infoTableValue}>{property.type || "-"}</Text>
                  </View>

                  <View style={styles.infoTableRow}>
                    <Text style={styles.infoTableLabel}>Usage</Text>
                    <Text style={styles.infoTableValue}>{property.purpose || "-"}</Text>
                  </View>

                  <View style={styles.infoTableRow}>
                    <Text style={styles.infoTableLabel}>Ville</Text>
                    <Text style={styles.infoTableValue}>{property.city || "-"}</Text>
                  </View>

                  <View style={styles.infoTableRow}>
                    <Text style={styles.infoTableLabel}>Quartier</Text>
                    <Text style={styles.infoTableValue}>{property.quartier || "-"}</Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Localisation</Text>
                  <Text style={[styles.description, isPhone && styles.descriptionPhone]}>
                    {property.city || "-"} • {property.quartier || "-"}
                    {property.reference ? ` • ${property.reference}` : ""}
                  </Text>
                </View>
              </View>
            </View>

            {!isPhone && (
              <View style={styles.rightColumn}>
                <View style={styles.agentCard}>
                  <View style={styles.agentAvatar}>
                    <Text style={styles.agentAvatarText}>
                      {(property.agentName || property.sellerName || "E").charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.agentSmallTitle}>Agence / Agent</Text>

                  <Text style={styles.agentName}>
                    {property.agentName || property.sellerName || "Empire Immo"}
                  </Text>

                  <Text style={styles.agentCompany}>
                    {property.company || property.agencyName || "Compagnie non renseignée"}
                  </Text>

                  <View style={styles.agentBadges}>
                    <Text style={styles.agentBadge}>Annonce vérifiée</Text>
                    <Text style={styles.agentBadgeGold}>Réponse rapide</Text>
                  </View>

                  <View style={styles.agentActions}>
                    <Pressable style={styles.agentCallButton} onPress={callSeller}>
                      <Text style={styles.agentCallText}>Appeler</Text>
                    </Pressable>

                    <Pressable style={styles.agentWhatsappButton} onPress={whatsappSeller}>
                      <Text style={styles.agentWhatsappText}>WhatsApp</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.projectAdBox}>
                  <Text style={styles.projectAdLabel}>PROJET LOCAL À LA UNE</Text>
                  <Text style={styles.projectAdTitle}>Publicité projets immobiliers</Text>
                  <Text style={styles.projectAdText}>
                    Résidences, lotissements, immeubles ou villas premium au Cameroun.
                  </Text>
                  <Pressable style={styles.projectAdButton}>
                    <Text style={styles.projectAdButtonText}>Réserver</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          {sameType.length > 0 && (
            <View style={styles.similarSection}>
              <Text style={[styles.similarTitle, isPhone && styles.similarTitlePhone]}>
                Annonces du même type
              </Text>

              <View style={styles.similarGrid}>
                {sameType.map((item) => (
                  <View key={item.id} style={styles.similarItem}>
                    <PropertyCard
                      item={item}
                      compact={false}
                      onPress={() => onOpenProperty?.(item)}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {isPhone && <BottomActions />}
      </View>

      <Modal visible={galleryOpen} transparent animationType="fade">
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackButton} onPress={() => setGalleryOpen(false)}>
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
                <Pressable style={[styles.fullArrow, styles.fullArrowLeft]} onPress={prevImage}>
                  <Text style={styles.fullArrowText}>‹</Text>
                </Pressable>

                <Pressable style={[styles.fullArrow, styles.fullArrowRight]} onPress={nextImage}>
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

          {isPhone && <BottomActions />}
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  page: { flex: 1 },
  container: { flex: 1 },

  content: {
    padding: 18,
    paddingBottom: 50,
  },

  contentPhone: {
    padding: 0,
  },

  contentPhoneBottom: {
    paddingBottom: 120,
  },

  back: {
    color: "#1F5C42",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 14,
  },

  mobileBackButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.96)",
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  mobileBackText: {
    color: "#1F5C42",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 40,
  },

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

  imageArrowLeft: { left: 12 },
  imageArrowRight: { right: 12 },

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

  layout: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },

  layoutPhone: {
    flexDirection: "column",
  },

  leftColumn: {
    flex: 1.9,
    width: "100%",
  },

  rightColumn: {
    flex: 0.8,
    gap: 14,
  },

  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E1E8DF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },

  contentCardPhone: {
    marginTop: -30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingTop: 13,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    zIndex: 20,
  },

  dragIndicator: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#DDE4DF",
    marginBottom: 8,
  },

  mobileDetailsTitle: {
    textAlign: "center",
    color: "#6B6B5F",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 12,
  },

  badge: {
    backgroundColor: "#1F5C42",
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgeGold: {
    backgroundColor: "#F0D77A",
    color: "#06251A",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgeRed: {
    backgroundColor: "#A84A3A",
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
  },

  badgePremium: {
    backgroundColor: "#FFF3C4",
    color: "#8A6A00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
  },

  price: {
    color: "#C9A646",
    fontSize: 30,
    fontWeight: "900",
  },

  pricePhone: {
    fontSize: 31,
    color: "#06251A",
  },

  location: {
    marginTop: 7,
    color: "#51635A",
    fontSize: 15,
    fontWeight: "800",
  },

  locationPhone: {
    fontSize: 16,
    color: "#1D2E26",
  },

  title: {
    marginTop: 13,
    fontSize: 24,
    lineHeight: 30,
    color: "#06251A",
    fontWeight: "900",
  },

  titlePhone: {
    fontSize: 26,
    lineHeight: 32,
  },

  infoInline: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 13,
  },

  infoInlineText: {
    color: "#1D2E26",
    fontSize: 15,
    fontWeight: "800",
  },

  quickActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },

  callButton: {
    flex: 1,
    backgroundColor: "#1F5C42",
    padding: 13,
    borderRadius: 14,
    alignItems: "center",
  },

  whatsappButton: {
    flex: 1,
    backgroundColor: "#EAF4EF",
    padding: 13,
    borderRadius: 14,
    alignItems: "center",
  },

  mapButton: {
    flex: 1,
    backgroundColor: "#F7F4EC",
    padding: 13,
    borderRadius: 14,
    alignItems: "center",
  },

  callText: {
    color: "white",
    fontSize: 13,
    fontWeight: "900",
  },

  whatsappText: {
    color: "#1F5C42",
    fontSize: 13,
    fontWeight: "900",
  },

  mapText: {
    color: "#A84A3A",
    fontSize: 13,
    fontWeight: "900",
  },

  section: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#E1E8DF",
  },

  sectionTitle: {
    fontSize: 22,
    color: "#06251A",
    fontWeight: "900",
    marginBottom: 10,
  },

  description: {
    color: "#1D2E26",
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "600",
  },

  descriptionPhone: {
    fontSize: 17,
    lineHeight: 25,
  },

  infoTable: {
    marginTop: 26,
  },

  infoTableTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#06251A",
    marginBottom: 12,
  },

  infoTableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEFED",
  },

  infoTableLabel: {
    color: "#51635A",
    fontSize: 16,
    fontWeight: "700",
  },

  infoTableValue: {
    color: "#06251A",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
  },

  agentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E1E8DF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },

  agentAvatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#1F5C42",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  agentAvatarText: {
    color: "#F0D77A",
    fontSize: 32,
    fontWeight: "900",
  },

  agentSmallTitle: {
    color: "#51635A",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 5,
  },

  agentName: {
    color: "#06251A",
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
  },

  agentCompany: {
    color: "#6B6B5F",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 5,
    textAlign: "center",
  },

  agentBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 14,
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

  agentActions: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },

  agentCallButton: {
    flex: 1,
    backgroundColor: "#EAF4EF",
    padding: 12,
    borderRadius: 13,
    alignItems: "center",
  },

  agentWhatsappButton: {
    flex: 1,
    backgroundColor: "#EAF4EF",
    padding: 12,
    borderRadius: 13,
    alignItems: "center",
  },

  agentCallText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  agentWhatsappText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  projectAdBox: {
    backgroundColor: "#1F5C42",
    borderRadius: 22,
    padding: 18,
  },

  projectAdLabel: {
    color: "#F0D77A",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
  },

  projectAdTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },

  projectAdText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },

  projectAdButton: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 13,
    alignItems: "center",
    marginTop: 14,
  },

  projectAdButtonText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  similarSection: {
    marginTop: 24,
    paddingHorizontal: 18,
  },

  similarTitle: {
    color: "#06251A",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 12,
  },

  similarTitlePhone: {
    fontSize: 22,
  },

  similarGrid: {
    gap: 12,
  },

  similarItem: {
    width: "100%",
  },

  bottomSafe: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    zIndex: 999,
  },

  bottomBar: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E1E8DF",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: "row",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -5 },
  },

  bottomCallButton: {
    flex: 1,
    backgroundColor: "#EAF4EF",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  bottomMapButton: {
    flex: 1,
    backgroundColor: "#F7F4EC",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  bottomWhatsappButton: {
    flex: 1,
    backgroundColor: "#EAF4EF",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  bottomCallText: {
    color: "#1F5C42",
    fontSize: 15,
    fontWeight: "900",
  },

  bottomMapText: {
    color: "#A84A3A",
    fontSize: 15,
    fontWeight: "900",
  },

  bottomWhatsappText: {
    color: "#1F5C42",
    fontSize: 15,
    fontWeight: "900",
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