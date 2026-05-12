import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import DetailActions from "../components/detail/DetailActions";
import DetailAgentBox from "../components/detail/DetailAgentBox";
import DetailDescription from "../components/detail/DetailDescription";
import DetailFeatures from "../components/detail/DetailFeatures";
import DetailHeader from "../components/detail/DetailHeader";
import DetailImageGallery from "../components/detail/DetailImageGallery";
import DetailLocation from "../components/detail/DetailLocation";
import DetailPriceBox from "../components/detail/DetailPriceBox";
import { PropertyCard } from "../components/property/PropertyCard";

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

  const [favorite, setFavorite] = useState(false);

  const images = property?.images || [];
  const phone = String(property?.sellerPhone || "").replace("+", "");

  const sameType = useMemo(() => {
    return similarProperties
      .filter((item) => item?.id !== property?.id)
      .filter(
        (item) =>
          item?.type === property?.type || item?.purpose === property?.purpose
      )
      .slice(0, 6);
  }, [similarProperties, property]);

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
      property?.title || "Annonce immobilière"
    }`;

    Linking.openURL(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    );
  }

  function openMap() {
    const address = `${property?.city || ""} ${
      property?.quartier || ""
    } Cameroun`;

    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`
    );
  }

  async function shareProperty() {
    try {
      await Share.share({
        message: `Regarde cette annonce sur Empire Camer Immo : ${
          property?.title || "Annonce immobilière"
        } - ${Number(property?.price || 0).toLocaleString("fr-FR")} FCFA`,
      });
    } catch {
      Alert.alert("Erreur", "Impossible de partager cette annonce.");
    }
  }

  function reportProperty() {
    Alert.alert(
      "Signaler l’annonce",
      "Merci. Cette fonctionnalité sera reliée à l’administration."
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

          <Pressable
            style={styles.bottomWhatsappButton}
            onPress={whatsappSeller}
          >
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

          <DetailImageGallery images={images} />

          <View style={[styles.layout, (isPhone || isTablet) && styles.layoutPhone]}>
            <View style={styles.leftColumn}>
              <View style={[styles.contentCard, isPhone && styles.contentCardPhone]}>
                {isPhone && (
                  <>
                    <View style={styles.dragIndicator} />
                    <Text style={styles.mobileDetailsTitle}>Détails</Text>
                  </>
                )}

                <DetailHeader
                  title={property?.title || "Annonce immobilière"}
                  city={property?.city || "-"}
                  neighborhood={property?.quartier || "-"}
                  type={property?.type || "Bien"}
                  reference={property?.reference || property?.id || "ECI"}
                />

                <DetailFeatures
                  bedrooms={Number(property?.bedrooms || 0)}
                  bathrooms={Number(property?.bathrooms || 0)}
                  parking={Number(property?.parking || 0)}
                  surface={Number(property?.surface || 0)}
                  furnished={Boolean(property?.furnished)}
                />

                <DetailDescription
                  description={
                    property?.description ||
                    "Cette annonce ne contient pas encore de description détaillée."
                  }
                />

                <DetailLocation
                  city={property?.city || "-"}
                  neighborhood={property?.quartier || "-"}
                  address={
                    property?.address ||
                    `${property?.quartier || "-"}, ${property?.city || "-"}`
                  }
                  onOpenMap={openMap}
                />

                {isPhone && (
                  <>
                    <DetailPriceBox
                      price={Number(property?.price || 0)}
                      period={property?.period || ""}
                      negotiable={property?.negotiable !== false}
                      onCall={callSeller}
                      onWhatsapp={whatsappSeller}
                    />

                    <DetailAgentBox
                      agentName={
                        property?.agentName ||
                        property?.sellerName ||
                        "Empire Camer Immo"
                      }
                      agentPhone={property?.sellerPhone || "+237 6XX XXX XXX"}
                      agency={
                        property?.company ||
                        property?.agencyName ||
                        "Agence immobilière"
                      }
                      verified={property?.verified !== false}
                      avatar={property?.agentAvatar}
                      onCall={callSeller}
                      onWhatsapp={whatsappSeller}
                    />
                  </>
                )}

                <DetailActions
                  favorite={favorite}
                  onToggleFavorite={() => setFavorite((current) => !current)}
                  onShare={shareProperty}
                  onReport={reportProperty}
                />
              </View>
            </View>

            {!isPhone && (
              <View style={styles.rightColumn}>
                <DetailPriceBox
                  price={Number(property?.price || 0)}
                  period={property?.period || ""}
                  negotiable={property?.negotiable !== false}
                  onCall={callSeller}
                  onWhatsapp={whatsappSeller}
                />

                <DetailAgentBox
                  agentName={
                    property?.agentName ||
                    property?.sellerName ||
                    "Empire Camer Immo"
                  }
                  agentPhone={property?.sellerPhone || "+237 6XX XXX XXX"}
                  agency={
                    property?.company ||
                    property?.agencyName ||
                    "Agence immobilière"
                  }
                  verified={property?.verified !== false}
                  avatar={property?.agentAvatar}
                  onCall={callSeller}
                  onWhatsapp={whatsappSeller}
                />

                <View style={styles.projectAdBox}>
                  <Text style={styles.projectAdLabel}>
                    PROJET LOCAL À LA UNE
                  </Text>

                  <Text style={styles.projectAdTitle}>
                    Publicité projets immobiliers
                  </Text>

                  <Text style={styles.projectAdText}>
                    Résidences, lotissements, immeubles ou villas premium au
                    Cameroun.
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
                  <View key={String(item.id)} style={styles.similarItem}>
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
    </LinearGradient>
  );
}

export default PropertyDetailScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  page: {
    flex: 1,
    position: "relative",
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  contentPhone: {
    padding: 0,
    paddingBottom: 0,
  },

  contentPhoneBottom: {
    paddingBottom: 110,
  },

  back: {
    color: "#1F5C42",
    fontWeight: "900",
    fontSize: 15,
    marginBottom: 18,
  },

  mobileBackButton: {
    position: "absolute",
    top: 18,
    left: 16,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
  },

  mobileBackText: {
    color: "#1F5C42",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 40,
  },

  layout: {
    maxWidth: 1500,
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 22,
  },

  layoutPhone: {
    flexDirection: "column",
    gap: 0,
  },

  leftColumn: {
    flex: 1,
    minWidth: 0,
  },

  rightColumn: {
    width: 360,
    gap: 16,
  },

  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E1E8DF",
  },

  contentCardPhone: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: -26,
    padding: 18,
    borderWidth: 0,
  },

  dragIndicator: {
    alignSelf: "center",
    width: 54,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D9E3DD",
    marginBottom: 12,
  },

  mobileDetailsTitle: {
    color: "#06251A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },

  projectAdBox: {
    backgroundColor: "#1F5C42",
    borderRadius: 24,
    padding: 20,
  },

  projectAdLabel: {
    color: "#F0D77A",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
  },

  projectAdTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },

  projectAdText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  projectAdButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 18,
  },

  projectAdButtonText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  similarSection: {
    maxWidth: 1500,
    alignSelf: "center",
    width: "100%",
    marginTop: 26,
  },

  similarTitle: {
    color: "#06251A",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 16,
  },

  similarTitlePhone: {
    fontSize: 23,
    paddingHorizontal: 18,
  },

  similarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },

  similarItem: {
    width: 340,
    maxWidth: "100%",
  },

  bottomSafe: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderTopWidth: 1,
    borderTopColor: "#E1E8DF",
  },

  bottomBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },

  bottomCallButton: {
    flex: 1,
    backgroundColor: "#1F5C42",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },

  bottomMapButton: {
    flex: 1,
    backgroundColor: "#F7F4EC",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },

  bottomWhatsappButton: {
    flex: 1,
    backgroundColor: "#F0D77A",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },

  bottomCallText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  bottomMapText: {
    color: "#A84A3A",
    fontSize: 14,
    fontWeight: "900",
  },

  bottomWhatsappText: {
    color: "#1F5C42",
    fontSize: 14,
    fontWeight: "900",
  },
});