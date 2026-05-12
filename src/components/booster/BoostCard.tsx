import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title?: string;
  price?: string;
  duration?: string;
  popular?: boolean;
  selected?: boolean;
  onPress?: () => void;
};

export default function BoostCard({
  title = "Boost Standard",
  price = "2 500 FCFA",
  duration = "7 jours",
  popular = false,
  selected = false,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.cardSelected,
        popular && styles.cardPopular,
      ]}
    >
      {popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Populaire</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.price}>{price}</Text>

      <Text style={styles.duration}>{duration}</Text>

      <View style={styles.checkLine}>
        <Text style={styles.check}>✓</Text>
        <Text style={styles.checkText}>Annonce mise en avant</Text>
      </View>

      <View style={styles.checkLine}>
        <Text style={styles.check}>✓</Text>
        <Text style={styles.checkText}>Priorité sur la page d’accueil</Text>
      </View>

      <View style={styles.checkLine}>
        <Text style={styles.check}>✓</Text>
        <Text style={styles.checkText}>Badge premium visible</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 240,

    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,

    borderWidth: 1,
    borderColor: "#E3EAE6",

    position: "relative",
  },

  cardSelected: {
    borderColor: "#1F5C42",
    borderWidth: 2,
    backgroundColor: "#F7FCF9",
  },

  cardPopular: {
    borderColor: "#F0D77A",
  },

  popularBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0D77A",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 14,
  },

  popularText: {
    color: "#06251A",
    fontSize: 11,
    fontWeight: "900",
  },

  title: {
    color: "#06251A",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
  },

  price: {
    color: "#1F5C42",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },

  duration: {
    color: "#6B6B5F",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 18,
  },

  checkLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  check: {
    color: "#1F5C42",
    fontSize: 15,
    fontWeight: "900",
    marginRight: 8,
  },

  checkText: {
    color: "#34433B",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
});