import { LinearGradient } from "expo-linear-gradient";
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

type Props = {
  search?: string;
  selectedPurpose?: "Vente" | "Location" | "Terrain";
  onChangeSearch?: (value: string) => void;
  onSelectPurpose?: (value: "Vente" | "Location" | "Terrain") => void;
  onOpenFilters?: () => void;
  onPublish?: () => void;
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop";

export default function HomeHero({
  search = "",
  selectedPurpose = "Vente",
  onChangeSearch,
  onSelectPurpose,
  onOpenFilters,
  onPublish,
}: Props) {
  const { width } = useWindowDimensions();
  const isPhone = width < 700;

  const purposes: Array<"Vente" | "Location" | "Terrain"> = [
    "Vente",
    "Location",
    "Terrain",
  ];

  return (
    <ImageBackground
      source={{ uri: HERO_IMAGE }}
      style={[styles.hero, isPhone && styles.heroPhone]}
      imageStyle={styles.heroImage}
    >
      <LinearGradient
        colors={["rgba(6,37,26,0.72)", "rgba(6,37,26,0.42)"]}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <Text style={[styles.kicker, isPhone && styles.kickerPhone]}>
            EMPIRE CAMER IMMO
          </Text>

          <Text style={[styles.title, isPhone && styles.titlePhone]}>
            Trouve le bien idéal au Cameroun
          </Text>

          <Text style={[styles.subtitle, isPhone && styles.subtitlePhone]}>
            Villas, appartements, terrains et immeubles vérifiés
          </Text>

          <View style={[styles.searchCard, isPhone && styles.searchCardPhone]}>
            <View style={styles.tabs}>
              {purposes.map((purpose) => {
                const active = selectedPurpose === purpose;

                return (
                  <Pressable
                    key={purpose}
                    style={[styles.tab, active && styles.tabActive]}
                    onPress={() => onSelectPurpose?.(purpose)}
                  >
                    <Text style={[styles.tabText, active && styles.tabTextActive]}>
                      {purpose === "Vente"
                        ? "Acheter"
                        : purpose === "Location"
                        ? "Louer"
                        : "Terrains"}
                    </Text>
                  </Pressable>
                );
              })}

              <Pressable style={styles.filterButton} onPress={onOpenFilters}>
                <Text style={styles.filterText}>Filtres ⚙️</Text>
              </Pressable>
            </View>

            <TextInput
              value={search}
              onChangeText={onChangeSearch}
              placeholder="Ville, quartier, type de bien..."
              placeholderTextColor="#6B6B5F"
              style={styles.input}
            />

            <View style={styles.actions}>
              <Pressable style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Rechercher</Text>
              </Pressable>

              <Pressable style={styles.publishButton} onPress={onPublish}>
                <Text style={styles.publishButtonText}>Publier</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: "100%",
    height: 340,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
  },

  heroPhone: {
    height: 360,
    borderRadius: 20,
  },

  heroImage: {
    borderRadius: 22,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },

  content: {
    width: "100%",
    maxWidth: 760,
  },

  kicker: {
    color: "#F0D77A",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  kickerPhone: {
    fontSize: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
  },

  titlePhone: {
    fontSize: 24,
    lineHeight: 30,
  },

  subtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "700",
  },

  subtitlePhone: {
    fontSize: 13,
    marginBottom: 14,
  },

  searchCard: {
    width: "100%",
    maxWidth: 680,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 12,
  },

  searchCardPhone: {
    borderRadius: 18,
    padding: 12,
  },

  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  tab: {
    backgroundColor: "#F3F4F3",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  tabActive: {
    backgroundColor: "#EAF4EF",
    borderWidth: 1,
    borderColor: "#1F5C42",
  },

  tabText: {
    color: "#1D2E26",
    fontSize: 14,
    fontWeight: "900",
  },

  tabTextActive: {
    color: "#1F5C42",
  },

  filterButton: {
    marginLeft: "auto",
    backgroundColor: "#FFFFFF",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
  },

  filterText: {
    color: "#1D2E26",
    fontWeight: "900",
    fontSize: 14,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 13,
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 12,
    outlineStyle: "none" as any,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
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

  publishButtonText: {
    color: "#06251A",
    fontWeight: "900",
  },
});