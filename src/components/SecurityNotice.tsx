import { StyleSheet, Text, View } from "react-native";

function SecurityNotice() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        🔒 Sécurité & protection des utilisateurs
      </Text>

      <Text style={styles.brand}>EMPIRE CAMER IMMO</Text>

      <Text style={styles.text}>
        EMPIRE CAMER IMMO est une plateforme de mise en relation entre vendeurs,
        agences, propriétaires et acheteurs.
      </Text>

      <Text style={styles.warning}>
        EMPIRE CAMER IMMO n’est ni responsable ni complice de toute arnaque,
        fraude, fausse annonce ou escroquerie liée aux annonces publiées par les
        utilisateurs.
      </Text>

      <View style={styles.rulesBox}>
        <Text style={styles.rulesTitle}>Avant tout paiement :</Text>

        <Text style={styles.rule}>
          • Visitez physiquement le bien
        </Text>

        <Text style={styles.rule}>
          • Vérifiez l’identité du vendeur
        </Text>

        <Text style={styles.rule}>
          • Confirmez les documents du bien
        </Text>

        <Text style={styles.rule}>
          • Ne partagez jamais votre code Mobile Money
        </Text>

        <Text style={styles.rule}>
          • Signalez toute annonce suspecte
        </Text>
      </View>

      <Text style={styles.footer}>
        Ne payez jamais avant vérification complète.
      </Text>
    </View>
  );
}

export default SecurityNotice;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 34,
    marginBottom: 34,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  title: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },

  brand: {
    color: "#C9A646",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8,
  },

  text: {
    color: "#1D2E26",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  warning: {
    color: "#A84A3A",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  rulesBox: {
    backgroundColor: "#F7F8F6",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  rulesTitle: {
    color: "#1F5C42",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8,
  },

  rule: {
    color: "#1D2E26",
    fontSize: 13,
    lineHeight: 22,
    fontWeight: "800",
  },

  footer: {
    marginTop: 16,
    backgroundColor: "#1F5C42",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
  },
});