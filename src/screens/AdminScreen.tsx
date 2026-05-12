import { ScrollView, StyleSheet, Text, View } from "react-native";

import AdminPropertyTable from "../components/admin/AdminPropertyTable";
import AdminReports from "../components/admin/AdminReports";
import AdminStats from "../components/admin/AdminStats";
import AdminUsersTable from "../components/admin/AdminUsersTable";

type PropertyItem = {
  id: string;
  title: string;
  city?: string;
  type?: string;
  price?: number;
  status?: string;
};

type UserItem = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  phone?: string;
};

export function AdminScreen() {
  const properties: PropertyItem[] = [];
  const users: UserItem[] = [];

  const pendingProperties = properties.filter(
    (item) => item.status === "pending"
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard Admin</Text>

        <Text style={styles.subtitle}>
          Gestion des annonces, utilisateurs et signalements.
        </Text>
      </View>

      <AdminStats
        totalProperties={properties.length}
        pendingProperties={pendingProperties.length}
        totalUsers={users.length}
        totalViews={0}
      />

      <AdminPropertyTable
        properties={properties}
        onApprove={(id) => console.log("Valider annonce:", id)}
        onReject={(id) => console.log("Refuser annonce:", id)}
        onOpen={(id) => console.log("Ouvrir annonce:", id)}
      />

      <AdminUsersTable
        users={users}
        onPromote={(id) => console.log("Promouvoir utilisateur:", id)}
        onSuspend={(id) => console.log("Suspendre utilisateur:", id)}
      />

      <AdminReports
        reports={[]}
        onReview={(id) => console.log("Examiner signalement:", id)}
      />
    </ScrollView>
  );
}

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F4",
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    color: "#06251A",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    marginBottom: 8,
  },

  subtitle: {
    color: "#6B6B5F",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
});