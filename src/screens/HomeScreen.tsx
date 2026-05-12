import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import AppFooter from "../components/AppFooter";
import HomePropertyGrid from "../components/home/HomePropertyGrid";
import SecurityNotice from "../components/SecurityNotice";
import { useProperties } from "../hooks/useProperties";
import { UserProfile } from "../types/user";

type Props = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  profile: UserProfile | null;
  onRequireAuth: () => void;
  onNavigate: (screen: any) => void;
  onOpenProperty: (property: any) => void;
  onBoostProperty?: (property: any) => void;
  boostedIds?: string[];
};

type PropertyLike = {
  id: string;
  title?: string;
  city?: string;
  quartier?: string;
  type?: string;
  purpose?: string;
  price?: string | number;
  boost?: boolean;
  boosted?: boolean;
  premium?: boolean;
  verified?: boolean;
  images?: string[];
  bedrooms?: string | number;
  bathrooms?: string | number;
  surface?: string | number;
  landSurface?: string | number;
  agentName?: string;
  sellerName?: string;
  sellerPhone?: string;
  description?: string;
  [key: string]: any;
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
];

const ADS = [
  {
    label: "PUBLICITÉ PREMIUM",
    title: "Projets locaux au Cameroun",
    text: "Résidences, immeubles, terrains et villas premium.",
  },
  {
    label: "ESPACE AGENCE",
    title: "Mettez vos biens en avant",
    text: "Idéal pour les agences qui veulent plus de visibilité.",
  },
  {
    label: "PROMOTEURS",
    title: "Présentez vos programmes",
    text: "Un espace dédié aux projets immobiliers locaux.",
  },
];

const DEMO_PROPERTIES: PropertyLike[] = [
  {
    id: "demo-1",
    title: "Villa moderne avec piscine",
    price: 10000000,
    city: "Douala",
    quartier: "PK 14",
    type: "appartement",
    purpose: "Vente",
    bedrooms: 4,
    bathrooms: 4,
    surface: 120,
    boost: true,
    premium: true,
    boosted: true,
    verified: true,
    agentName: "Empire Kao",
    sellerPhone: "+237690000000",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    ],
  },
];

export default function HomeScreen({
  isLoggedIn,
  onRequireAuth,
  onNavigate,
  onOpenProperty,
  onBoostProperty,
  boostedIds = [],
}: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;
  const isTablet = width >= 700 && width < 1024;
  const showSidebar = width >= 1024;

  const pagePadding = isPhone ? 12 : isTablet ? 16 : 22;

  const { recentProperties = [], popularProperties = [] } = useProperties(true);

  const [search, setSearch] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState<
    "Vente" | "Location" | "Terrain"
  >("Vente");

  const [filterOpen, setFilterOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_IMAGES.length);
      setAdIndex((current) => (current + 1) % ADS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  function normalizeText(value: any) {
    const clean = String(value || "").trim();
    if (!clean) return "Autre";
    return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  }

  const firebaseProperties = useMemo(() => {
    const map = new Map<string, PropertyLike>();

    [...popularProperties, ...recentProperties].forEach((item: any) => {
      if (item?.id) map.set(String(item.id), item);
    });

    return Array.from(map.values());
  }, [popularProperties, recentProperties]);

  const allProperties = useMemo(() => {
    const source =
      firebaseProperties.length > 0 ? firebaseProperties : DEMO_PROPERTIES;

    return source
      .map((item) => ({
        ...item,
        boost:
          item.boost ||
          item.boosted ||
          item.premium ||
          boostedIds.includes(String(item.id)),
      }))
      .sort((a, b) => {
        if (a.boost && !b.boost) return -1;
        if (!a.boost && b.boost) return 1;
        return 0;
      });
  }, [firebaseProperties, boostedIds]);

  const sponsoredProperties = useMemo(() => {
    const boosted = allProperties.filter((item) => item.boost);
    return boosted.length > 0 ? boosted.slice(0, 3) : allProperties.slice(0, 3);
  }, [allProperties]);

  const boostedProperties = useMemo(() => {
    return allProperties.filter((item) => item.boost).slice(0, 6);
  }, [allProperties]);

  const filteredProperties = useMemo(() => {
    return allProperties.filter((item) => {
      const text = `${item.title || ""} ${item.city || ""} ${
        item.quartier || ""
      } ${item.type || ""}`.toLowerCase();

      const matchSearch = search ? text.includes(search.toLowerCase()) : true;

      const matchPurpose =
        selectedPurpose === "Terrain"
          ? normalizeText(item.type) === "Terrain"
          : item.purpose
          ? item.purpose === selectedPurpose
          : true;

      return matchSearch && matchPurpose;
    });
  }, [allProperties, search, selectedPurpose]);

  const cityStats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};

    allProperties.forEach((item) => {
      const city = normalizeText(item.city);
      const type = normalizeText(item.type);

      if (!stats[city]) stats[city] = {};
      stats[city][type] = (stats[city][type] || 0) + 1;
    });

    return Object.entries(stats);
  }, [allProperties]);

  function handlePublish() {
    if (!isLoggedIn) {
      onRequireAuth();
      return;
    }

    onNavigate("publish");
  }

  const activeAd = ADS[adIndex];

  return (
    <LinearGradient colors={["#FFFFFF", "#F7F8F6", "#EEF2F0"]} style={styles.bg}>
   <ScrollView
  style={[styles.container, { padding: pagePadding }]}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 120 }}
