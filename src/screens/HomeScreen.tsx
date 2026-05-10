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
import { PropertyCard } from "../components/PropertyCard";
import { SecurityNotice } from "../components/SecurityNotice";
import { SponsoredSlider } from "../components/SponsoredSlider";
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
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80",
];

const ADS = [
  {
    label: "PUBLICITÉ PREMIUM",
    title: "Projets locaux au Cameroun",
    text: "Résidences, immeubles, terrains, lotissements et villas premium.",
  },
  {
    label: "ESPACE AGENCE",
    title: "Mettez vos biens en avant",
    text: "Idéal pour les agences qui veulent plus de visibilité et plus de leads.",
  },
  {
    label: "PROMOTEURS",
    title: "Présentez vos programmes",
    text: "Un espace dédié aux projets immobiliers locaux et premium.",
  },
];

const DEMO_PROPERTIES: PropertyLike[] = [
  {
    id: "demo-1",
    title: "Villa moderne avec piscine",
    price: 250000000,
    city: "Douala",
    quartier: "Bonapriso",
    type: "Maison",
    purpose: "Vente",
    bedrooms: 4,
    bathrooms: 3,
    surface: 320,
    landSurface: 500,
    boost: true,
    verified: true,
    agentName: "Empire Immo",
    sellerPhone: "+237690000000",
    description: "Villa premium dans un quartier résidentiel calme.",
    images: [],
  },
];

