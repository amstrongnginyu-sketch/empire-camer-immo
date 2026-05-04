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
import { SecurityNotice } from "../components/SecurityNotice";

import { PropertyCard } from "../components/PropertyCard";
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
    label: "ESPACE PUBLICITAIRE",
    title: "Boostez votre agence immobilière",
    text: "Touchez plus de clients sérieux avec une annonce premium.",
  },
  {
    label: "SPONSOR PREMIUM",
    title: "Banques, agences, promoteurs",
    text: "Votre bannière peut apparaître ici avec rotation automatique.",
  },
  {
    label: "ANNONCE PARTENAIRE",
    title: "Mettez vos biens en avant",
    text: "Idéal pour les agences qui veulent générer plus de leads.",
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
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
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
  const isMobile = width < 760;

  const { recentProperties = [], popularProperties = [] } = useProperties(true);

  const [search, setSearch] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState<
    "Vente" | "Location" | "Terrain"
  >("Vente");

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

  function getCardWidth() {
    if (width < 650) return "100%";
    if (width < 1000) return "48%";
    if (width < 1450) return "31.8%";
    return "23.7%";
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
      const text = `${item.title || ""} ${item.city || ""} ${
        item.quartier || ""
      } ${item.type || ""}`.toLowerCase();

      const price = toNumber(item.price);
      const surface = toNumber(item.surface);

      const matchSearch = search ? text.includes(search.toLowerCase()) : true;

      const matchCity = selectedCity
        ? normalizeText(item.city || "") === selectedCity
        : filterCity
        ? String(item.city || "")
            .toLowerCase()
            .includes(filterCity.toLowerCase())
        : true;

      const matchQuartier = filterQuartier
        ? String(item.quartier || "")
            .toLowerCase()
            .includes(filterQuartier.toLowerCase())
        : true;

      const matchType = selectedType
        ? normalizeText(item.type || "") === selectedType
        : true;

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
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.id} style={[styles.gridItem, { width: getCardWidth() }]}>
            <PropertyCard
              item={item}
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: HERO_IMAGES[heroIndex] }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.kicker}>EMPIRE CAMER IMMO</Text>

              <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile]}>
                Trouve le bien idéal au Cameroun
              </Text>

              <Text style={styles.heroSubtitle}>
                Villas, appartements, terrains et immeubles vérifiés • Contact direct vendeur
              </Text>

              <View style={styles.searchPanel}>
                <View style={styles.segmentRow}>
                  {["Vente", "Location", "Terrain"].map((item) => {
                    const active = selectedPurpose === item;

                    return (
                      <Pressable
                        key={item}
                        style={[styles.segment, active && styles.segmentActive]}
                        onPress={() => setSelectedPurpose(item as any)}
                      >
                        <Text
                          style={[
                            styles.segmentText,
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
                    style={[
                      styles.filterButton,
                      hasAdvancedFilter && styles.filterButtonActive,
                    ]}
                    onPress={() => setFilterOpen(true)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        hasAdvancedFilter && styles.filterButtonTextActive,
                      ]}
                    >
                      Filtres ⚙️
                    </Text>
                  </Pressable>
                </View>

                <TextInput
                  style={styles.searchInput}
                  placeholder="Ville, quartier, type de bien..."
                  placeholderTextColor="#6B6B5F"
                  value={search}
                  onChangeText={setSearch}
                />

                <View
                  style={[
                    styles.searchActions,
                    isMobile && styles.searchActionsMobile,
                  ]}
                >
                  <Pressable style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>Rechercher</Text>
                  </Pressable>

                  <Pressable style={styles.publishButton} onPress={handlePublish}>
                    <Text style={styles.publishText}>Publier une annonce</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.adBanner}>
          <View>
            <Text style={styles.adLabel}>{activeAd.label}</Text>
            <Text style={styles.adTitle}>{activeAd.title}</Text>
            <Text style={styles.adText}>{activeAd.text}</Text>
          </View>

          <Pressable style={styles.adButton}>
            <Text style={styles.adButtonText}>Réserver</Text>
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Biens disponibles par ville</Text>

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
                <Text
                  style={[
                    styles.cityTitle,
                    selectedCity === city && styles.activeCityTitle,
                  ]}
                >
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
                        <Text
                          style={[
                            styles.statChipText,
                            active && styles.activeChipText,
                          ]}
                        >
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
          <Text style={styles.sectionTitle}>💎 Biens sponsorisés</Text>
          <Text style={styles.sectionSub}>
            Les annonces boostées apparaissent ici en priorité
          </Text>
        </View>

        <SponsoredSlider
  items={sponsoredProperties}
  onOpenProperty={onOpenProperty}
  onBoostProperty={onBoostProperty}
/>

        {hasFilter ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Résultats</Text>
              <Text style={styles.sectionSub}>
                Les biens boostés restent affichés en premier
              </Text>
            </View>

            {filteredProperties.length > 0 ? (
              renderGrid(filteredProperties)
            ) : (
              <Text style={styles.empty}>Aucun bien trouvé.</Text>
            )}
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Biens boostés</Text>
              <Text style={styles.sectionSub}>
                Visibilité premium pour les annonces sponsorisées
              </Text>
            </View>

            {boostedProperties.length > 0 ? (
              renderGrid(boostedProperties)
            ) : (
              <Text style={styles.empty}>Aucun bien boosté pour le moment.</Text>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🆕 Annonces récentes</Text>
              <Text style={styles.sectionSub}>
                Les annonces premium sont toujours prioritaires
              </Text>
            </View>

            {allProperties.length > 0 ? (
              renderGrid(allProperties)
            ) : (
              <Text style={styles.empty}>Aucune annonce disponible.</Text>
            )}
          </>
        )}

        <SecurityNotice />
      </ScrollView>

      <Modal visible={filterOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres avancés</Text>

              <Pressable onPress={() => setFilterOpen(false)}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Affine ta recherche par ville, quartier, prix et surface.
            </Text>

            <View style={styles.modalRow}>
              <TextInput
                style={styles.modalInput}
                placeholder="Ville"
                value={filterCity}
                onChangeText={setFilterCity}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Quartier"
                value={filterQuartier}
                onChangeText={setFilterQuartier}
              />
            </View>

            <View style={styles.modalRow}>
              <TextInput
                style={styles.modalInput}
                placeholder="Prix minimum"
                value={filterMinPrice}
                onChangeText={setFilterMinPrice}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Prix maximum"
                value={filterMaxPrice}
                onChangeText={setFilterMaxPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalRow}>
              <TextInput
                style={styles.modalInput}
                placeholder="M² minimum"
                value={filterMinSurface}
                onChangeText={setFilterMinSurface}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.modalInput}
                placeholder="M² maximum"
                value={filterMaxSurface}
                onChangeText={setFilterMaxSurface}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
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
  container: { flex: 1, backgroundColor: "transparent", padding: 16 },
  hero: { minHeight: 520, borderRadius: 32, overflow: "hidden", marginBottom: 22 },
  heroImage: { borderRadius: 32 },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(6,37,26,0.58)",
    padding: 32,
    justifyContent: "center",
  },
  heroContent: { maxWidth: 860 },
  kicker: {
    color: "#F0D77A",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  heroTitle: {
    color: "white",
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900",
  },
  heroTitleMobile: { fontSize: 30, lineHeight: 36 },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 18,
    marginTop: 12,
    lineHeight: 28,
    fontWeight: "700",
  },
  searchPanel: {
    backgroundColor: "rgba(255,255,255,0.86)",
    borderRadius: 26,
    padding: 18,
    marginTop: 30,
    maxWidth: 900,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  segmentRow: { flexDirection: "row", gap: 10, marginBottom: 14, flexWrap: "wrap" },
  segment: {
    backgroundColor: "rgba(245,246,245,0.92)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  segmentActive: {
    backgroundColor: "rgba(234,244,239,0.95)",
    borderWidth: 1,
    borderColor: "#1F5C42",
  },
  segmentText: { color: "#1D2E26", fontWeight: "900" },
  segmentTextActive: { color: "#1F5C42" },
  filterButton: {
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },
  filterButtonActive: { borderColor: "#1F5C42", backgroundColor: "#EAF4EF" },
  filterButtonText: { color: "#1D2E26", fontWeight: "900" },
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
  searchActions: { flexDirection: "row", gap: 12, marginTop: 14 },
  searchActionsMobile: { flexDirection: "column" },
  searchButton: {
    flex: 1,
    backgroundColor: "#1F5C42",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
  },
  searchButtonText: { color: "white", fontWeight: "900" },
  publishButton: {
    flex: 1,
    backgroundColor: "#F0D77A",
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
  },
  publishText: { color: "#06251A", fontWeight: "900" },
  adBanner: {
    backgroundColor: "#1F5C42",
    borderRadius: 26,
    padding: 24,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adLabel: { color: "#F0D77A", fontSize: 12, fontWeight: "900", marginBottom: 6 },
  adTitle: { color: "white", fontSize: 24, fontWeight: "900" },
  adText: { color: "rgba(255,255,255,0.86)", marginTop: 5, fontWeight: "700" },
  adButton: {
    backgroundColor: "white",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 16,
  },
  adButtonText: { color: "#1F5C42", fontWeight: "900" },
  statsContainer: {
    backgroundColor: "rgba(255,255,255,0.78)",
    padding: 20,
    borderRadius: 26,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(227,234,230,0.95)",
  },
  statsHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  statsTitle: { fontSize: 22, fontWeight: "900", color: "#06251A" },
  clearText: { color: "#1F5C42", fontWeight: "900" },
  cityCard: {
    backgroundColor: "rgba(246,248,247,0.78)",
    borderRadius: 20,
    padding: 17,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(227,234,230,0.75)",
  },
  cityTitle: {
    fontSize: 18,
    color: "#06251A",
    fontWeight: "900",
    marginBottom: 10,
  },
  activeCityTitle: { color: "#1F5C42" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statChip: {
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  activeChip: { backgroundColor: "#1F5C42" },
  statChipText: { color: "#06251A", fontWeight: "900" },
  activeChipText: { color: "white" },
  sectionHeader: { marginTop: 6, marginBottom: 14 },
  sectionTitle: { fontSize: 26, fontWeight: "900", color: "#06251A" },
  sectionSub: { color: "#51635A", fontWeight: "700", marginTop: 5 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 22,
  },
  gridItem: { minWidth: 260 },
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
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { color: "#06251A", fontSize: 26, fontWeight: "900" },
  closeText: { color: "#A84A3A", fontSize: 32, fontWeight: "900" },
  modalSub: { color: "#51635A", fontWeight: "700", marginTop: 6, marginBottom: 18 },
  modalRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
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
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  resetButton: {
    flex: 1,
    backgroundColor: "#F7F8F6",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  resetText: { color: "#1F5C42", fontWeight: "900" },
  applyButton: {
    flex: 2,
    backgroundColor: "#1F5C42",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  applyText: { color: "white", fontWeight: "900" },
});