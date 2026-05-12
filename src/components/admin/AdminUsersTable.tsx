import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type User = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  phone?: string;
};

type Props = {
  users?: User[];
  onPromote?: (id: string) => void;
  onSuspend?: (id: string) => void;
};

export default function AdminUsersTable({
  users = [],
  onPromote,
  onSuspend,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Gestion utilisateurs
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.nameCol]}>
              Utilisateur
            </Text>

            <Text style={styles.headerCell}>
              Email
            </Text>

            <Text style={styles.headerCell}>
              Téléphone
            </Text>

            <Text style={styles.headerCell}>
              Rôle
            </Text>

            <Text style={styles.headerCell}>
              Actions
            </Text>
          </View>

          {users.map((user) => (
            <View key={user.id} style={styles.row}>
              <Text style={[styles.cell, styles.nameCol]}>
                {user.name}
              </Text>

              <Text style={styles.cell}>
                {user.email || "-"}
              </Text>

              <Text style={styles.cell}>
                {user.phone || "-"}
              </Text>

              <View style={styles.roleBox}>
                <Text style={styles.roleText}>
                  {user.role || "user"}
                </Text>
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={styles.promoteButton}
                  onPress={() => onPromote?.(user.id)}
                >
                  <Text style={styles.promoteText}>
                    Promote
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.suspendButton}
                  onPress={() => onSuspend?.(user.id)}
                >
                  <Text style={styles.suspendText}>
                    Suspend
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}

          {users.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Aucun utilisateur.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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

    marginBottom: 20,
  },

  title: {
    color: "#06251A",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#F5F7F4",
    borderRadius: 14,
    marginBottom: 10,
    paddingVertical: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#EEF2EF",
  },

  headerCell: {
    width: 200,
    color: "#06251A",
    fontWeight: "900",
    fontSize: 13,
    paddingHorizontal: 10,
  },

  cell: {
    width: 200,
    color: "#34433B",
    fontWeight: "700",
    fontSize: 13,
    paddingHorizontal: 10,
  },

  nameCol: {
    width: 220,
  },

  roleBox: {
    width: 140,
    paddingHorizontal: 10,
  },

  roleText: {
    alignSelf: "flex-start",

    backgroundColor: "#EAF4EF",

    color: "#1F5C42",

    paddingVertical: 6,
    paddingHorizontal: 10,

    borderRadius: 999,

    fontSize: 11,
    fontWeight: "900",
  },

  actions: {
    width: 220,

    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 10,
  },

  promoteButton: {
    backgroundColor: "#1F5C42",

    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 12,
  },

  suspendButton: {
    backgroundColor: "#FFF1F0",

    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 12,
  },

  promoteText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  suspendText: {
    color: "#A84A3A",
    fontWeight: "900",
    fontSize: 12,
  },

  empty: {
    paddingVertical: 30,
    alignItems: "center",
  },

  emptyText: {
    color: "#6B6B5F",
    fontWeight: "700",
  },
});