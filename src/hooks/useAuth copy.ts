import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export function useBreakpoint() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isPhone = width < 600;
    const isTablet = width >= 600 && width < 1024;
    const isDesktop = width >= 1024;

    const columns =
      width < 600 ? 1 : width < 1024 ? 2 : width < 1440 ? 3 : 4;

    return {
      width,
      height,
      isPhone,
      isTablet,
      isDesktop,
      columns,
      gap: isPhone ? 12 : 16,
      pagePadding: isPhone ? 14 : isTablet ? 18 : 24,
      cardWidth:
        columns === 1 ? "100%" : `${(100 - (columns - 1) * 2) / columns}%`,
    };
  }, [width, height]);
}