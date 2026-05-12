import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  selectedMethod?: string;
  onSelectMethod?: (method: string) => void;
  onPay?: () => void;
};

export default function BoostPaymentBox({
  selectedMethod = "momo",
  onSelectMethod,
  onPay,
}: Props) {
  const methods = [
    {
      id: "momo",
      label: "MTN Mobile Money",
      icon: "💛",
    },
    {
      id: "orange",
      label: "Orange Money",
      icon: "🧡",
    },
    {
      id: "card",
      label: "Carte bancaire",
      icon: "💳",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Paiement du boost
      </Text>

      <View style={styles.methods}>
        {methods.map((method) => {
          const active = selectedMethod === method.id;

          return (
            <Pressable
              key={method.id}
              style={[
                styles.methodCard,
                active && styles.methodCardActive,
              ]}
              onPress={() => onSelectMethod?.(method.id)}
            >
              <Text style={styles.icon}>
                {method.icon}
              </Text>

              <Text
                style={[
                  styles.methodText,
                  active && styles.methodTextActive,
                ]}
              >
                {method.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>
          Montant total
        </Text>

        <Text style={styles.summaryPrice}>
          7 500 FCFA
        </Text>
      </View>

      <Pressable style={styles.payButton} onPress={onPay}>
        <Text style={styles.payText}>
          Payer maintenant
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    padding: 22,

    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  title: {
    color: "#06251A",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 20,
  },

  methods: {
    gap: 14,
    marginBottom: 24,
  },

  methodCard: {
    minHeight: 68,

    borderRadius: 18,

    backgroundColor: "#F7F8F6",

    borderWidth: 1,
    borderColor: "#E3EAE6",

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
  },

  methodCardActive: {
    borderColor: "#1F5C42",
    backgroundColor: "#F7FCF9",
  },

  icon: {
    fontSize: 26,
    marginRight: 14,
  },

  methodText: {
    color: "#34433B",
    fontSize: 15,
    fontWeight: "800",
  },

  methodTextActive: {
    color: "#1F5C42",
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 24,
  },

  summaryLabel: {
    color: "#6B6B5F",
    fontSize: 15,
    fontWeight: "700",
  },

  summaryPrice: {
    color: "#1F5C42",
    fontSize: 30,
    fontWeight: "900",
  },

  payButton: {
    minHeight: 58,

    borderRadius: 18,

    backgroundColor: "#1F5C42",

    alignItems: "center",
    justifyContent: "center",
  },

  payText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});