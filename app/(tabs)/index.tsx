import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebaseConfig";

function formatFCFA(value: any) {
  const number = String(value || "").replace(/\D/g, "");
  if (!number) return "0 FCFA";
  return Number(number).toLocaleString("fr-FR") + " FCFA";
}

function cleanPhone(value: any) {
  return String(value || "").replace(/[^0-9]/g, "");
}

function numberOnly(value: any) {
  return Number(String(value || "").replace(/\D/g, "")) || 0;
}

const CITIES = ["Douala", "Yaoundé", "Kribi", "Limbé", "Buea", "Bafoussam", "Bamenda", "Garoua", "Maroua"];
const TYPES = ["Maison", "Appartement", "Terrain", "Immeuble", "Bureau", "Boutique"];
const PURPOSES = ["Vente", "Location"];

export default function Index() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedAnnonce, setSelectedAnnonce] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [annonces, setAnnonces] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [purpose, setPurpose] = useState("Vente");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("Douala");
  const [quartier, setQuartier] = useState("");
  const [type, setType] = useState("Maison");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const chargerAnnonces = async () => {
  try {
    const snapshot = await getDocs(collection(db, "annonces"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAnnonces(data);
  } catch (error) {
    console.log("Erreur chargement :", error);
  }
};

useEffect(() => {
  chargerAnnonces();
}, []);

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [surface, setSurface] = useState("");
  const [landSurface, setLandSurface] = useState("");
  const [mapAddress, setMapAddress] = useState("");

  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterQuartier, setFilterQuartier] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterMinBedrooms, setFilterMinBedrooms] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const q = query(
  collection(db, "annonces"),
  where("status", "==", "approved"),
  orderBy("boost", "desc"),
  orderBy("createdAt", "desc")
);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      list.sort((a: any, b: any) => {
        if (a.boost && !b.boost) return -1;
        if (!a.boost && b.boost) return 1;
        return 0;
      });
      setAnnonces(list);
    });
    if (selectedAnnonce) {
  const item = selectedAnnonce;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Pressable onPress={() => setSelectedAnnonce(null)}>
          <Text style={styles.viewDetail}>← Retour</Text>
        </Pressable>

        <Text style={styles.title}>{item.title || "Sans titre"}</Text>
        <Text style={styles.propertyPrice}>{formatFCFA(item.price)} FCFA</Text>
        <Text style={styles.location}>{item.city} - {item.quartier}</Text>

        <Text style={styles.specLine}>
          🛏 {item.bedrooms || "-"} • 🛁 {item.bathrooms || "-"} • {item.surface || "-"} m²
        </Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text>{item.description || "Aucune description"}</Text>

        <Text style={styles.sectionTitle}>Contact</Text>
        <Text>Vendeur : {item.sellerName || "Non renseigné"}</Text>
        <Text>Téléphone : {item.sellerPhone || "Non renseigné"}</Text>
      </View>
    </ScrollView>
  );
}
    return unsubscribe;
  }, [isLoggedIn]);

  const filteredAnnonces = useMemo(() => {
    return annonces.filter((item) => {
      const itemPrice = numberOnly(item.price);
      const minPrice = numberOnly(filterMinPrice);
      const maxPrice = numberOnly(filterMaxPrice);
      const itemBedrooms = numberOnly(item.bedrooms);
      const minBedrooms = numberOnly(filterMinBedrooms);

      if (showFavoritesOnly && !favorites.includes(item.id)) return false;
      if (filterPurpose && item.purpose !== filterPurpose) return false;
      if (filterCity && !String(item.city || "").toLowerCase().includes(filterCity.toLowerCase())) return false;
      if (filterQuartier && !String(item.quartier || "").toLowerCase().includes(filterQuartier.toLowerCase())) return false;
      if (filterType && item.type !== filterType) return false;
      if (minPrice && itemPrice < minPrice) return false;
      if (maxPrice && itemPrice > maxPrice) return false;
      if (minBedrooms && itemBedrooms < minBedrooms) return false;
      return true;
    });
  }, [annonces, favorites, filterPurpose, filterCity, filterQuartier, filterType, filterMinPrice, filterMaxPrice, filterMinBedrooms, showFavoritesOnly]);