export function HomeScreen({
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
  const showSidebar = width >= 900;

  const pagePadding = isPhone ? 14 : isTablet ? 18 : 24;
  const gap = isPhone ? 18 : 22;
  const cardWidth = "100%";

  const { recentProperties = [], popularProperties = [] } = useProperties(true);

  const [search, setSearch] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState<"Vente" | "Location" | "Terrain">("Vente");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterQuartier, setFilterQuartier] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterMinSurface, setFilterMinSurface] = useState("");
  const [filterMaxSurface, setFilterMaxSurface] = useState("");

  const [heroIndex, setHeroIndex] = useState(0);
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_IMAGES.length);
      setAdIndex((current) => (current + 1) % ADS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  function normalizeText(value: string) {
    const clean = value.trim();
    if (!clean) return "Autre";
    return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  }

  function toNumber(value: any) {
    const number = Number(String(value || "").replace(/\s/g, ""));
    return Number.isNaN(number) ? 0 : number;
  }

  const firebaseProperties = useMemo(() => {
    const map = new Map<string, PropertyLike>();

    [...popularProperties, ...recentProperties].forEach((item: any) => {
      if (item?.id) map.set(String(item.id), item);
    });

    return Array.from(map.values());
  }, [popularProperties, recentProperties]);

  const allProperties = useMemo(() => {
    const source = firebaseProperties.length > 0 ? firebaseProperties : DEMO_PROPERTIES;

    return source
      .map((item) => ({
        ...item,
        boost: item.boost || boostedIds.includes(String(item.id)),
      }))
      .sort((a, b) => {
        if (a.boost && !b.boost) return -1;
        if (!a.boost && b.boost) return 1;
        return 0;
      });
  }, [firebaseProperties, boostedIds]);

  const sponsoredProperties = useMemo(() => {
    const boosted = allProperties.filter((item) => item.boost);
    return boosted.length > 0 ? boosted : allProperties.slice(0, 8);
  }, [allProperties]);

  const boostedProperties = useMemo(() => {
    return allProperties.filter((item) => item.boost);
  }, [allProperties]);

  const cityStats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};

    allProperties.forEach((item) => {
      const city = normalizeText(item.city || "Autre");
      const type = normalizeText(item.type || "Autre");

      if (!stats[city]) stats[city] = {};
      stats[city][type] = (stats[city][type] || 0) + 1;
    });

    return Object.entries(stats).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allProperties]);

  const hasAdvancedFilter =
    filterCity ||
    filterQuartier ||
    filterMinPrice ||
    filterMaxPrice ||
    filterMinSurface ||
    filterMaxSurface;

  const filteredProperties = useMemo(() => {
    return allProperties.filter((item) => {
      const text = `${item.title || ""} ${item.city || ""} ${item.quartier || ""} ${item.type || ""}`.toLowerCase();

      const price = toNumber(item.price);
      const surface = toNumber(item.surface);

      const matchSearch = search ? text.includes(search.toLowerCase()) : true;

      const matchCity = selectedCity
        ? normalizeText(item.city || "") === selectedCity
        : filterCity
        ? String(item.city || "").toLowerCase().includes(filterCity.toLowerCase())
        : true;

      const matchQuartier = filterQuartier
        ? String(item.quartier || "").toLowerCase().includes(filterQuartier.toLowerCase())
        : true;

      const matchType = selectedType ? normalizeText(item.type || "") === selectedType : true;

      const matchPurpose =
        selectedPurpose === "Terrain"
          ? normalizeText(item.type || "") === "Terrain"
          : item.purpose
          ? item.purpose === selectedPurpose
          : true;

      return (
        matchSearch &&
        matchCity &&
        matchQuartier &&
        matchType &&
        matchPurpose &&
        (filterMinPrice ? price >= toNumber(filterMinPrice) : true) &&
        (filterMaxPrice ? price <= toNumber(filterMaxPrice) : true) &&
        (filterMinSurface ? surface >= toNumber(filterMinSurface) : true) &&
        (filterMaxSurface ? surface <= toNumber(filterMaxSurface) : true)
      );
    });
  }, [
    allProperties,
    search,
    selectedCity,
    selectedType,
    selectedPurpose,
    filterCity,
    filterQuartier,
    filterMinPrice,
    filterMaxPrice,
    filterMinSurface,
    filterMaxSurface,
  ]);

  function handlePublish() {
    if (!isLoggedIn) {
      onRequireAuth();
      return;
    }

    onNavigate("publish");
  }

  function clearFilters() {
    setSearch("");
    setSelectedCity(null);
    setSelectedType(null);
    setFilterCity("");
    setFilterQuartier("");
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setFilterMinSurface("");
    setFilterMaxSurface("");
  }

  function applyFilters() {
    setSelectedCity(null);
    setSelectedType(null);
    setFilterOpen(false);
  }

  function renderGrid(items: PropertyLike[]) {
    return (
      <View style={[styles.grid, { gap }]}>
        {items.map((item) => (
          <View key={item.id} style={[styles.gridItem, { width: cardWidth as any }]}>
            <PropertyCard
              item={item}
              compact={false}
              onPress={() => onOpenProperty(item)}
              onBoost={() => onBoostProperty?.(item)}
            />
          </View>
        ))}
      </View>
    );
  }

  const hasFilter = Boolean(search || selectedCity || selectedType || hasAdvancedFilter);
  const activeAd = ADS[adIndex];

  return (
    <LinearGradient colors={["#FFFFFF", "#F7F8F6", "#EEF2F0"]} style={styles.bg}>
      <ScrollView
        style={[styles.container, { padding: pagePadding }]}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: HERO_IMAGES[heroIndex] }}
          style={[styles.hero, isPhone && styles.heroMobile]}
          imageStyle={[styles.heroImage, isPhone && styles.heroImageMobile]}
        >
          <View style={[styles.heroOverlay, isPhone && styles.heroOverlayMobile]}>
            <View style={styles.heroContent}>
              <Text style={[styles.kicker, isPhone && styles.kickerMobile]}>
                EMPIRE CAMER IMMO
              </Text>

              <Text style={[styles.heroTitle, isPhone && styles.heroTitleMobile]}>
                Trouve le bien idéal au Cameroun
              </Text>

              <Text style={[styles.heroSubtitle, isPhone && styles.heroSubtitleMobile]}>
                Villas, appartements, terrains et immeubles vérifiés • Contact direct vendeur
              </Text>

              <View style={[styles.searchPanel, isPhone && styles.searchPanelMobile]}>
                <View style={[styles.segmentRow, !isPhone && styles.segmentRowDesktop]}>
                  {["Vente", "Location", "Terrain"].map((item) => {
                    const active = selectedPurpose === item;

                    return (
                      <Pressable
                        key={item}
                        style={[styles.segment, isPhone && styles.segmentMobile, active && styles.segmentActive]}
                        onPress={() => setSelectedPurpose(item as any)}
                      >
                        <Text style={[styles.segmentText, isPhone && styles.segmentTextMobile, active && styles.segmentTextActive]}>
                          {item === "Vente" ? "Acheter" : item === "Location" ? "Louer" : "Terrains"}
                        </Text>
                      </Pressable>
                    );
                  })}

                  <Pressable
                    style={[
                      styles.filterButton,
                      !isPhone && styles.filterButtonDesktop,
                      isPhone && styles.filterButtonMobile,
                      hasAdvancedFilter && styles.filterButtonActive,
                    ]}
                    onPress={() => setFilterOpen(true)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        isPhone && styles.filterButtonTextMobile,
                        hasAdvancedFilter && styles.filterButtonTextActive,
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
                  <Pressable style={[styles.searchButton, isPhone && styles.searchButtonMobile]}>
                    <Text style={[styles.searchButtonText, isPhone && styles.buttonTextMobile]}>
                      Rechercher
                    </Text>
                  </Pressable>

                  <Pressable style={[styles.publishButton, isPhone && styles.publishButtonMobile]} onPress={handlePublish}>
                    <Text style={[styles.publishText, isPhone && styles.buttonTextMobile]}>
                      Publier
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.pageLayout, !showSidebar && styles.pageLayoutSingle]}>
          <View style={styles.mainColumn}>
            <View style={styles.statsContainer}>
              <View style={[styles.statsHeader, isPhone && styles.statsHeaderMobile]}>
                <Text style={[styles.statsTitle, isPhone && styles.statsTitleMobile]}>
                  Biens disponibles par ville
                </Text>

                {hasFilter && (
                  <Pressable onPress={clearFilters}>
                    <Text style={styles.clearText}>Voir tout</Text>
                  </Pressable>
                )}
              </View>

              {cityStats.map(([city, types]) => (
                <View key={city} style={styles.cityCard}>
                  <Pressable
                    onPress={() => {
                      setSelectedCity(city);
                      setSelectedType(null);
                    }}
                  >
                    <Text style={[styles.cityTitle, selectedCity === city && styles.activeCityTitle]}>
                      {city}
                    </Text>
                  </Pressable>

                  <View style={styles.statsGrid}>
                    {Object.entries(types)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => {
                        const active = selectedCity === city && selectedType === type;

                        return (
                          <Pressable
                            key={`${city}-${type}`}
                            style={[styles.statChip, active && styles.activeChip]}
                            onPress={() => {
                              setSelectedCity(city);
                              setSelectedType(type);
                            }}
                          >
                            <Text style={[styles.statChipText, active && styles.activeChipText]}>
                              {type} ({count})
                            </Text>
                          </Pressable>
                        );
                      })}
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isPhone && styles.sectionTitleMobile]}>
                💎 Biens sponsorisés
              </Text>
              <Text style={styles.sectionSub}>Les annonces boostées apparaissent ici en priorité</Text>
            </View>

            <SponsoredSlider
              items={sponsoredProperties}
              onOpenProperty={onOpenProperty}
              onBoostProperty={onBoostProperty}
            />

            {hasFilter ? (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, isPhone && styles.sectionTitleMobile]}>
                    Résultats
                  </Text>
                  <Text style={styles.sectionSub}>Les biens boostés restent affichés en premier</Text>
                </View>

                {filteredProperties.length > 0 ? renderGrid(filteredProperties) : <Text style={styles.empty}>Aucun bien trouvé.</Text>}
              </>
            ) : (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, isPhone && styles.sectionTitleMobile]}>
                    🔥 Biens boostés
                  </Text>
                  <Text style={styles.sectionSub}>Visibilité premium pour les annonces sponsorisées</Text>
                </View>

                {boostedProperties.length > 0 ? renderGrid(boostedProperties) : <Text style={styles.empty}>Aucun bien boosté pour le moment.</Text>}

                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, isPhone && styles.sectionTitleMobile]}>
                    🆕 Annonces récentes
                  </Text>
                  <Text style={styles.sectionSub}>Les annonces premium sont toujours prioritaires</Text>
                </View>

                {allProperties.length > 0 ? renderGrid(allProperties) : <Text style={styles.empty}>Aucune annonce disponible.</Text>}
              </>
            )}
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
                <Text style={styles.sideAdImageText}>Bannières agences / promoteurs</Text>
              </View>
            </View>
          )}
        </View>

        <SecurityNotice />
      </ScrollView>

      <Modal visible={filterOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.filterModal, isPhone && styles.filterModalMobile]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isPhone && styles.modalTitleMobile]}>
                Filtres avancés
              </Text>

              <Pressable onPress={() => setFilterOpen(false)}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Affine ta recherche par ville, quartier, prix et surface.
            </Text>

            <View style={[styles.modalRow, isPhone && styles.modalRowMobile]}>
              <TextInput style={styles.modalInput} placeholder="Ville" value={filterCity} onChangeText={setFilterCity} />
              <TextInput style={styles.modalInput} placeholder="Quartier" value={filterQuartier} onChangeText={setFilterQuartier} />
            </View>

            <View style={[styles.modalRow, isPhone && styles.modalRowMobile]}>
              <TextInput style={styles.modalInput} placeholder="Prix minimum" value={filterMinPrice} onChangeText={setFilterMinPrice} keyboardType="numeric" />
              <TextInput style={styles.modalInput} placeholder="Prix maximum" value={filterMaxPrice} onChangeText={setFilterMaxPrice} keyboardType="numeric" />
            </View>

            <View style={[styles.modalRow, isPhone && styles.modalRowMobile]}>
              <TextInput style={styles.modalInput} placeholder="M² minimum" value={filterMinSurface} onChangeText={setFilterMinSurface} keyboardType="numeric" />
              <TextInput style={styles.modalInput} placeholder="M² maximum" value={filterMaxSurface} onChangeText={setFilterMaxSurface} keyboardType="numeric" />
            </View>

            <View style={[styles.modalActions, isPhone && styles.modalActionsMobile]}>
              <Pressable style={styles.resetButton} onPress={clearFilters}>
                <Text style={styles.resetText}>Réinitialiser</Text>
              </Pressable>

              <Pressable style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyText}>Appliquer les filtres</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, backgroundColor: "transparent" },

  hero: { minHeight: 520, borderRadius: 32, overflow: "hidden", marginBottom: 24 },
  heroMobile: { minHeight: 420, borderRadius: 22, marginBottom: 16 },

  heroImage: { borderRadius: 32 },
  heroImageMobile: { borderRadius: 22 },

  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,37,26,0.58)",
    padding: 32,
    justifyContent: "center",
  },

  heroOverlayMobile: {
    padding: 14,
    justifyContent: "flex-start",
  },

  heroContent: { maxWidth: 980 },

  kicker: {
    color: "#F0D77A",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },

  kickerMobile: {
    fontSize: 13,
    marginBottom: 8,
    marginTop: 8,
  },

  heroTitle: {
    color: "white",
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
  },

  heroTitleMobile: {
    fontSize: 24,
    lineHeight: 29,
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 18,
    marginTop: 12,
    lineHeight: 28,
    fontWeight: "700",
  },

  heroSubtitleMobile: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },

  searchPanel: {
    backgroundColor: "rgba(255,255,255,0.86)",
    borderRadius: 26,
    padding: 18,
    marginTop: 30,
    maxWidth: 980,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },

  searchPanelMobile: {
    padding: 12,
    borderRadius: 18,
    marginTop: 18,
  },

  segmentRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
    flexWrap: "wrap",
  },

  segmentRowDesktop: {
    alignItems: "center",
  },

  segment: {
    backgroundColor: "rgba(245,246,245,0.92)",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
  },

  segmentMobile: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  segmentActive: {
    backgroundColor: "rgba(234,244,239,0.95)",
    borderWidth: 1,
    borderColor: "#1F5C42",
  },

  segmentText: {
    color: "#1D2E26",
    fontWeight: "900",
    fontSize: 15,
  },

  segmentTextMobile: { fontSize: 12 },
  segmentTextActive: { color: "#1F5C42" },

  filterButton: {
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  filterButtonDesktop: {
    marginLeft: "auto",
  },

  filterButtonMobile: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  filterButtonActive: {
    borderColor: "#1F5C42",
    backgroundColor: "#EAF4EF",
  },

  filterButtonText: {
    color: "#1D2E26",
    fontWeight: "900",
    fontSize: 15,
  },

  filterButtonTextMobile: { fontSize: 12 },
  filterButtonTextActive: { color: "#1F5C42" },

  searchInput: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    borderRadius: 18,
    padding: 17,
    fontWeight: "800",
    fontSize: 16,
  },

  searchInputMobile: {
    borderRadius: 16,
    padding: 13,
    fontSize: 14,
  },

  searchActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  searchActionsMobile: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  searchButton: {
    flex: 1,
    backgroundColor: "#1F5C42",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
  },

  searchButtonMobile: {
    padding: 13,
    borderRadius: 14,
  },

  searchButtonText: {
    color: "white",
    fontWeight: "900",
  },

  publishButton: {
    flex: 1,
    backgroundColor: "#F0D77A",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
  },

  publishButtonMobile: {
    padding: 13,
    borderRadius: 14,
  },

  publishText: {
    color: "#06251A",
    fontWeight: "900",
  },

  buttonTextMobile: { fontSize: 12 },

  pageLayout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 22,
  },

  pageLayoutSingle: {
    flexDirection: "column",
  },

  mainColumn: {
    flex: 1,
    minWidth: 0,
    maxWidth: 1080,
  },

  sidebar: {
    width: 330,
    gap: 16,
  },

  sideAdGreen: {
    backgroundColor: "#1F5C42",
    borderRadius: 18,
    padding: 18,
  },

  sideAdLabel: {
    color: "#F0D77A",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },

  sideAdTitle: {
    color: "white",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 8,
  },

  sideAdText: {
    color: "rgba(255,255,255,0.88)",
    fontWeight: "700",
    lineHeight: 21,
  },

  sideAdButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 13,
    alignItems: "center",
    marginTop: 14,
  },

  sideAdButtonText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  sideBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  sideBoxTitle: {
    color: "#06251A",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  sideLink: {
    color: "#51635A",
    fontWeight: "800",
    marginBottom: 10,
  },

  sideAdImage: {
    height: 360,
    backgroundColor: "#EDF3EF",
    borderRadius: 18,
    padding: 18,
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  sideAdImageTitle: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
  },

  sideAdImageText: {
    color: "#51635A",
    fontWeight: "800",
    marginTop: 6,
  },

  statsContainer: {
    backgroundColor: "rgba(255,255,255,0.78)",
    padding: 16,
    borderRadius: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(227,234,230,0.95)",
  },

  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },

  statsHeaderMobile: {
    flexDirection: "column",
  },

  statsTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#06251A",
  },

  statsTitleMobile: {
    fontSize: 19,
  },

  clearText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  cityCard: {
    backgroundColor: "rgba(246,248,247,0.78)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(227,234,230,0.75)",
  },

  cityTitle: {
    fontSize: 18,
    color: "#06251A",
    fontWeight: "900",
    marginBottom: 10,
  },

  activeCityTitle: {
    color: "#1F5C42",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  statChip: {
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 999,
  },

  activeChip: {
    backgroundColor: "#1F5C42",
  },

  statChipText: {
    color: "#06251A",
    fontWeight: "900",
  },

  activeChipText: {
    color: "white",
  },

  sectionHeader: {
    marginTop: 10,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 31,
    fontWeight: "900",
    color: "#06251A",
  },

  sectionTitleMobile: {
    fontSize: 26,
  },

  sectionSub: {
    color: "#51635A",
    fontWeight: "800",
    marginTop: 5,
    fontSize: 15,
  },

  grid: {
    flexDirection: "column",
    alignItems: "stretch",
    marginBottom: 26,
  },

  gridItem: {
    width: "100%",
    maxWidth: 1080,
  },

  empty: {
    backgroundColor: "rgba(255,255,255,0.82)",
    padding: 18,
    borderRadius: 18,
    color: "#555",
    fontWeight: "800",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(227,234,230,0.8)",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,37,26,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },

  filterModal: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  filterModalMobile: {
    padding: 18,
    borderRadius: 22,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    color: "#06251A",
    fontSize: 26,
    fontWeight: "900",
  },

  modalTitleMobile: {
    fontSize: 22,
  },

  closeText: {
    color: "#A84A3A",
    fontSize: 32,
    fontWeight: "900",
  },

  modalSub: {
    color: "#51635A",
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 18,
  },

  modalRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  modalRowMobile: {
    flexDirection: "column",
  },

  modalInput: {
    flex: 1,
    backgroundColor: "#F7F8F6",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    borderRadius: 16,
    padding: 15,
    fontWeight: "800",
    color: "#06251A",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  modalActionsMobile: {
    flexDirection: "column",
  },

  resetButton: {
    flex: 1,
    backgroundColor: "#F7F8F6",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  resetText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  applyButton: {
    flex: 2,
    backgroundColor: "#1F5C42",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  applyText: {
    color: "white",
    fontWeight: "900",
  },
});