import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  property?: any;
  onBack: () => void;
  onSuccess?: (property: any) => void;
};

const PLANS = [
  {
    id: "24h",
    title: "Boost 24h",
    price: 2000,
    description: "Visibilité prioritaire pendant 24 heures.",
  },
  {
    id: "7j",
    title: "Boost 7 jours",
    price: 5000,
    description: "Annonce mise en avant pendant 7 jours.",
  },
  {
    id: "30j",
    title: "Boost Premium 30 jours",
    price: 15000,
    description: "Priorité maximale + badge Premium pendant 30 jours.",
  },
];

export function BoostPaymentScreen({ property, onBack, onSuccess }: Props) {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"orange" | "mtn">("orange");
  const [loading, setLoading] = useState(false);

  function handlePayment() {
    if (!phone.trim()) {
      Alert.alert("Numéro requis", "Entre ton numéro Mobile Money.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      Alert.alert("Paiement réussi 💰", "Ton annonce est maintenant boostée.", [
        {
          text: "OK",
          onPress: () => {
            onSuccess?.({
              ...property,
              boost: true,
              boostPlan: selectedPlan.id,
              boostPrice: selectedPlan.price,
              boostMethod: method,
              boostedAt: Date.now(),
            });
          },
        },
      ]);
    }, 1600);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack}>
        <Text style={styles.back}>← Retour</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>💎 Booster l’annonce</Text>
        <Text style={styles.subtitle}>
          Augmente la visibilité de ton bien et apparais en priorité.
        </Text>
      </View>

      <View style={styles.propertyBox}>
        <Text style={styles.propertyLabel}>Annonce sélectionnée</Text>
        <Text style={styles.propertyTitle}>
          {property?.title || "Annonce immobilière"}
        </Text>
        <Text style={styles.propertyLocation}>
          📍 {property?.city || "-"} • {property?.quartier || "-"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Choisir une formule</Text>

      {PLANS.map((plan) => {
        const active = selectedPlan.id === plan.id;

        return (
          <Pressable
            key={plan.id}
            style={[styles.planCard, active && styles.planActive]}
            onPress={() => setSelectedPlan(plan)}
          >
            <View style={styles.planLeft}>
              <Text style={[styles.planTitle, active && styles.planTitleActive]}>
                {plan.title}
              </Text>
              <Text style={styles.planDesc}>{plan.description}</Text>
            </View>

            <Text style={[styles.planPrice, active && styles.planPriceActive]}>
              {plan.price.toLocaleString("fr-FR")} FCFA
            </Text>
          </Pressable>
        );
      })}

      <Text style={styles.sectionTitle}>Méthode de paiement</Text>

      <View style={styles.methodRow}>
        <Pressable
          style={[styles.methodButton, method === "orange" && styles.methodActive]}
          onPress={() => setMethod("orange")}
        >
          <Text
            style={[
              styles.methodText,
              method === "orange" && styles.methodTextActive,
            ]}
          >
            Orange Money
          </Text>
        </Pressable>

        <Pressable
          style={[styles.methodButton, method === "mtn" && styles.methodActive]}
          onPress={() => setMethod("mtn")}
        >
          <Text
            style={[
              styles.methodText,
              method === "mtn" && styles.methodTextActive,
            ]}
          >
            MTN MoMo
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Numéro Mobile Money"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total à payer</Text>
        <Text style={styles.totalAmount}>
          {selectedPlan.price.toLocaleString("fr-FR")} FCFA
        </Text>
      </View>

      <Pressable style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payText}>
          {loading ? "Traitement du paiement..." : "Payer et booster maintenant"}
        </Text>
      </Pressable>

      <Text style={styles.security}>
        🔒 Ne partage jamais ton code secret Mobile Money. EMPIRE CAMER IMMO ne
        te demandera jamais ton PIN.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F6",
    padding: 18,
  },

  back: {
    color: "#1F5C42",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 16,
  },

  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 18,
  },

  title: {
    color: "#06251A",
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    color: "#51635A",
    fontWeight: "800",
    lineHeight: 24,
    marginTop: 10,
  },

  propertyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 22,
  },

  propertyLabel: {
    color: "#C9A646",
    fontWeight: "900",
    marginBottom: 6,
  },

  propertyTitle: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
  },

  propertyLocation: {
    color: "#51635A",
    fontWeight: "800",
    marginTop: 8,
  },

  sectionTitle: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 8,
  },

  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },

  planActive: {
    borderColor: "#C9A646",
    backgroundColor: "#FFF8E6",
  },

  planLeft: {
    flex: 1,
  },

  planTitle: {
    color: "#06251A",
    fontSize: 18,
    fontWeight: "900",
  },

  planTitleActive: {
    color: "#1F5C42",
  },

  planDesc: {
    color: "#51635A",
    fontWeight: "700",
    marginTop: 6,
  },

  planPrice: {
    color: "#C9A646",
    fontSize: 18,
    fontWeight: "900",
  },

  planPriceActive: {
    color: "#1F5C42",
  },

  methodRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  methodButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },

  methodActive: {
    backgroundColor: "#1F5C42",
    borderColor: "#1F5C42",
  },

  methodText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  methodTextActive: {
    color: "white",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    borderRadius: 18,
    padding: 16,
    fontWeight: "800",
    marginBottom: 18,
  },

  totalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  totalLabel: {
    color: "#51635A",
    fontWeight: "900",
  },

  totalAmount: {
    color: "#C9A646",
    fontSize: 20,
    fontWeight: "900",
  },

  payButton: {
    backgroundColor: "#1F5C42",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 18,
  },

  payText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },

  security: {
    color: "#A84A3A",
    fontWeight: "800",
    lineHeight: 22,
    marginBottom: 40,
  },
});