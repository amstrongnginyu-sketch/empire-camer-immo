import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";

const ADMIN_EMAIL = "admin@gmail.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [annonces, setAnnonces] = useState([]);

  async function login() {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        alert("Accès refusé");
        return;
      }

      setUser(res.user);
    } catch (e) {
      alert("Erreur login : " + e.message);
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "annonces"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setAnnonces(list);
    });

    return unsubscribe;
  }, [user]);

  async function validerAnnonce(id) {
    await updateDoc(doc(db, "annonces", id), {
      status: "approved",
      verified: true,
    });

    alert("Annonce validée ✅");
  }

  async function refuserAnnonce(id) {
    await updateDoc(doc(db, "annonces", id), {
      status: "rejected",
      verified: false,
    });

    alert("Annonce refusée ❌");
  }

  async function boosterAnnonce(id, boost) {
    await updateDoc(doc(db, "annonces", id), {
      boost: !boost,
    });

    alert(!boost ? "Annonce boostée 🔥" : "Boost retiré");
  }

  async function supprimerAnnonce(id) {
    const ok = confirm("Supprimer définitivement cette annonce ?");
    if (!ok) return;

    await deleteDoc(doc(db, "annonces", id));
    alert("Annonce supprimée");
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Login Admin</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Connexion</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard Admin 🔥</h1>

      <button onClick={logout}>Se déconnecter</button>

      <h2>Liste des annonces ({annonces.length})</h2>

      {annonces.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginBottom: 15,
            borderRadius: 12,
          }}
        >
          {item.images?.[0] && (
            <img
              src={item.images[0]}
              alt={item.title}
              style={{
                width: "100%",
                maxHeight: 260,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 15,
              }}
            />
          )}

          <h3>{item.title || "Sans titre"}</h3>

          <p>
            <strong>Prix :</strong> {item.price || "-"} FCFA
          </p>

          <p>
            <strong>Lieu :</strong> {item.city || "-"} -{" "}
            {item.quartier || "-"}
          </p>

          <p>
            <strong>Type :</strong> {item.type || "-"}
          </p>

          <p>
            <strong>Status :</strong> {item.status || "pending"}
          </p>

          <p>
            <strong>Vérifié :</strong> {item.verified ? "Oui" : "Non"}
          </p>

          <p>
            <strong>Boost :</strong> {item.boost ? "Oui" : "Non"}
          </p>

          <p>
            <strong>Description :</strong> {item.description || "-"}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => validerAnnonce(item.id)}>
              Valider
            </button>

            <button onClick={() => refuserAnnonce(item.id)}>
              Refuser
            </button>

            <button onClick={() => boosterAnnonce(item.id, item.boost)}>
              {item.boost ? "Retirer boost" : "Booster"}
            </button>

            <button onClick={() => supprimerAnnonce(item.id)}>
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}