>
        <ImageBackground
          source={{ uri: HERO_IMAGES[heroIndex] }}
          style={[styles.hero, isPhone && styles.heroMobile]}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={[styles.kicker, isPhone && styles.kickerMobile]}>
                EMPIRE CAMER IMMO
              </Text>

              <Text style={[styles.heroTitle, isPhone && styles.heroTitleMobile]}>
                Trouve le bien idéal au Cameroun
              </Text>

              <Text
                style={[
                  styles.heroSubtitle,
                  isPhone && styles.heroSubtitleMobile,
                ]}
              >
                Villas, appartements, terrains et immeubles vérifiés
              </Text>

              <View style={[styles.searchPanel, isPhone && styles.searchPanelMobile]}>
                <View style={styles.segmentRow}>
                  {["Vente", "Location", "Terrain"].map((item) => {
                    const active = selectedPurpose === item;

                    return (
                      <Pressable
                        key={item}
                        style={[
                          styles.segment,
                          isPhone && styles.segmentMobile,
                          active && styles.segmentActive,
                        ]}
                        onPress={() => setSelectedPurpose(item as any)}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            isPhone && styles.segmentTextMobile,
                            active && styles.segmentTextActive,
                          ]}
                        >
                          {item === "Vente"
                            ? "Acheter"
                            : item === "Location"
                            ? "Louer"
                            : "Terrains"}
                        </Text>
                      </Pressable>
                    );
                  })}

                  <Pressable
                    style={[styles.filterButton, isPhone && styles.filterButtonMobile]}
                    onPress={() => setFilterOpen(true)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        isPhone && styles.segmentTextMobile,
                      ]}
                    >
                      Filtres ⚙️
                    </Text>
                  </Pressable>
                </View>

                <TextInput
                  style={[styles.searchInput, isPhone && styles.searchInputMobile]}
                  placeholder="Ville, quartier, type de bien..."
                  placeholderTextColor="#6B6B5F"
                  value={search}
                  onChangeText={setSearch}
                />

                <View style={[styles.searchActions, isPhone && styles.searchActionsMobile]}>
                  <Pressable style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>Rechercher</Text>
                  </Pressable>

                  <Pressable style={styles.publishButton} onPress={handlePublish}>
                    <Text style={styles.publishText}>Publier</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.pageLayout, !showSidebar && styles.pageLayoutSingle]}>
          <View style={styles.mainColumn}>
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Biens disponibles par ville</Text>

              {cityStats.map(([city, types]) => (
                <View key={city} style={styles.cityCard}>
                  <Text style={styles.cityTitle}>{city}</Text>

                  <View style={styles.statsGrid}>
                    {Object.entries(types).map(([type, count]) => (
                      <View key={`${city}-${type}`} style={styles.statChip}>
                        <Text style={styles.statChipText}>
                          {type} ({count})
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💎 Biens sponsorisés</Text>
              <Text style={styles.sectionSub}>
                Les annonces boostées apparaissent ici en priorité
              </Text>
            </View>

            <HomePropertyGrid
              items={sponsoredProperties}
              onOpenProperty={onOpenProperty}
              onBoostProperty={onBoostProperty}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Biens boostés</Text>
              <Text style={styles.sectionSub}>
                Visibilité premium pour les annonces sponsorisées
              </Text>
            </View>

            <HomePropertyGrid
              items={boostedProperties}
              onOpenProperty={onOpenProperty}
              onBoostProperty={onBoostProperty}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🆕 Annonces récentes</Text>
              <Text style={styles.sectionSub}>
                Les annonces premium sont toujours prioritaires
              </Text>
            </View>

            <HomePropertyGrid
              items={filteredProperties}
              onOpenProperty={onOpenProperty}
              onBoostProperty={onBoostProperty}
            />

            <SecurityNotice />
          </View>

          {showSidebar && (
            <View style={styles.sidebar}>
              <View style={styles.sideAdGreen}>
                <Text style={styles.sideAdLabel}>{activeAd.label}</Text>
                <Text style={styles.sideAdTitle}>{activeAd.title}</Text>
                <Text style={styles.sideAdText}>{activeAd.text}</Text>

                <Pressable style={styles.sideAdButton}>
                  <Text style={styles.sideAdButtonText}>Réserver</Text>
                </Pressable>
              </View>

              <View style={styles.sideBox}>
                <Text style={styles.sideBoxTitle}>Recherches utiles</Text>
                <Text style={styles.sideLink}>Maisons à Douala</Text>
                <Text style={styles.sideLink}>Terrains à Yaoundé</Text>
                <Text style={styles.sideLink}>Appartements à louer</Text>
                <Text style={styles.sideLink}>Villas premium</Text>
              </View>

              <View style={styles.sideBox}>
                <Text style={styles.sideBoxTitle}>Top recherches</Text>
                <Text style={styles.sideLink}>Biens à Bonapriso</Text>
                <Text style={styles.sideLink}>Studios à Yaoundé</Text>
                <Text style={styles.sideLink}>Terrains titrés</Text>
                <Text style={styles.sideLink}>Immeubles à vendre</Text>
              </View>

              <View style={styles.sideAdImage}>
                <Text style={styles.sideAdImageTitle}>Espace annonce</Text>
                <Text style={styles.sideAdImageText}>
                  Bannières agences / promoteurs
                </Text>
              </View>
            </View>
          )}
        </View>

              </ScrollView>

      <AppFooter />

      <Modal
        visible={filterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <Text style={styles.modalTitle}>Filtres avancés</Text>

            <Pressable
              style={styles.applyButton}
              onPress={() => setFilterOpen(false)}
            >
              <Text style={styles.applyText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  hero: {
    height: 340,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
  },

  heroMobile: {
    height: 360,
    borderRadius: 20,
  },

  heroImage: {
    borderRadius: 22,
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,37,26,0.50)",
    justifyContent: "center",
    padding: 22,
  },

  heroContent: {
    width: "100%",
    maxWidth: 760,
  },

  kicker: {
    color: "#F0D77A",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  kickerMobile: {
    fontSize: 12,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
  },

  heroTitleMobile: {
    fontSize: 24,
    lineHeight: 30,
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "700",
  },

  heroSubtitleMobile: {
    fontSize: 13,
    marginBottom: 14,
  },

  searchPanel: {
    width: "100%",
    maxWidth: 680,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 12,
  },

  searchPanelMobile: {
    borderRadius: 18,
    padding: 12,
  },

  segmentRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  segment: {
    backgroundColor: "#F3F4F3",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  segmentMobile: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  segmentActive: {
    backgroundColor: "#EAF4EF",
    borderWidth: 1,
    borderColor: "#1F5C42",
  },

  segmentText: {
    color: "#1D2E26",
    fontWeight: "900",
    fontSize: 14,
  },

  segmentTextMobile: {
    fontSize: 12,
  },

  segmentTextActive: {
    color: "#1F5C42",
  },

  filterButton: {
    marginLeft: "auto",
    backgroundColor: "#FFFFFF",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
  },

  filterButtonMobile: {
    marginLeft: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  filterButtonText: {
    color: "#1D2E26",
    fontWeight: "900",
    fontSize: 14,
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 13,
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 12,
  },

  searchInputMobile: {
    padding: 12,
    fontSize: 13,
  },

  searchActions: {
    flexDirection: "row",
    gap: 10,
  },

  searchActionsMobile: {
    gap: 8,
  },

  searchButton: {
    flex: 1,
    backgroundColor: "#1F5C42",
    padding: 13,
    borderRadius: 16,
    alignItems: "center",
  },

  publishButton: {
    flex: 1,
    backgroundColor: "#F0D77A",
    padding: 13,
    borderRadius: 16,
    alignItems: "center",
  },

  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  publishText: {
    color: "#06251A",
    fontWeight: "900",
  },

  pageLayout: {
    width: "100%",
    maxWidth: 1450,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },

  pageLayoutSingle: {
    flexDirection: "column",
  },

  mainColumn: {
    flex: 1,
    minWidth: 0,
  },

  sidebar: {
    width: 260,
    gap: 12,
  },

  statsContainer: {
    backgroundColor: "rgba(255,255,255,0.90)",
    padding: 14,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  statsTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#06251A",
    marginBottom: 10,
  },

  cityCard: {
    backgroundColor: "#F7F8F6",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  cityTitle: {
    fontSize: 16,
    color: "#06251A",
    fontWeight: "900",
    marginBottom: 8,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  statChip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 999,
  },

  statChipText: {
    color: "#06251A",
    fontWeight: "900",
    fontSize: 12,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#06251A",
  },

  sectionSub: {
    color: "#51635A",
    fontWeight: "800",
    marginTop: 4,
    fontSize: 13,
  },

  sideAdGreen: {
    backgroundColor: "#1F5C42",
    borderRadius: 16,
    padding: 14,
  },

  sideAdLabel: {
    color: "#F0D77A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 6,
  },

  sideAdTitle: {
    color: "white",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
    marginBottom: 6,
  },

  sideAdText: {
    color: "rgba(255,255,255,0.88)",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 17,
  },

  sideAdButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },

  sideAdButtonText: {
    color: "#1F5C42",
    fontWeight: "900",
    fontSize: 13,
  },

  sideBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  sideBoxTitle: {
    color: "#06251A",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },

  sideLink: {
    color: "#51635A",
    fontWeight: "800",
    marginBottom: 8,
    fontSize: 13,
  },

  sideAdImage: {
    height: 210,
    backgroundColor: "#EDF3EF",
    borderRadius: 16,
    padding: 16,
    justifyContent: "flex-end",
  },

  sideAdImageTitle: {
    color: "#06251A",
    fontSize: 18,
    fontWeight: "900",
  },

  sideAdImageText: {
    color: "#51635A",
    fontWeight: "800",
    marginTop: 4,
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,37,26,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },

  filterModal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
  },

  modalTitle: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  applyButton: {
    backgroundColor: "#1F5C42",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  applyText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});