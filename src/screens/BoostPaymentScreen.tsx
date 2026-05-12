import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BoostBenefits from "../components/booster/BoostBenefits";
import BoostPaymentBox from "../components/booster/BoostPaymentBox";
import BoostPlans from "../components/booster/BoostPlans";

import { useAuth } from "../hooks/useAuth";
import { createPaymentRequest } from "../services/paymentService";

type Props = {
  annonceId?: string;
  onBack?: () => void;
};

export function BoostPaymentScreen({
  annonceId,
}: Props) {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [paymentMethod, setPaymentMethod] = useState("momo");

  function getPlanData() {
    switch (selectedPlan) {
      case "starter":
        return {
          amount: 2500,
          days: 7,
          title: "Boost Starter",
        };

      case "agency":
        return {
          amount: 25000,
          days: 90,
          title: "Boost Agence",
        };

      default:
        return {
          amount: 7500,
          days: 30,
          title: "Boost Premium",
        };
    }
  }

  async function handlePayment() {
    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Connecte-toi pour continuer."
      );
      return;
    }

    try {
      setLoading(true);

      const plan = getPlanData();

      await createPaymentRequest({
  type: "boost",

  amount: plan.amount,

  paymentMethod,

  annonceId: annonceId || "",

  userId: user.uid,

  userEmail: user.email || "",

  userName: profile?.name || "Utilisateur",

  days: plan.days,

  plan: selectedPlan,
  planTitle: plan.title,
} as any);

      Alert.alert(
        "Demande envoyée",
        "Votre demande de boost a été enregistrée."
      );
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Paiement impossible."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Booster votre annonce
        </Text>

        <Text style={styles.subtitle}>
          Augmentez la visibilité de votre bien immobilier et recevez plus
          de contacts rapidement.
        </Text>
      </View>

      <BoostBenefits />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Choisissez votre formule
        </Text>

        <BoostPlans
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
        />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#1F5C42" />

          <Text style={styles.loadingText}>
            Création du paiement...
          </Text>
        </View>
      ) : (
        <BoostPaymentBox
          selectedMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
          onPay={handlePayment}
        />
      )}
    </ScrollView>
  );
}

export default BoostPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F4",
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    color: "#06251A",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    marginBottom: 10,
  },

  subtitle: {
    color: "#6B6B5F",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "700",
    maxWidth: 700,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    color: "#06251A",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },

  loadingBox: {
    minHeight: 120,

    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    borderWidth: 1,
    borderColor: "#E3EAE6",

    alignItems: "center",
    justifyContent: "center",

    gap: 14,
  },

  loadingText: {
    color: "#1F5C42",
    fontSize: 15,
    fontWeight: "900",
  },
});