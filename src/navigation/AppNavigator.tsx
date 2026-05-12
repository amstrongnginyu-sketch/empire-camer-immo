import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../services/authService";

import { AdminScreen } from "../screens/AdminScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { BoostPaymentScreen } from "../screens/BoostPaymentScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import HomeScreen from "../screens/HomeScreen";
import { PropertyDetailScreen } from "../screens/PropertyDetailScreen";
import { PublishScreen } from "../screens/PublishScreen";

type Screen =
  | "home"
  | "auth"
  | "publish"
  | "detail"
  | "admin"
  | "favorites"
  | "boost";

export default function AppNavigator() {
  const { loading, isLoggedIn, isAdmin, profile } = useAuth();

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [boostedIds, setBoostedIds] = useState<string[]>([]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#C9A646" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  function applyBoostToProperty(property: any) {
    if (!property?.id) return property;

    return {
      ...property,
      boost: property.boost || boostedIds.includes(String(property.id)),
    };
  }

  function goPublish() {
    if (!isLoggedIn) {
      setScreen("auth");
      return;
    }

    setScreen("publish");
  }

  function goAdmin() {
    if (!isLoggedIn) {
      setScreen("auth");
      return;
    }

    if (!isAdmin) {
      setScreen("home");
      return;
    }

    setScreen("admin");
  }

  function goFavorites() {
    setScreen("favorites");
  }

  function openProperty(property: any) {
    setSelectedProperty(applyBoostToProperty(property));
    setScreen("detail");
  }

  function openBoost(property: any) {
    setSelectedProperty(applyBoostToProperty(property));
    setScreen("boost");
  }

  function handleBoostSuccess(property: any) {
    if (property?.id) {
      const id = String(property.id);

      setBoostedIds((current) =>
        current.includes(id) ? current : [id, ...current]
      );

      setSelectedProperty({
        ...property,
        boost: true,
      });
    }

    setScreen("home");
  }

  async function handleLogout() {
    try {
      await logoutUser();
      setScreen("home");
    } catch (error) {
      console.log("Erreur logout:", error);
    }
  }

  function renderHome() {
    return (
      <HomeScreen
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        profile={profile}
        onRequireAuth={() => setScreen("auth")}
        onNavigate={setScreen}
        onOpenProperty={openProperty}
        onBoostProperty={openBoost}
        boostedIds={boostedIds}
      />
    );
  }

  function renderScreen() {
    if (screen === "auth") {
      return (
        <AuthScreen
          onBack={() => setScreen("home")}
          onLoginSuccess={() => setScreen("home")}
        />
      );
    }

    if (screen === "publish") {
      if (!isLoggedIn) {
        return (
          <AuthScreen
            onBack={() => setScreen("home")}
            onLoginSuccess={() => setScreen("publish")}
          />
        );
      }

      return <PublishScreen onBack={() => setScreen("home")} />;
    }

    if (screen === "admin") {
      if (!isLoggedIn || !isAdmin) {
        return renderHome();
      }

      return <AdminScreen onBack={() => setScreen("home")} />;
    }

    if (screen === "favorites") {
      return <FavoritesScreen onOpenProperty={openProperty} />;
    }

    if (screen === "boost") {
      return (
        <BoostPaymentScreen
          property={selectedProperty}
          onBack={() => setScreen("home")}
          onSuccess={handleBoostSuccess}
        />
      );
    }

    if (screen === "detail" && selectedProperty) {
      return (
        <PropertyDetailScreen
          property={applyBoostToProperty(selectedProperty)}
          onBack={() => setScreen("home")}
        />
      );
    }

    return renderHome();
  }

  const hideHeader = screen === "auth";

  return (
    <View style={styles.app}>
      {!hideHeader && (
        <AppHeader
          isLoggedIn={isLoggedIn}
          userEmail={profile?.email}
          isAdmin={isAdmin}
          onHome={() => setScreen("home")}
          onPublish={goPublish}
          onLogin={() => setScreen("auth")}
          onLogout={handleLogout}
          onAdmin={goAdmin}
          onFavorites={goFavorites}
        />
      )}

      <View style={styles.content}>{renderScreen()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#F7F8F6",
  },

  content: {
    flex: 1,
  },

  loading: {
    flex: 1,
    backgroundColor: "#F7F8F6",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#1F5C42",
    fontWeight: "900",
    marginTop: 12,
  },
});