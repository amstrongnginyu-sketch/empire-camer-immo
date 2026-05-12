import { ReactNode } from "react";
import {
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  maxWidth?: number;
};

export default function GlobalContainer({
  children,
  scroll = true,
  padded = true,
  maxWidth = 1500,
}: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;

  const content = (
    <View
      style={[
        styles.inner,
        padded && styles.padded,
        isPhone && styles.paddedPhone,
        {
          maxWidth,
        },
      ]}
    >
      {children}
    </View>
  );

  if (!scroll) {
    return <View style={styles.wrapper}>{content}</View>;
  }

  return (
    <ScrollView
      style={styles.wrapper}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
  },

  inner: {
    width: "100%",
    alignSelf: "center",
  },

  padded: {
    paddingHorizontal: 24,
    paddingVertical: 18,
  },

  paddedPhone: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});