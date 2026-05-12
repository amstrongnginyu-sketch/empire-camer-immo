import { StyleSheet, View } from "react-native";

import BoostCard from "./BoostCard";

type Props = {
  selectedPlan?: string;
  onSelectPlan?: (plan: string) => void;
};

export default function BoostPlans({
  selectedPlan = "premium",
  onSelectPlan,
}: Props) {
  const plans = [
    {
      id: "starter",
      title: "Boost Starter",
      price: "2 500 FCFA",
      duration: "7 jours",
    },
    {
      id: "premium",
      title: "Boost Premium",
      price: "7 500 FCFA",
      duration: "30 jours",
      popular: true,
    },
    {
      id: "agency",
      title: "Boost Agence",
      price: "25 000 FCFA",
      duration: "90 jours",
    },
  ];

  return (
    <View style={styles.container}>
      {plans.map((plan) => (
        <BoostCard
          key={plan.id}
          title={plan.title}
          price={plan.price}
          duration={plan.duration}
          popular={plan.popular}
          selected={selectedPlan === plan.id}
          onPress={() => onSelectPlan?.(plan.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    flexDirection: "row",
    flexWrap: "wrap",

    gap: 18,
    marginBottom: 24,
  },
});