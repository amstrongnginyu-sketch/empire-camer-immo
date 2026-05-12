import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  price?: number;
  period?: string;
  negotiable?: boolean;
  onCall?: () => void;
  onWhatsapp?: () => void;
};

export default function DetailPriceBox({
  price = 250000000,
  period = "",
  negotiable = true,
  onCall,
  onWhatsapp,
}: Props) {
  const formattedPrice = new Intl.NumberFormat("fr-FR").format(price);

  return (
    <View style={styles.container}>
      <View style={styles.priceSection}>
        <Text style={styles.label}>Prix</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formattedPrice} FCFA
          </Text>

          {period ? (
            <Text style={styles.period}>
              / {period}
            </Text>
          ) : null}
        </View>

        {negotiable && (
          <View style={styles.negotiableBadge}>
            <Text style={styles.negotiableText}>
              Prix négociable
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, styles.callButton]}
          onPress={onCall}
        >
          <Text style={styles.callButtonText}>
            📞 Appeler
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.whatsappButton]}
          onPress={onWhatsapp}
        >
          <Text style={styles.whatsappButtonText}>
            WhatsApp
          </Text>
        </Pressable>
      </View>
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
    marginBottom: 18,
  },

  priceSection: {
    marginBottom: 22,
  },

  label: {
    color: "#6B6B5F",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },

  price: {
    color: "#06251A",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
  },

  period: {
    color: "#5F655F",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
    marginBottom: 5,
  },

  negotiableBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F2ED",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginTop: 14,
  },

  negotiableText: {
    color: "#1F5C42",
    fontSize: 12,
    fontWeight: "900",
  },

  buttons: {
    gap: 12,
  },

  button: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  callButton: {
    backgroundColor: "#1F5C42",
  },

  whatsappButton: {
    backgroundColor: "#F0D77A",
  },

  callButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  whatsappButtonText: {
    color: "#06251A",
    fontSize: 15,
    fontWeight: "900",
  },
});