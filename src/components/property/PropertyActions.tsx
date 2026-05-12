import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onCall: (e?: any) => void;
  onWhatsapp: (e?: any) => void;
  mobile?: boolean;
};

export function PropertyActions({ onCall, onWhatsapp }: Props) {
  return (
    <View style={styles.actions}>
      <Pressable style={styles.callButton} onPress={onCall}>
        <Text style={styles.callText}>Appeler</Text>
      </Pressable>

      <Pressable style={styles.whatsappButton} onPress={onWhatsapp}>
        <Text style={styles.whatsappText}>WhatsApp</Text>
      </Pressable>
    </View>
  );
}

export default PropertyActions;

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  callButton: {
    flex: 1,
    backgroundColor: "#1F5C42",
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: "center",
  },

  whatsappButton: {
    flex: 1,
    backgroundColor: "#F0D77A",
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: "center",
  },

  callText: {
    color: "white",
    fontWeight: "900",
    fontSize: 13,
  },

  whatsappText: {
    color: "#06251A",
    fontWeight: "900",
    fontSize: 13,
  },
});