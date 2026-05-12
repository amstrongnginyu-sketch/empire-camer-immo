import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  agentName?: string;
  agentPhone?: string;
  agency?: string;
  verified?: boolean;
  avatar?: string;
  onCall?: () => void;
  onWhatsapp?: () => void;
};

export default function DetailAgentBox({
  agentName = "Empire Camer Immo",
  agentPhone = "+237 6XX XXX XXX",
  agency = "Agence immobilière",
  verified = true,
  avatar,
  onCall,
  onWhatsapp,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Agent immobilier
      </Text>

      <View style={styles.content}>
        <View style={styles.left}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                👤
              </Text>
            </View>
          )}

          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {agentName}
              </Text>

              {verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>
                    Vérifié
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.agency}>
              {agency}
            </Text>

            <Text style={styles.phone}>
              {agentPhone}
            </Text>
          </View>
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

  title: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 18,
  },

  content: {
    gap: 18,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },

  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EDF3EF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  avatarText: {
    fontSize: 34,
  },

  info: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },

  name: {
    color: "#06251A",
    fontSize: 18,
    fontWeight: "900",
  },

  verifiedBadge: {
    backgroundColor: "#E8F2ED",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  verifiedText: {
    color: "#1F5C42",
    fontSize: 11,
    fontWeight: "900",
  },

  agency: {
    color: "#6B6B5F",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  phone: {
    color: "#06251A",
    fontSize: 15,
    fontWeight: "800",
  },

  buttons: {
    gap: 12,
  },

  button: {
    minHeight: 52,
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