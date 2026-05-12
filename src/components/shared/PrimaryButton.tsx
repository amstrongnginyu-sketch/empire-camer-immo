import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "gold";
  fullWidth?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  fullWidth = true,
  style,
}: Props) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGold = variant === "gold";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,

        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isGold && styles.gold,

        (disabled || loading) && styles.disabled,

        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isGold ? "#06251A" : "#FFFFFF"}
        />
      ) : (
        <Text
          style={[
            styles.text,

            isPrimary && styles.primaryText,
            isSecondary && styles.secondaryText,
            isGold && styles.goldText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  fullWidth: {
    width: "100%",
  },

  primary: {
    backgroundColor: "#1F5C42",
  },

  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E3DD",
  },

  gold: {
    backgroundColor: "#F0D77A",
  },

  disabled: {
    opacity: 0.6,
  },

  text: {
    fontSize: 15,
    fontWeight: "900",
  },

  primaryText: {
    color: "#FFFFFF",
  },

  secondaryText: {
    color: "#06251A",
  },

  goldText: {
    color: "#06251A",
  },
});