if (selectedAnnonce) {
  const item = selectedAnnonce;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Pressable onPress={() => setSelectedAnnonce(null)}>
          <Text style={styles.viewDetail}>← Retour</Text>
        </Pressable>

        <Text style={styles.title}>{item.title || "Sans titre"}</Text>
        <Text style={styles.propertyPrice}>{formatFCFA(item.price)}</Text>
        <Text style={styles.location}>{item.city} - {item.quartier}</Text>

        <Text style={styles.specLine}>
          🛏 {item.bedrooms || "-"} • 🛁 {item.bathrooms || "-"} • {item.surface || "-"} m²
        </Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text>{item.description || "Aucune description"}</Text>

        <Text style={styles.sectionTitle}>Contact</Text>
        <Text>Vendeur : {item.sellerName || "Non renseigné"}</Text>
        <Text>Téléphone : {item.sellerPhone || "Non renseigné"}</Text>
      </View>
    </ScrollView>
  );
}
  async function register() {
    if (!name || !phone || !email || !password) {
      alert("Remplis tous les champs");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      alert("Compte créé avec succès");
      setIsRegister(false);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function login() {
    if (!email || !password) {
      alert("Remplis email et mot de passe");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setIsLoggedIn(true);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function logout() {
    await signOut(auth);
    setIsLoggedIn(false);
    setSelectedAnnonce(null);
  }

  async function pickImages() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission refusée pour accéder aux images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.75,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  }

  async function uploadImages(imageUris: string[]) {
    const urls: string[] = [];
    for (const uri of imageUris) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `annonces/${Date.now()}-${Math.random()}.jpg`;
      const imageRef = ref(storage, fileName);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }
    return urls;
  }

  async function publierAnnonce() {
  alert("Bouton publier cliqué");

  if (!purpose || !title || !city || !quartier || !type || !price || !description) {
    alert("Remplis les champs obligatoires : vente/location, titre, ville, quartier, type, prix et description.");
    return;
  }

    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(images);
      }

      await addDoc(collection(db, "annonces"), {
        purpose,
        title: title.trim(),
        city: city.trim(),
        quartier: quartier.trim(),
        type,
        price: price.trim(),
        description: description.trim(),
        sellerName: sellerName.trim() || auth.currentUser?.email || "Vendeur",
        sellerPhone: sellerPhone.trim() || "",
        bedrooms: bedrooms.trim() || "",
        bathrooms: bathrooms.trim() || "",
        surface: surface.trim() || "",
        landSurface: landSurface.trim() || "",
        mapAddress: mapAddress.trim() || `${city} ${quartier} Cameroun`,
        images: imageUrls,
        verified: false,
        boost: false,
        ownerEmail: auth.currentUser?.email || "",
        createdAt: serverTimestamp(),
      });

      alert("Annonce publiée avec succès 🔥");
      setPurpose("Vente");
      setTitle("");
      setCity("Douala");
      setQuartier("");
      setType("Maison");
      setPrice("");
      setDescription("");
      setSellerName("");
      setSellerPhone("");
      setBedrooms("");
      setBathrooms("");
      setSurface("");
      setLandSurface("");
      setMapAddress("");
      setImages([]);
      setActiveTab("search");
    } catch (error: any) {
      alert("Erreur publication : " + error.message);
    }
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function openWhatsApp(item: any, visit = false) {
    const cleaned = cleanPhone(item.sellerPhone);
    if (!cleaned) {
      alert("Contact via message interne bientôt disponible");
      return;
    }
    const message = visit
      ? `Bonjour, je souhaite planifier une visite pour : ${item.title} à ${item.city} - ${item.quartier}, prix ${formatFCFA(item.price)}.`
      : `Bonjour, je suis intéressé par votre annonce : ${item.title} à ${item.city} - ${item.quartier}, prix ${formatFCFA(item.price)}.`;
    Linking.openURL(`https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`);
  }

  function callSeller(item: any) {
    const cleaned = cleanPhone(item.sellerPhone);
    if (!cleaned) {
      alert("Numéro vendeur non renseigné");
      return;
    }
    Linking.openURL(`tel:${cleaned}`);
  }

  function openMap(item: any) {
    const address = item.mapAddress || `${item.city} ${item.quartier} Cameroun`;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
  }

if (!isLoggedIn) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#062E21", "#0B3D2E", "#145A32"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 60,
          paddingBottom: 30,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 18 }}>
          <View style={{ width: 40, height: 6, backgroundColor: "#00843D", borderRadius: 10 }} />
          <View style={{ width: 40, height: 6, backgroundColor: "#CE1126", borderRadius: 10 }} />
          <View style={{ width: 40, height: 6, backgroundColor: "#FCD116", borderRadius: 10 }} />
        </View>

        <Text style={{ color: "#FCD116", fontSize: 34, fontWeight: "900", letterSpacing: 1.5 }}>
          EMPIRE
        </Text>

        <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", letterSpacing: 6 }}>
          CAMER IMMO
        </Text>

        <Text style={{ color: "#E8F5EE", fontSize: 14, marginTop: 10, lineHeight: 20 }}>
          Ici on est au BOA, on vend, on achète, on loue — local by Empire Immo 🇨🇲
        </Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.title}>{isRegister ? "Créer un compte" : "Connexion"}</Text>

        {isRegister && (
          <>
            <TextInput style={styles.input} placeholder="Nom complet" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Téléphone" value={phone} onChangeText={setPhone} />
          </>
        )}

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />

        <Pressable style={styles.primaryButton} onPress={isRegister ? register : login}>
          <Text style={styles.primaryButtonText}>
            {isRegister ? "Créer mon compte" : "Se connecter"}
          </Text>
        </Pressable>

        <Pressable onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.switchText}>
            {isRegister ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? Créer un compte"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

  <Pressable onPress={() => setIsRegister(!isRegister)}>
    <Text style={{ textAlign: "center", marginTop: 10, color: "#666" }}>
      {isRegister
        ? "Déjà un compte ? Se connecter"
        : "Pas encore de compte ? Créer un compte"}
    </Text>
  </Pressable>
  
if (selectedAnnonce) {
  const item = selectedAnnonce;

  return (
    <View style={styles.container}>
        <View style={styles.headerSmall}>
          <Text style={styles.logoSmall}>EMPIRE CAMER IMMO</Text>
          <Text style={styles.slogan}>Détail du bien</Text>
        </View>
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.rowBetween}>
              <Pressable style={styles.backButton} onPress={() => setSelectedAnnonce(null)}><Text style={styles.backButtonText}>← Retour</Text></Pressable>
              <Pressable style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}><Text style={styles.favoriteText}>{favorites.includes(item.id) ? "❤️ Favori" : "🤍 Favori"}</Text></Pressable>
            </View>

            {item.images?.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                {item.images.map((img: string, index: number) => (
                  <View key={index} style={styles.galleryItem}>
                    <Image source={{ uri: img }} style={styles.detailImage} />
                    <Text style={styles.photoBadge}>Photo {index + 1}/{item.images.length}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.placeholderLarge}><Text style={styles.placeholderIcon}>🏠</Text></View>
            )}

            <View style={styles.badgeRow}>
              <Text style={styles.purposeBadge}>{item.purpose}</Text>
              {item.verified && <Text style={styles.verifiedBadge}>Vérifié</Text>}
              {item.boost && <Text style={styles.boostBadge}>Boost</Text>}
            </View>

            <Text style={styles.detailTitle}>{item.title}</Text>
            <Text style={styles.detailPrice}>{formatFCFA(item.price)}</Text>
            <Text style={styles.location}>📍 {item.city} - {item.quartier}</Text>
            <Text style={styles.typeText}>{item.type}</Text>

            <View style={styles.specGrid}>
              <View style={styles.specBox}><Text style={styles.specValue}>{item.bedrooms || "-"}</Text><Text style={styles.specLabel}>Chambres</Text></View>
              <View style={styles.specBox}><Text style={styles.specValue}>{item.bathrooms || "-"}</Text><Text style={styles.specLabel}>Salles de bain</Text></View>
              <View style={styles.specBox}><Text style={styles.specValue}>{item.surface || "-"} m²</Text><Text style={styles.specLabel}>Habitation</Text></View>
              <View style={styles.specBox}><Text style={styles.specValue}>{item.landSurface || "-"} m²</Text><Text style={styles.specLabel}>Terrain</Text></View>
            </View>

            <Pressable style={styles.mapButton} onPress={() => openMap(item)}><Text style={styles.mapButtonText}>🗺️ Voir sur Google Maps</Text></Pressable>

            <View style={styles.infoBox}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>

            <View style={styles.securityBox}>
              <Text style={styles.securityTitle}>⚠️ Sécurité</Text>
              <Text style={styles.securityText}>EMPIRE CAMER IMMO est une plateforme de visibilité. Vérifiez toujours les documents et le bien physiquement avant tout paiement.</Text>
            </View>

            <View style={styles.contactBox}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <Text style={styles.contactText}>Vendeur : {item.sellerName || "Non renseigné"}</Text>
              {hasPhone ? (
                <>
                  <View style={styles.contactRow}>
                    <Pressable style={styles.callButton} onPress={() => callSeller(item)}><Text style={styles.contactButtonText}>📞 Appeler</Text></Pressable>
                    <Pressable style={styles.whatsappButton} onPress={() => openWhatsApp(item)}><Text style={styles.contactButtonText}>💬 WhatsApp</Text></Pressable>
                  </View>
                  <Pressable style={styles.visitButton} onPress={() => openWhatsApp(item, true)}><Text style={styles.contactButtonText}>📅 Planifier une visite</Text></Pressable>
                </>
              ) : (
                <View style={styles.internalBox}>
                  <Text style={styles.internalTitle}>Contact via message interne</Text>
                  <Text style={styles.internalText}>Le vendeur n’a pas ajouté de numéro. La messagerie interne sera ajoutée dans la prochaine étape.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSmall}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.logoSmall}>EMPIRE CAMER IMMO</Text>
            <Text style={styles.slogan}>Ici on est au BOA, on vend, on achète, on loue — local by Empire Immo 🇨🇲</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={logout}><Text style={styles.logoutText}>Quitter</Text></Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, activeTab === "search" && styles.tabActive]} onPress={() => setActiveTab("search")}><Text style={[styles.tabText, activeTab === "search" && styles.tabTextActive]}>Rechercher</Text></Pressable>
          <Pressable style={[styles.tab, activeTab === "publish" && styles.tabActive]} onPress={() => setActiveTab("publish")}><Text style={[styles.tabText, activeTab === "publish" && styles.tabTextActive]}>Publier</Text></Pressable>
        </View>

        {activeTab === "publish" ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Publier un bien</Text>
            <View style={styles.segmentRow}>{PURPOSES.map((p) => <Pressable key={p} style={[styles.segment, purpose === p && styles.segmentActive]} onPress={() => setPurpose(p)}><Text style={[styles.segmentText, purpose === p && styles.segmentTextActive]}>{p}</Text></Pressable>)}</View>

            <TextInput style={styles.input} placeholder="Titre de l’annonce" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Ville" value={city} onChangeText={setCity} />
            <TextInput style={styles.input} placeholder="Quartier" value={quartier} onChangeText={setQuartier} />
            <TextInput style={styles.input} placeholder="Type : Maison, Appartement, Terrain..." value={type} onChangeText={setType} />
            <TextInput style={styles.input} placeholder="Prix en FCFA" keyboardType="numeric" value={price} onChangeText={setPrice} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Description" multiline value={description} onChangeText={setDescription} />

            <Text style={styles.miniTitle}>Détails optionnels</Text>
            <View style={styles.inputGrid}>
              <TextInput style={[styles.input, styles.half]} placeholder="Chambres" keyboardType="numeric" value={bedrooms} onChangeText={setBedrooms} />
              <TextInput style={[styles.input, styles.half]} placeholder="Salles de bain" keyboardType="numeric" value={bathrooms} onChangeText={setBathrooms} />
              <TextInput style={[styles.input, styles.half]} placeholder="Habitation m²" keyboardType="numeric" value={surface} onChangeText={setSurface} />
              <TextInput style={[styles.input, styles.half]} placeholder="Terrain m²" keyboardType="numeric" value={landSurface} onChangeText={setLandSurface} />
            </View>

            <TextInput style={styles.input} placeholder="Nom vendeur ou agence (optionnel)" value={sellerName} onChangeText={setSellerName} />
            <TextInput style={styles.input} placeholder="Téléphone WhatsApp (optionnel)" keyboardType="phone-pad" value={sellerPhone} onChangeText={setSellerPhone} />
            <TextInput style={styles.input} placeholder="Adresse Google Maps (optionnel)" value={mapAddress} onChangeText={setMapAddress} />

            <Pressable style={styles.imageButton} onPress={pickImages}><Text style={styles.imageButtonText}>{images.length ? `Images sélectionnées (${images.length})` : "Ajouter plusieurs images"}</Text></Pressable>
            {images.length > 0 && <ScrollView horizontal style={styles.previewGallery}>{images.map((img, i) => <Image key={i} source={{ uri: img }} style={styles.previewImage} />)}</ScrollView>}

            <Pressable style={styles.primaryButton} onPress={publierAnnonce}><Text style={styles.primaryButtonText}>Publier l’annonce</Text></Pressable>
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Trouver un bien</Text>
            <View style={styles.segmentRow}><Pressable style={[styles.segment, filterPurpose === "Vente" && styles.segmentActive]} onPress={() => setFilterPurpose(filterPurpose === "Vente" ? "" : "Vente")}><Text style={[styles.segmentText, filterPurpose === "Vente" && styles.segmentTextActive]}>Acheter</Text></Pressable><Pressable style={[styles.segment, filterPurpose === "Location" && styles.segmentActive]} onPress={() => setFilterPurpose(filterPurpose === "Location" ? "" : "Location")}><Text style={[styles.segmentText, filterPurpose === "Location" && styles.segmentTextActive]}>Louer</Text></Pressable></View>
            <TextInput style={styles.input} placeholder="Ville" value={filterCity} onChangeText={setFilterCity} />
            <TextInput style={styles.input} placeholder="Quartier" value={filterQuartier} onChangeText={setFilterQuartier} />
            <TextInput style={styles.input} placeholder="Type" value={filterType} onChangeText={setFilterType} />
            <View style={styles.inputGrid}><TextInput style={[styles.input, styles.half]} placeholder="Prix min" keyboardType="numeric" value={filterMinPrice} onChangeText={setFilterMinPrice} /><TextInput style={[styles.input, styles.half]} placeholder="Prix max" keyboardType="numeric" value={filterMaxPrice} onChangeText={setFilterMaxPrice} /><TextInput style={[styles.input, styles.half]} placeholder="Chambres min" keyboardType="numeric" value={filterMinBedrooms} onChangeText={setFilterMinBedrooms} /></View>
            <Pressable style={showFavoritesOnly ? styles.favoriteFilterActive : styles.favoriteFilter} onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}><Text style={showFavoritesOnly ? styles.favoriteFilterTextActive : styles.favoriteFilterText}>{showFavoritesOnly ? "❤️ Favoris seulement" : "🤍 Afficher mes favoris"}</Text></Pressable>

            <Text style={styles.sectionTitle}>Résultats ({filteredAnnonces.length})</Text>
            {filteredAnnonces.map((item) => (
              <Pressable
  key={item.id}
  onPress={() => setSelectedAnnonce(item)}
  style={[styles.propertyCard, item.boost ? { borderColor: "orange", borderWidth: 2 } : null]}
>
                {item.boost && ( <Text style={{ color: "orange", fontWeight: "bold", marginBottom: 5}}>🔥 BOOSTÉ</Text>)}
                {item.images?.length ? <Image source={{ uri: item.images[0] }} style={styles.propertyImage} /> : <View style={styles.propertyImageFake}><Text style={styles.placeholderIcon}>🏠</Text></View>}
                <View style={{ flex: 1 }}>
                  <View style={styles.rowBetween}><Text style={styles.propertyTitle}>{item.title}</Text><Pressable onPress={() => toggleFavorite(item.id)}><Text style={styles.heart}>{favorites.includes(item.id) ? "❤️" : "🤍"}</Text></Pressable></View>
                  <View style={styles.badgeRow}><Text style={styles.purposeBadge}>{item.purpose}</Text>{item.boost && <Text style={styles.boostBadge}>Boost</Text>}</View>
                  <Text style={styles.propertyPrice}>{formatFCFA(item.price)}</Text>
                  <Text style={styles.location}>{item.city} - {item.quartier}</Text>
                  <Text style={styles.specLine}>🛏️ {item.bedrooms || "-"} • 🛁 {item.bathrooms || "-"} • {item.surface || "-"} m²</Text>
                  <Text style={styles.viewDetail}>Voir détails →</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
    );
    }//</View>
    
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06251A" },

  hero: { paddingTop: 80, paddingHorizontal: 28, paddingBottom: 70 },

  headerSmall: { paddingTop: 48, paddingHorizontal: 22, paddingBottom: 24 },

  flag: {
    flexDirection: "row",
    width: 92,
    height: 7,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 28,
  },
  green: { flex: 1, backgroundColor: "#00843D" },
  red: { flex: 1, backgroundColor: "#CE1126" },
  yellow: { flex: 1, backgroundColor: "#FCD116" },

  logo: { color: "#FCD116", fontSize: 48, fontWeight: "900" },
  logoSmall: { color: "#FCD116", fontSize: 24, fontWeight: "900" },
  subLogo: { color: "white", fontSize: 22, fontWeight: "900", letterSpacing: 6 },
  slogan: { color: "rgba(255,255,255,0.85)", marginTop: 8 },
  card: { flex: 1, backgroundColor: "white", borderTopLeftRadius: 34, borderTopRightRadius: 34, padding: 22 },
  title: { fontSize: 30, fontWeight: "900", color: "#06251A", marginBottom: 18 },
  miniTitle: { fontSize: 18, fontWeight: "900", color: "#06251A", marginBottom: 10 },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: "#06251A", marginVertical: 18 },
  input: { backgroundColor: "#F4F2EE", borderRadius: 16, padding: 16, fontSize: 16, marginBottom: 12 },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  inputGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  half: { flex: 1, minWidth: 140 },
  primaryButton: { backgroundColor: "#00843D", padding: 18, borderRadius: 16, alignItems: "center", marginTop: 10 },
  primaryButtonText: { color: "white", fontWeight: "900", fontSize: 17 },
  switchText: { textAlign: "center", color: "#00843D", fontWeight: "900", marginTop: 22 },
  tabs: { flexDirection: "row", backgroundColor: "#F4F2EE", borderRadius: 18, padding: 5, marginBottom: 20 },
  tab: { flex: 1, padding: 14, borderRadius: 14, alignItems: "center" },
  tabActive: { backgroundColor: "#00843D" },
  tabText: { fontWeight: "900", color: "#06251A" },
  tabTextActive: { color: "white" },
  segmentRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  segment: { backgroundColor: "#F4F2EE", paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14 },
  segmentActive: { backgroundColor: "#CE1126" },
  segmentText: { color: "#06251A", fontWeight: "900" },
  segmentTextActive: { color: "white" },
  imageButton: { backgroundColor: "#FCD116", padding: 15, borderRadius: 14, alignItems: "center", marginBottom: 12 },
  imageButtonText: { color: "#06251A", fontWeight: "900" },
  previewGallery: { marginBottom: 12 },
  previewImage: { width: 145, height: 105, borderRadius: 14, marginRight: 10 },
  propertyCard: { flexDirection: "row", gap: 14, backgroundColor: "#F4F2EE", padding: 13, borderRadius: 22, marginBottom: 14 },
  propertyImage: { width: 110, height: 110, borderRadius: 18, backgroundColor: "#06251A" },
  propertyImageFake: { width: 110, height: 110, borderRadius: 18, backgroundColor: "#06251A", alignItems: "center", justifyContent: "center" },
  placeholderIcon: { fontSize: 42 },
  propertyTitle: { flex: 1, fontSize: 17, fontWeight: "900", color: "#06251A" },
  propertyPrice: { color: "#CE1126", fontSize: 17, fontWeight: "900", marginTop: 5 },
  location: { color: "#6F7772", marginTop: 5 },
  specLine: { color: "#06251A", fontWeight: "700", fontSize: 12, marginTop: 5 },
  viewDetail: { color: "#00843D", fontWeight: "900", marginTop: 7 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  heart: { fontSize: 22 },
  badgeRow: { flexDirection: "row", gap: 7, flexWrap: "wrap", marginTop: 5 },
  purposeBadge: { backgroundColor: "#00843D", color: "white", fontWeight: "900", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9, fontSize: 11 },
  boostBadge: { backgroundColor: "#FCD116", color: "#06251A", fontWeight: "900", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9, fontSize: 11 },
  verifiedBadge: { backgroundColor: "#E8F8EF", color: "#00843D", fontWeight: "900", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9, fontSize: 11 },
  favoriteFilter: { backgroundColor: "#F4F2EE", padding: 14, borderRadius: 14, alignItems: "center" },
  favoriteFilterActive: { backgroundColor: "#CE1126", padding: 14, borderRadius: 14, alignItems: "center" },
  favoriteFilterText: { color: "#06251A", fontWeight: "900" },
  favoriteFilterTextActive: { color: "white", fontWeight: "900" },
  logoutButton: { backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12 },
  logoutText: { color: "white", fontWeight: "900" },
  backButton: { backgroundColor: "#F4F2EE", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 15 },
  backButtonText: { fontWeight: "900", color: "#06251A" },
  favoriteButton: { backgroundColor: "#F4F2EE", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 15 },
  favoriteText: { fontWeight: "900", color: "#06251A" },
  gallery: { marginBottom: 18 },
  galleryItem: { marginRight: 12, position: "relative" },
  detailImage: { width: 290, height: 220, borderRadius: 24, backgroundColor: "#06251A" },
  photoBadge: { position: "absolute", bottom: 10, right: 10, backgroundColor: "rgba(0,0,0,0.65)", color: "white", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, fontWeight: "900", fontSize: 12 },
  placeholderLarge: { height: 220, borderRadius: 24, backgroundColor: "#06251A", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  detailTitle: { color: "#06251A", fontSize: 30, fontWeight: "900", marginTop: 8 },
  detailPrice: { color: "#CE1126", fontSize: 26, fontWeight: "900", marginTop: 8 },
  typeText: { color: "#00843D", fontWeight: "900", marginTop: 6, marginBottom: 14 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 16 },
  specBox: { width: "48%", backgroundColor: "#F4F2EE", padding: 13, borderRadius: 14, marginBottom: 10 },
  specValue: { color: "#06251A", fontWeight: "900", fontSize: 17 },
  specLabel: { color: "#6F7772", fontWeight: "700", fontSize: 12, marginTop: 4 },
  mapButton: { backgroundColor: "#06251A", padding: 16, borderRadius: 16, alignItems: "center", marginBottom: 16 },
  mapButtonText: { color: "white", fontWeight: "900" },
  infoBox: { backgroundColor: "#F4F2EE", padding: 16, borderRadius: 18, marginBottom: 14 },
  descriptionText: { color: "#333", lineHeight: 21 },
  securityBox: { backgroundColor: "#FFF7DB", padding: 16, borderRadius: 18, marginBottom: 14 },
  securityTitle: { color: "#CE1126", fontWeight: "900", fontSize: 18, marginBottom: 6 },
  securityText: { color: "#332", lineHeight: 21 },
  contactBox: { backgroundColor: "#F0F8F3", padding: 16, borderRadius: 18, marginBottom: 30 },
  contactText: { color: "#06251A", fontWeight: "700", marginBottom: 10 },
  contactRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  callButton: { flex: 1, backgroundColor: "#00843D", padding: 15, borderRadius: 14, alignItems: "center" },
  whatsappButton: { flex: 1, backgroundColor: "#25D366", padding: 15, borderRadius: 14, alignItems: "center" },
  visitButton: { backgroundColor: "#CE1126", padding: 15, borderRadius: 14, alignItems: "center", marginTop: 10 },
  contactButtonText: { color: "white", fontWeight: "900" },
  internalBox: { backgroundColor: "#F4F2EE", borderRadius: 14, padding: 14, marginTop: 10 },
  internalTitle: { color: "#06251A", fontWeight: "900", marginBottom: 6 },
  internalText: { color: "#333", lineHeight: 20 
  },
 });