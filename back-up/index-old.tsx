import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
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

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

const TYPES = ["Maison", "Appartement", "Terrain", "Immeuble", "Bureau", "Boutique"];
const PURPOSES = ["Vente", "Location"];
const CATEGORIES = ["Acheter", "Louer", "Neuf", "Terrain"];

const HERO_IMAGE = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop";

const BOOST_PACKS = [
  { id: "boost_3j", label: "Boost 3 jours", days: 3, price: 2000 },
  { id: "boost_7j", label: "Boost 7 jours", days: 7, price: 3000 },
  { id: "boost_14j", label: "Boost 14 jours", days: 14, price: 5000 },
  { id: "boost_30j", label: "Boost 1 mois", days: 30, price: 10000 },
];

const AGENCY_PACK = {
  id: "agency_monthly",
  label: "Abonnement agence 1 mois",
  days: 30,
  price: 25000,
};

const MOMO_NUMBER = "237600000000";
const ORANGE_NUMBER = "237690000000";

const DEMO_ANNONCES = [
  {
    id: "demo_1",
    title: "Villa moderne avec piscine",
    city: "Douala",
    quartier: "Bonapriso",
    type: "Maison",
    purpose: "Vente",
    price: "250000000",
    bedrooms: "4",
    bathrooms: "3",
    surface: "320",
    landSurface: "500",
    description: "Villa premium située dans un quartier résidentiel calme, proche des commerces et axes principaux.",
    sellerName: "Empire Immo",
    sellerPhone: MOMO_NUMBER,
    images: [],
    verified: true,
    boost: true,
    status: "approved",
  },
  {
    id: "demo_2",
    title: "Appartement haut standing",
    city: "Yaoundé",
    quartier: "Bastos",
    type: "Appartement",
    purpose: "Location",
    price: "650000",
    bedrooms: "3",
    bathrooms: "2",
    surface: "145",
    landSurface: "",
    description: "Appartement lumineux, sécurisé, idéal pour famille ou expatrié.",
    sellerName: "Agence partenaire",
    sellerPhone: ORANGE_NUMBER,
    images: [],
    verified: true,
    boost: true,
    status: "approved",
  },
  {
    id: "demo_3",
    title: "Terrain titré proche route",
    city: "Kribi",
    quartier: "Grand Batanga",
    type: "Terrain",
    purpose: "Vente",
    price: "18000000",
    bedrooms: "",
    bathrooms: "",
    surface: "",
    landSurface: "600",
    description: "Terrain bien placé, idéal projet résidence ou investissement.",
    sellerName: "Propriétaire",
    sellerPhone: MOMO_NUMBER,
    images: [],
    verified: false,
    boost: false,
    status: "approved",
  },
];

type UserProfile = {
  uid: string;
  name: string;
  phone: string;
  email: string;
  role: "user" | "admin" | "agency";
  agencyUntil?: string;
};

export default function Index() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [activeTab, setActiveTab] = useState("home");
  const [selectedAnnonce, setSelectedAnnonce] = useState<any | null>(null);
  const [selectedBoostAnnonce, setSelectedBoostAnnonce] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [annonces, setAnnonces] = useState<any[]>([]);
  const [adminAnnonces, setAdminAnnonces] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
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
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [surface, setSurface] = useState("");
  const [landSurface, setLandSurface] = useState("");
  const [mapAddress, setMapAddress] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterQuartier, setFilterQuartier] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterMinBedrooms, setFilterMinBedrooms] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("MTN MoMo");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [selectedPackId, setSelectedPackId] = useState("boost_3j");
  const [selectedChatAnnonce, setSelectedChatAnnonce] = useState<any | null>(null);
  const [chatText, setChatText] = useState("");
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [aiSearchSuggestion, setAiSearchSuggestion] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const heroScaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(heroScaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  const isAdmin = profile?.role === "admin";
  const isAgency = profile?.role === "agency" || !!profile?.agencyUntil;
  const displayAnnonces = annonces.length > 0 ? annonces : DEMO_ANNONCES;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile({ uid: user.uid, ...(userSnap.data() as any) });
        } else {
          const newProfile = {
            uid: user.uid,
            name: user.email || "Utilisateur",
            phone: "",
            email: user.email || "",
            role: "user" as const,
            createdAt: serverTimestamp(),
          };
          await setDoc(userRef, newProfile);
          setProfile(newProfile as any);
        }
      } else {
        setProfile(null);
      }

      setLoadingAuth(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setAnnonces([]);
      return;
    }

    const q = query(
      collection(db, "annonces"),
      where("status", "==", "approved"),
      orderBy("boost", "desc"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
      setAnnonces(list);
    });

    return unsubscribe;
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      setAdminAnnonces([]);
      setPayments([]);
      return;
    }

    const annoncesQuery = query(collection(db, "annonces"), orderBy("createdAt", "desc"));
    const paymentsQuery = query(collection(db, "payments"), orderBy("createdAt", "desc"));
    const leadsQuery = query(collection(db, "leads"), orderBy("createdAt", "desc"));

    const unsubscribeAnnonces = onSnapshot(annoncesQuery, (snapshot) => {
      setAdminAnnonces(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    });

    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
      setPayments(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    });

    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      setLeads(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    });

    return () => {
      unsubscribeAnnonces();
      unsubscribePayments();
      unsubscribeLeads();
    };
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    if (!isLoggedIn || !auth.currentUser) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(db, "messages"),
      where("participants", "array-contains", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    });

    return unsubscribeMessages;
  }, [isLoggedIn]);

  const filteredAnnonces = useMemo(() => {
    return displayAnnonces.filter((item) => {
      const text = `${item.title || ""} ${item.city || ""} ${item.quartier || ""} ${item.type || ""}`.toLowerCase();
      const itemPrice = numberOnly(item.price);
      const minPrice = numberOnly(filterMinPrice);
      const maxPrice = numberOnly(filterMaxPrice);
      const itemBedrooms = numberOnly(item.bedrooms);
      const minBedrooms = numberOnly(filterMinBedrooms);

      if (searchText && !text.includes(searchText.toLowerCase())) return false;
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
  }, [displayAnnonces, favorites, searchText, filterPurpose, filterCity, filterQuartier, filterType, filterMinPrice, filterMaxPrice, filterMinBedrooms, showFavoritesOnly]);

  const popularAnnonces = useMemo(() => displayAnnonces.filter((item) => item.boost).slice(0, 8), [displayAnnonces]);
  const recentAnnonces = useMemo(() => displayAnnonces.slice(0, 12), [displayAnnonces]);
  const approvedPayments = useMemo(() => payments.filter((payment) => payment.status === "approved"), [payments]);
  const pendingPayments = useMemo(() => payments.filter((payment) => payment.status === "pending"), [payments]);
  const totalRevenue = useMemo(() => approvedPayments.reduce((sum, payment) => sum + numberOnly(payment.amount), 0), [approvedPayments]);
  const activeBoosts = useMemo(() => adminAnnonces.filter((item) => item.boost).length, [adminAnnonces]);
  const pendingAnnonces = useMemo(() => adminAnnonces.filter((item) => item.status === "pending").length, [adminAnnonces]);
  const myAnnonces = useMemo(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    return displayAnnonces.filter((item) => item.ownerId === uid || item.ownerEmail === auth.currentUser?.email);
  }, [displayAnnonces]);
  const myLeads = useMemo(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    return leads.filter((lead) => lead.ownerId === uid || lead.ownerEmail === auth.currentUser?.email);
  }, [leads]);

  async function register() {
    if (!name || !phone || !email || !password) {
      alert("Remplis tous les champs");
      return;
    }

    try {
      setLoadingAction(true);
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

      await setDoc(doc(db, "users", credential.user.uid), {
        name: name.trim(),
        phone: cleanPhone(phone),
        email: email.trim().toLowerCase(),
        role: "user",
        createdAt: serverTimestamp(),
      });

      alert("Compte créé avec succès");
      setIsRegister(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function login() {
    if (!email || !password) {
      alert("Remplis email et mot de passe");
      return;
    }

    try {
      setLoadingAction(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function logout() {
    await signOut(auth);
    setSelectedAnnonce(null);
    setSelectedBoostAnnonce(null);
    setActiveTab("home");
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
      const fileName = `annonces/${auth.currentUser?.uid || "unknown"}/${Date.now()}-${Math.random()}.jpg`;
      const imageRef = ref(storage, fileName);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }

    return urls;
  }

  async function publierAnnonce() {
    if (!auth.currentUser) {
      alert("Connecte-toi avant de publier une annonce");
      return;
    }

    if (!purpose || !title || !city || !quartier || !type || !price || !description) {
      alert("Remplis les champs obligatoires : vente/location, titre, ville, quartier, type, prix et description.");
      return;
    }

    try {
      setLoadingAction(true);
      const imageUrls = images.length > 0 ? await uploadImages(images) : [];

      const shouldAutoApprove = isAgency || isAdmin;

      await addDoc(collection(db, "annonces"), {
        purpose,
        title: title.trim(),
        city: city.trim(),
        quartier: quartier.trim(),
        type,
        price: price.trim(),
        description: description.trim(),
        sellerName: sellerName.trim() || profile?.name || auth.currentUser.email || "Vendeur",
        sellerPhone: cleanPhone(sellerPhone || profile?.phone || ""),
        bedrooms: bedrooms.trim(),
        bathrooms: bathrooms.trim(),
        surface: surface.trim(),
        landSurface: landSurface.trim(),
        mapAddress: mapAddress.trim() || `${city} ${quartier} Cameroun`,
        images: imageUrls,
        status: shouldAutoApprove ? "approved" : "pending",
        verified: shouldAutoApprove,
        boost: false,
        boostUntil: null,
        ownerId: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert(shouldAutoApprove ? "Annonce publiée avec succès." : "Annonce envoyée. Elle sera visible après validation admin.");
      resetPublishForm();
      setActiveTab("home");
    } catch (error: any) {
      alert("Erreur publication : " + error.message);
    } finally {
      setLoadingAction(false);
    }
  }

  function resetPublishForm() {
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
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function createNotificationEvent(item: any, type: "lead" | "payment" | "boost", message: string) {
    try {
      await addDoc(collection(db, "notifications"), {
        type,
        title: item.title || "Annonce",
        message,
        annonceId: item.id,
        ownerId: item.ownerId || "demo",
        ownerEmail: item.ownerEmail || "",
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log("Erreur notification :", error);
    }
  }

  async function savePushTokenIfNeeded() {
    // À connecter avec expo-notifications quand tu actives les vraies notifications push.
    // Ici on garde déjà la structure Firestore prête : collection notifications + ownerId.
    return true;
  }

  async function trackLead(item: any, source: "call" | "whatsapp" | "message" | "visit") {
    try {
      await addDoc(collection(db, "leads"), {
        annonceId: item.id,
        annonceTitle: item.title || "Annonce",
        ownerId: item.ownerId || "demo",
        ownerEmail: item.ownerEmail || "",
        buyerId: auth.currentUser?.uid || "guest",
        buyerEmail: auth.currentUser?.email || "",
        buyerName: profile?.name || "Utilisateur",
        source,
        city: item.city || "",
        quartier: item.quartier || "",
        price: item.price || "",
        createdAt: serverTimestamp(),
      });

      await createNotificationEvent(
        item,
        "lead",
        `Nouveau lead ${source} sur votre annonce ${item.title || "immobilière"}`
      );
    } catch (error) {
      console.log("Erreur tracking lead :", error);
    }
  }

  async function callSeller(item: any) {
    const cleaned = cleanPhone(item.sellerPhone);
    if (!cleaned) return alert("Numéro vendeur non renseigné");
    await trackLead(item, "call");
    Linking.openURL(`tel:${cleaned}`);
  }

  async function openWhatsApp(item: any, visit = false) {
    const cleaned = cleanPhone(item.sellerPhone);
    if (!cleaned) return alert("Contact via message interne bientôt disponible");

    await trackLead(item, visit ? "visit" : "whatsapp");

    const message = visit
      ? `Bonjour, je viens de l'application Empire Camer Immo. Je souhaite planifier une visite pour : ${item.title} à ${item.city} - ${item.quartier}, prix ${formatFCFA(item.price)}.`
      : `Bonjour, je viens de l'application Empire Camer Immo. Je suis intéressé par votre annonce : ${item.title} à ${item.city} - ${item.quartier}, prix ${formatFCFA(item.price)}.`;

    Linking.openURL(`https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`);
  }

  function generateAiSuggestion(value: string) {
    const clean = value.toLowerCase().trim();

    if (!clean) {
      setAiSearchSuggestion("");
      return;
    }

    if (clean.includes("pas cher") || clean.includes("budget")) {
      setFilterMaxPrice("50000000");
      setAiSearchSuggestion("IA : budget détecté, prix max appliqué automatiquement.");
    } else if (clean.includes("terrain")) {
      setFilterType("Terrain");
      setAiSearchSuggestion("IA : recherche orientée Terrain.");
    } else if (clean.includes("louer") || clean.includes("location")) {
      setFilterPurpose("Location");
      setAiSearchSuggestion("IA : mode Location activé.");
    } else if (clean.includes("acheter") || clean.includes("vente")) {
      setFilterPurpose("Vente");
      setAiSearchSuggestion("IA : mode Achat activé.");
    } else if (clean.includes("douala")) {
      setFilterCity("Douala");
      setAiSearchSuggestion("IA : ville Douala détectée.");
    } else if (clean.includes("yaound")) {
      setFilterCity("Yaoundé");
      setAiSearchSuggestion("IA : ville Yaoundé détectée.");
    } else {
      setAiSearchSuggestion("IA : recherche optimisée par titre, ville, quartier et type.");
    }
  }

  function handleSmartSearch(value: string) {
    setSearchText(value);
    generateAiSuggestion(value);
  }

  function openMap(item: any) {
    const address = item.mapAddress || `${item.city} ${item.quartier} Cameroun`;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
  }

  function setCategory(category: string) {
    setActiveTab("search");
    setFilterType("");

    if (category === "Acheter") setFilterPurpose("Vente");
    if (category === "Louer") setFilterPurpose("Location");
    if (category === "Terrain") {
      setFilterPurpose("");
      setFilterType("Terrain");
    }
    if (category === "Neuf") {
      setFilterPurpose("Vente");
      setSearchText("neuf");
    }
  }

  async function approveAnnonce(item: any) {
    try {
      await updateDoc(doc(db, "annonces", item.id), {
        status: "approved",
        verified: true,
        updatedAt: serverTimestamp(),
      });
      alert("Annonce validée");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function rejectAnnonce(item: any) {
    try {
      await updateDoc(doc(db, "annonces", item.id), {
        status: "rejected",
        updatedAt: serverTimestamp(),
      });
      alert("Annonce refusée");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function activateBoostFromAdmin(item: any, pack = BOOST_PACKS[1]) {
    try {
      await updateDoc(doc(db, "annonces", item.id), {
        boost: true,
        boostUntil: addDays(pack.days),
        updatedAt: serverTimestamp(),
      });
      alert(`Boost activé : ${pack.label}`);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function createBoostPaymentRequest() {
    if (!auth.currentUser || !selectedBoostAnnonce) return;

    const pack = BOOST_PACKS.find((item) => item.id === selectedPackId) || BOOST_PACKS[0];

    if (!paymentPhone || !paymentReference) {
      alert("Ajoute le numéro utilisé et la référence/ID transaction.");
      return;
    }

    try {
      setLoadingAction(true);
      await addDoc(collection(db, "payments"), {
        type: "boost",
        packId: pack.id,
        packLabel: pack.label,
        days: pack.days,
        amount: pack.price,
        method: paymentMethod,
        paymentPhone: cleanPhone(paymentPhone),
        reference: paymentReference.trim(),
        annonceId: selectedBoostAnnonce.id,
        annonceTitle: selectedBoostAnnonce.title || "Annonce",
        status: "pending",
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email || "",
        createdAt: serverTimestamp(),
      });

      await createNotificationEvent(selectedBoostAnnonce, "payment", `Nouvelle demande de paiement boost : ${pack.label}`);
      alert("Demande envoyée. Admin validera le boost après vérification du paiement.");
      setSelectedBoostAnnonce(null);
      setPaymentPhone("");
      setPaymentReference("");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function createAgencyPaymentRequest() {
    if (!auth.currentUser) return;

    if (!paymentPhone || !paymentReference) {
      alert("Ajoute le numéro utilisé et la référence/ID transaction.");
      return;
    }

    try {
      setLoadingAction(true);
      await addDoc(collection(db, "payments"), {
        type: "agency_subscription",
        packId: AGENCY_PACK.id,
        packLabel: AGENCY_PACK.label,
        days: AGENCY_PACK.days,
        amount: AGENCY_PACK.price,
        method: paymentMethod,
        paymentPhone: cleanPhone(paymentPhone),
        reference: paymentReference.trim(),
        status: "pending",
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email || "",
        createdAt: serverTimestamp(),
      });

      alert("Demande abonnement agence envoyée. Admin validera après paiement.");
      setPaymentPhone("");
      setPaymentReference("");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function approvePayment(payment: any) {
    try {
      const paymentRef = doc(db, "payments", payment.id);
      await updateDoc(paymentRef, {
        status: "approved",
        approvedAt: serverTimestamp(),
      });

      if (payment.type === "boost" && payment.annonceId) {
        await updateDoc(doc(db, "annonces", payment.annonceId), {
          boost: true,
          boostUntil: addDays(payment.days || 7),
          updatedAt: serverTimestamp(),
        });
      }

      if (payment.type === "agency_subscription" && payment.userId) {
        await updateDoc(doc(db, "users", payment.userId), {
          role: "agency",
          agencyUntil: addDays(payment.days || 30),
          updatedAt: serverTimestamp(),
        });
      }

      alert("Paiement validé et service activé");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function rejectPayment(payment: any) {
    try {
      await updateDoc(doc(db, "payments", payment.id), {
        status: "rejected",
        updatedAt: serverTimestamp(),
      });
      alert("Paiement refusé");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function sendInternalMessage() {
    if (!auth.currentUser || !selectedChatAnnonce) return;
    if (!chatText.trim()) return alert("Écris ton message");

    try {
      setLoadingAction(true);
      await addDoc(collection(db, "messages"), {
        annonceId: selectedChatAnnonce.id,
        annonceTitle: selectedChatAnnonce.title || "Annonce",
        fromUserId: auth.currentUser.uid,
        fromUserEmail: auth.currentUser.email || "",
        fromUserName: profile?.name || "Utilisateur",
        toUserId: selectedChatAnnonce.ownerId || "owner_demo",
        toUserEmail: selectedChatAnnonce.ownerEmail || "",
        participants: [auth.currentUser.uid, selectedChatAnnonce.ownerId || "owner_demo"],
        text: chatText.trim(),
        status: "sent",
        createdAt: serverTimestamp(),
      });
      await trackLead(selectedChatAnnonce, "message");
      alert("Message envoyé au vendeur");
      setChatText("");
      setSelectedChatAnnonce(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingAction(false);
    }
  }

  function renderPaymentInstructions(amount?: number) {
    return (
      <View style={styles.paymentInfoBox}>
        <Text style={styles.paymentTitle}>Paiement manuel sécurisé</Text>
        <Text style={styles.paymentText}>MTN MoMo : {MOMO_NUMBER}</Text>
        <Text style={styles.paymentText}>Orange Money : {ORANGE_NUMBER}</Text>
        {!!amount && <Text style={styles.paymentAmount}>Montant : {formatFCFA(amount)}</Text>}
        <Text style={styles.paymentHint}>Après paiement, ajoute ton numéro et la référence transaction. L’admin valide ensuite.</Text>
      </View>
    );
  }

  function renderPropertyCard(item: any, compact = false) {
    const cardImages = item.images?.length ? item.images : [];

    return (
      <Pressable
        key={item.id}
        onPress={() => setSelectedAnnonce(item)}
        style={[styles.airbnbCard, item.boost ? styles.airbnbBoostedCard : null, compact && styles.airbnbCompactCard]}
      >
        <View style={compact ? styles.airbnbImageSmallWrap : styles.airbnbImageWrap}>
          {cardImages.length ? (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.cardImageSwiper}>
              {cardImages.map((img: string, index: number) => (
                <Pressable key={index} onPress={() => setZoomImage(img)} style={compact ? styles.cardImageSlideSmall : styles.cardImageSlide}>
                  <Image source={{ uri: img }} style={styles.airbnbImage} />
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Pressable onPress={() => setSelectedAnnonce(item)} style={{ flex: 1 }}>
              <LinearGradient colors={["#06251A", "#0B3D2E"]} style={styles.airbnbImageFake}>
                <Text style={styles.placeholderIcon}>🏠</Text>
                <Text style={styles.fakeImageText}>Photo bientôt disponible</Text>
              </LinearGradient>
            </Pressable>
          )}

          <LinearGradient colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.68)"]} style={styles.airbnbImageOverlay} pointerEvents="none" />

          <View style={styles.airbnbTopRow} pointerEvents="box-none">
            <View style={styles.airbnbBadgeGlass}>
              <Text style={styles.airbnbBadgeText}>{item.boost ? "🔥 Boosté" : item.verified ? "✓ Vérifié" : item.purpose || "Bien"}</Text>
            </View>
            <Pressable style={styles.airbnbHeartGlass} onPress={() => toggleFavorite(item.id)}>
              <Text style={styles.heart}>{favorites.includes(item.id) ? "❤️" : "🤍"}</Text>
            </Pressable>
          </View>

          <View style={styles.airbnbImageBottom} pointerEvents="none">
            <Text style={styles.airbnbPrice}>{formatFCFA(item.price)}</Text>
            <Text style={styles.airbnbPlace} numberOfLines={1}>📍 {item.city} - {item.quartier}</Text>
            {cardImages.length > 1 && <Text style={styles.swipeHint}>Glisse pour voir les photos →</Text>}
          </View>
        </View>

        <View style={styles.airbnbContent}>
          <Text style={styles.airbnbTitle} numberOfLines={2}>{item.title || "Bien immobilier"}</Text>

          <View style={styles.airbnbSpecRow}>
            <Text style={styles.airbnbSpec}>🛏️ {item.bedrooms || "-"}</Text>
            <Text style={styles.airbnbSpec}>🛁 {item.bathrooms || "-"}</Text>
            <Text style={styles.airbnbSpec}>📐 {item.surface || item.landSurface || "-"} m²</Text>
          </View>

          <View style={styles.airbnbActions}>
            <Pressable style={styles.airbnbWhatsapp} onPress={() => openWhatsApp(item)}>
              <Text style={styles.airbnbActionText}>WhatsApp</Text>
            </Pressable>
            <Pressable style={styles.airbnbCall} onPress={() => callSeller(item)}>
              <Text style={styles.airbnbActionText}>Appeler</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  function renderSkeletonCards() {
    return [1, 2, 3].map((item) => (
      <View key={item} style={styles.skeletonCard}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonLineLarge} />
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLineSmall} />
      </View>
    ));
  }

  if (loadingAuth) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#FCD116" />
        <Text style={styles.loadingText}>Chargement...</Text>
        <View style={styles.loadingSkeletonWrap}>{renderSkeletonCards()}</View>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#062E21", "#0B3D2E", "#145A32"]} style={styles.loginHero}>
          <View style={styles.flagLine}><View style={styles.greenLine} /><View style={styles.redLine} /><View style={styles.yellowLine} /></View>
          <Text style={styles.loginLogo}>EMPIRE</Text>
          <Text style={styles.loginSubLogo}>CAMER IMMO</Text>
          <Text style={styles.loginSlogan}>Ici on est au BOA, on vend, on achète, on loue — local by Empire Immo 🇨🇲</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>{isRegister ? "Créer un compte" : "Connexion"}</Text>

          {isRegister && (
            <>
              <TextInput style={styles.input} placeholder="Nom complet" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Téléphone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </>
          )}

          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />

          <Pressable style={[styles.primaryButton, loadingAction && styles.disabledButton]} onPress={isRegister ? register : login} disabled={loadingAction}>
            {loadingAction ? <ActivityIndicator color="white" /> : <Text style={styles.primaryButtonText}>{isRegister ? "Créer mon compte" : "Se connecter"}</Text>}
          </Pressable>

          <Pressable onPress={() => setIsRegister(!isRegister)} disabled={loadingAction}>
            <Text style={styles.switchText}>{isRegister ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? Créer un compte"}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (selectedAnnonce) {
    const item = selectedAnnonce;
    const hasPhone = cleanPhone(item.sellerPhone).length > 0;

    return (
      <View style={styles.detailContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailScrollContent}>
          <View style={styles.heroGalleryWrap}>
            {item.images?.length > 0 ? (
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.heroGallery}>
                {item.images.map((img: string, index: number) => (
                  <View key={index} style={styles.heroImageWrap}>
                    <Pressable onPress={() => setZoomImage(img)} style={{ flex: 1 }}>
                    <Image source={{ uri: img }} style={styles.heroImage} />
                  </Pressable>
                    <LinearGradient colors={["rgba(0,0,0,0.55)", "transparent", "rgba(0,0,0,0.45)"]} style={styles.heroImageOverlay} />
                    <Text style={styles.heroPhotoBadge}>{index + 1}/{item.images.length}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : <View style={styles.heroPlaceholder}><Text style={styles.placeholderIcon}>🏠</Text></View>}

            <View style={styles.heroTopActions}>
              <Pressable style={styles.heroBackButton} onPress={() => setSelectedAnnonce(null)}><Text style={styles.heroBackText}>←</Text></Pressable>
              <Pressable style={styles.heroFavoriteButton} onPress={() => toggleFavorite(item.id)}><Text style={styles.heroFavoriteText}>{favorites.includes(item.id) ? "❤️" : "🤍"}</Text></Pressable>
            </View>
          </View>

          <View style={styles.detailPremiumCard}>
            <View style={styles.badgeRow}>
              <Text style={styles.purposeBadge}>{item.purpose || "Bien"}</Text>
              {item.verified && <Text style={styles.verifiedBadge}>Vérifié</Text>}
              {item.boost && <Text style={styles.boostBadge}>Boosté</Text>}
            </View>

            <Text style={styles.detailPremiumPrice}>{formatFCFA(item.price)}</Text>
            <Text style={styles.detailPremiumTitle}>{item.title || "Bien immobilier"}</Text>
            <Text style={styles.detailPremiumLocation}>📍 {item.city || "-"} - {item.quartier || "-"}</Text>
            <Text style={styles.detailPremiumType}>{item.type || "Type non renseigné"}</Text>

            <View style={styles.premiumSpecRow}>
              <View style={styles.premiumSpecBox}><Text style={styles.premiumSpecIcon}>🛏️</Text><Text style={styles.premiumSpecValue}>{item.bedrooms || "-"}</Text><Text style={styles.premiumSpecLabel}>Chambres</Text></View>
              <View style={styles.premiumSpecBox}><Text style={styles.premiumSpecIcon}>🛁</Text><Text style={styles.premiumSpecValue}>{item.bathrooms || "-"}</Text><Text style={styles.premiumSpecLabel}>Douches</Text></View>
              <View style={styles.premiumSpecBox}><Text style={styles.premiumSpecIcon}>📐</Text><Text style={styles.premiumSpecValue}>{item.surface || "-"}</Text><Text style={styles.premiumSpecLabel}>m² bâtis</Text></View>
              <View style={styles.premiumSpecBox}><Text style={styles.premiumSpecIcon}>🌍</Text><Text style={styles.premiumSpecValue}>{item.landSurface || "-"}</Text><Text style={styles.premiumSpecLabel}>m² terrain</Text></View>
            </View>

            <Pressable style={styles.premiumMapButton} onPress={() => openMap(item)}><Text style={styles.premiumMapButtonText}>🗺️ Voir sur Google Maps</Text></Pressable>
            <Pressable style={styles.messageSellerButton} onPress={() => { setSelectedAnnonce(null); setSelectedChatAnnonce(item); }}><Text style={styles.messageSellerButtonText}>💬 Message interne</Text></Pressable>
            <Pressable
              style={styles.boostThisButton}
              onPress={() => {
                setSelectedAnnonce(null);
                setSelectedBoostAnnonce(item);
              }}
            >
              <Text style={styles.boostThisButtonText}>🔥 Booster cette annonce</Text>
            </Pressable>
          </View>

          <View style={styles.detailSectionCard}><Text style={styles.detailSectionTitle}>Description</Text><Text style={styles.detailDescription}>{item.description || "Aucune description disponible."}</Text></View>

          <View style={styles.detailSectionCard}>
            <Text style={styles.detailSectionTitle}>Vendeur / Agence</Text>
            <View style={styles.agentRow}>
              <View style={styles.agentAvatar}><Text style={styles.agentAvatarText}>{String(item.sellerName || "E").charAt(0).toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.agentName}>{item.sellerName || "Vendeur non renseigné"}</Text><Text style={styles.agentMeta}>{hasPhone ? cleanPhone(item.sellerPhone) : "Contact interne bientôt disponible"}</Text></View>
            </View>
          </View>

          <View style={styles.securityPremiumBox}><Text style={styles.securityTitle}>⚠️ Conseil sécurité</Text><Text style={styles.securityText}>Visitez toujours le bien, vérifiez les documents et évitez tout paiement avant confirmation physique.</Text></View>
        </ScrollView>

        <View style={styles.fixedContactBar}>
          <Pressable style={[styles.fixedCallButton, !hasPhone && styles.disabledButton]} onPress={() => callSeller(item)} disabled={!hasPhone}><Text style={styles.fixedButtonText}>📞 Appeler</Text></Pressable>
          <Pressable style={[styles.fixedWhatsAppButton, !hasPhone && styles.disabledButton]} onPress={() => openWhatsApp(item)} disabled={!hasPhone}><Text style={styles.fixedButtonText}>💬 WhatsApp</Text></Pressable>
        </View>
      </View>
    );
  }

  if (selectedChatAnnonce) {
    return (
      <View style={styles.container}>
        <View style={styles.headerSmall}>
          <Text style={styles.logoSmall}>MESSAGE VENDEUR</Text>
          <Text style={styles.slogan}>{selectedChatAnnonce.title}</Text>
        </View>
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable style={styles.backButton} onPress={() => setSelectedChatAnnonce(null)}>
              <Text style={styles.backButtonText}>← Retour</Text>
            </Pressable>

            <Text style={styles.title}>Contacter le vendeur</Text>
            <View style={styles.chatAnnonceCard}>
              <Text style={styles.chatAnnonceTitle}>{selectedChatAnnonce.title}</Text>
              <Text style={styles.chatAnnonceMeta}>{selectedChatAnnonce.city} - {selectedChatAnnonce.quartier}</Text>
              <Text style={styles.chatAnnoncePrice}>{formatFCFA(selectedChatAnnonce.price)}</Text>
            </View>

            <TextInput
              style={[styles.input, styles.chatInput]}
              placeholder="Bonjour, je suis intéressé par ce bien..."
              multiline
              value={chatText}
              onChangeText={setChatText}
            />

            <Pressable style={[styles.primaryButton, loadingAction && styles.disabledButton]} onPress={sendInternalMessage} disabled={loadingAction}>
              {loadingAction ? <ActivityIndicator color="white" /> : <Text style={styles.primaryButtonText}>Envoyer le message</Text>}
            </Pressable>

            <Text style={styles.sectionTitle}>Mes messages récents</Text>
            {messages.length ? messages.slice(0, 10).map((message) => (
              <View key={message.id} style={styles.messageCard}>
                <Text style={styles.messageTitle}>{message.annonceTitle}</Text>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageMeta}>De : {message.fromUserName || message.fromUserEmail}</Text>
              </View>
            )) : (
              <View style={styles.emptyBox}><Text style={styles.emptyText}>Aucun message pour le moment.</Text></View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  if (selectedBoostAnnonce) {
    const pack = BOOST_PACKS.find((item) => item.id === selectedPackId) || BOOST_PACKS[0];

    return (
      <View style={styles.container}>
        <View style={styles.headerSmall}><Text style={styles.logoSmall}>BOOST ANNONCE</Text><Text style={styles.slogan}>{selectedBoostAnnonce.title}</Text></View>
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable style={styles.backButton} onPress={() => setSelectedBoostAnnonce(null)}><Text style={styles.backButtonText}>← Retour</Text></Pressable>
            <Text style={styles.boostTitle}>Choisir un boost</Text>
            <Text style={styles.boostSubtitle}>Mets ton annonce en avant et reçois plus de contacts WhatsApp/Appels.</Text>

            {BOOST_PACKS.map((item) => {
              const isSelected = selectedPackId === item.id;
              const isRecommended = item.id === "boost_7j" || item.id === "boost_14j";

              return (
                <Pressable
                  key={item.id}
                  style={[styles.elitePackCard, isSelected && styles.elitePackCardActive]}
                  onPress={() => setSelectedPackId(item.id)}
                >
                  <View style={styles.packLeftZone}>
                    <View style={[styles.packRadio, isSelected && styles.packRadioActive]}>
                      {isSelected && <View style={styles.packRadioDot} />}
                    </View>

                    <View style={styles.packIconBox}>
                      <Text style={styles.packIcon}>{item.days >= 14 ? "🚀" : item.days === 7 ? "⭐" : "🔥"}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.packTitleRow}>
                        <Text style={[styles.elitePackTitle, isSelected && styles.packTextActive]}>{item.label}</Text>
                        {isRecommended && <Text style={styles.recommendedBadge}>RECOMMANDÉ</Text>}
                      </View>
                      <Text style={[styles.elitePackDesc, isSelected && styles.packDescActive]}>
                        Ton annonce en avant pendant {item.days} jours
                      </Text>
                    </View>
                  </View>

                  <View style={styles.packPriceZone}>
                    <Text style={[styles.elitePackPrice, isSelected && styles.packTextActive]}>{formatFCFA(item.price)}</Text>
                    <Text style={[styles.packArrow, isSelected && styles.packTextActive]}>›</Text>
                  </View>
                </Pressable>
              );
            })}

            <View style={styles.paymentSummaryBox}>
              <Text style={styles.paymentSummaryTitle}>Résumé du paiement</Text>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Pack choisi</Text><Text style={styles.summaryValue}>{pack.label}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Durée</Text><Text style={styles.summaryValue}>{pack.days} jours</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Montant à payer</Text><Text style={styles.summaryAmount}>{formatFCFA(pack.price)}</Text></View>
              <Text style={styles.summaryTrust}>✅ Validation admin après vérification du paiement • Boost visible immédiatement après validation</Text>
            </View>

            {renderPaymentInstructions(pack.price)}

            <View style={styles.segmentRow}>
              {[
                "MTN MoMo",
                "Orange Money",
              ].map((method) => <Pressable key={method} style={[styles.segment, paymentMethod === method && styles.segmentActive]} onPress={() => setPaymentMethod(method)}><Text style={[styles.segmentText, paymentMethod === method && styles.segmentTextActive]}>{method}</Text></Pressable>)}
            </View>

            <TextInput style={styles.boostInput} placeholder="Numéro utilisé pour payer" keyboardType="phone-pad" value={paymentPhone} onChangeText={setPaymentPhone} />
            <TextInput style={styles.boostInput} placeholder="Référence / ID transaction" value={paymentReference} onChangeText={setPaymentReference} />
            <Pressable style={[styles.boostPayButton, loadingAction && styles.disabledButton]} onPress={createBoostPaymentRequest} disabled={loadingAction}>
              {loadingAction ? <ActivityIndicator color="white" /> : <Text style={styles.boostPayButtonText}>🚀 Envoyer ma demande de boost</Text>}
            </Pressable>
            <Text style={styles.paymentSecurityText}>🔒 Paiement vérifié manuellement pour protéger les vendeurs et les acheteurs.</Text>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal visible={!!zoomImage} transparent animationType="fade" onRequestClose={() => setZoomImage(null)}>
        <View style={styles.zoomModal}>
          <Pressable style={styles.zoomClose} onPress={() => setZoomImage(null)}>
            <Text style={styles.zoomCloseText}>×</Text>
          </Pressable>
          {zoomImage && <Image source={{ uri: zoomImage }} style={styles.zoomImage} />}
        </View>
      </Modal>

      <View style={styles.headerSmall}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.logoSmall}>EMPIRE CAMER IMMO</Text>
            <Text style={styles.slogan}>{profile?.name ? `Bonjour ${profile.name}` : "Immobilier premium au Cameroun"}</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={logout}><Text style={styles.logoutText}>Quitter</Text></Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, activeTab === "home" && styles.tabActive]} onPress={() => setActiveTab("home")}><Text style={[styles.tabText, activeTab === "home" && styles.tabTextActive]}>Accueil</Text></Pressable>
          <Pressable style={[styles.tab, activeTab === "search" && styles.tabActive]} onPress={() => setActiveTab("search")}><Text style={[styles.tabText, activeTab === "search" && styles.tabTextActive]}>Recherche</Text></Pressable>
          <Pressable style={[styles.tab, activeTab === "publish" && styles.tabActive]} onPress={() => setActiveTab("publish")}><Text style={[styles.tabText, activeTab === "publish" && styles.tabTextActive]}>Publier</Text></Pressable>
          {isAdmin && <Pressable style={[styles.tab, activeTab === "admin" && styles.tabActive]} onPress={() => setActiveTab("admin")}><Text style={[styles.tabText, activeTab === "admin" && styles.tabTextActive]}>Admin</Text></Pressable>}
        </View>

        {activeTab === "home" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: heroScaleAnim }] }}>
              <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.homeHero} imageStyle={styles.homeHeroImage}>
                <LinearGradient colors={["rgba(0,0,0,0.52)", "rgba(0,0,0,0.20)", "rgba(0,0,0,0.68)"]} style={styles.homeHeroOverlay}>
                  <Text style={styles.homeHeroTitle}>Les meilleurs biens immobiliers au Cameroun</Text>
                  <Text style={styles.homeHeroText}>Annonces vérifiées • Agences • Contact direct</Text>

                  <LinearGradient
                    colors={["rgba(255,255,255,0.94)", "rgba(255,255,255,0.86)"]}
                    style={styles.bayutSearchBox}
                  >
                    <View style={styles.softFlagLine}>
                      <View style={styles.softGreenLine} />
                      <View style={styles.softRedLine} />
                      <View style={styles.softYellowLine} />
                    </View>

                    <View style={styles.searchModeRow}>
                      <Pressable
                        style={[styles.searchModeButton, filterPurpose === "Vente" && styles.searchModeActiveBuy]}
                        onPress={() => setFilterPurpose("Vente")}
                      >
                        <Text style={styles.searchModeIcon}>🏡</Text>
                        <Text style={[styles.searchModeText, filterPurpose === "Vente" && styles.searchModeTextBuy]}>Acheter</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.searchModeButton, filterPurpose === "Location" && styles.searchModeActiveRent]}
                        onPress={() => setFilterPurpose("Location")}
                      >
                        <Text style={styles.searchModeIcon}>🔑</Text>
                        <Text style={[styles.searchModeText, filterPurpose === "Location" && styles.searchModeTextRent]}>Louer</Text>
                      </Pressable>
                    </View>

                    <View style={styles.mainSearchRow}>
                      <TextInput
                        style={styles.heroSearchInput}
                        placeholder="📍 Ville, quartier ou type de bien"
                        placeholderTextColor="#6F7772"
                        value={searchText}
                        onChangeText={handleSmartSearch}
                      />
                      <Pressable style={styles.bigSearchButton} onPress={() => setActiveTab("search")}>
                        <Text style={styles.bigSearchButtonText}>Rechercher</Text>
                      </Pressable>
                    </View>

                    <View style={styles.quickFilterRow}>
                      <Pressable style={[styles.quickFilter, styles.quickFilterYellow]} onPress={() => setFilterType("")}><Text style={styles.quickFilterText}>Tous</Text></Pressable>
                      <Pressable style={[styles.quickFilter, styles.quickFilterGreen]} onPress={() => setFilterType("Maison")}><Text style={styles.quickFilterText}>Maison</Text></Pressable>
                      <Pressable style={[styles.quickFilter, styles.quickFilterRed]} onPress={() => setFilterType("Appartement")}><Text style={styles.quickFilterText}>Appartement</Text></Pressable>
                      <Pressable style={[styles.quickFilter, styles.quickFilterYellow]} onPress={() => setFilterType("Terrain")}><Text style={styles.quickFilterText}>Terrain</Text></Pressable>
                    </View>
                  </LinearGradient>
                </LinearGradient>
              </ImageBackground>
            </Animated.View>

            <Animated.View style={[styles.categoryRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>{CATEGORIES.map((category) => <Pressable key={category} style={styles.categoryPill} onPress={() => setCategory(category)}><Text style={styles.categoryText}>{category}</Text></Pressable>)}</Animated.View>

            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <LinearGradient colors={["#006B4A", "#0B3D2E"]} style={styles.sellBanner}> 
              <View style={{ flex: 1 }}>
                <Text style={styles.sellBannerBadge}>NEW</Text>
                <Text style={styles.sellBannerTitle}>Vends ou loue ton bien avec confiance</Text>
                <Text style={styles.sellBannerText}>Publie ton annonce, reçois des leads WhatsApp et booste ta visibilité.</Text>
              </View>
              <Pressable style={styles.sellBannerButton} onPress={() => setActiveTab("publish")}>
                <Text style={styles.sellBannerButtonText}>Commencer →</Text>
              </Pressable>
            </LinearGradient>
            </Animated.View>

            <View style={styles.monetizationBox}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.monetizationTitle}>💼 Offre Agence</Text>
                  <Text style={styles.monetizationText}>Validation prioritaire + annonces pro.</Text>
                  <Text style={styles.monetizationPrice}>{formatFCFA(AGENCY_PACK.price)} / mois</Text>
                </View>
                <Pressable style={styles.secondaryButton} onPress={() => setActiveTab("publish")}>
                  <Text style={styles.secondaryButtonText}>Publier</Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.sectionTitle}>🔥 Biens populaires</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>{popularAnnonces.length ? popularAnnonces.map((item) => <View key={item.id} style={styles.horizontalCard}>{renderPropertyCard(item, true)}</View>) : <Text style={styles.emptyText}>Aucun bien boosté pour le moment.</Text>}</ScrollView>

            <Text style={styles.sectionTitle}>🆕 Annonces récentes</Text>
            {recentAnnonces.length ? recentAnnonces.map((item) => renderPropertyCard(item)) : <View style={styles.emptyBox}><Text style={styles.emptyTitle}>Aucune annonce disponible</Text><Text style={styles.emptyText}>Les annonces validées apparaîtront ici.</Text></View>}
          </ScrollView>
        )}

        {activeTab === "search" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Recherche avancée</Text>
            <TextInput style={styles.input} placeholder="Recherche intelligente : terrain pas cher à Douala" value={searchText} onChangeText={handleSmartSearch} />
            {!!aiSearchSuggestion && <Text style={styles.aiSuggestionText}>🤖 {aiSearchSuggestion}</Text>}
            <View style={styles.segmentRow}><Pressable style={[styles.segment, filterPurpose === "Vente" && styles.segmentActive]} onPress={() => setFilterPurpose(filterPurpose === "Vente" ? "" : "Vente")}><Text style={[styles.segmentText, filterPurpose === "Vente" && styles.segmentTextActive]}>Acheter</Text></Pressable><Pressable style={[styles.segment, filterPurpose === "Location" && styles.segmentActive]} onPress={() => setFilterPurpose(filterPurpose === "Location" ? "" : "Location")}><Text style={[styles.segmentText, filterPurpose === "Location" && styles.segmentTextActive]}>Louer</Text></Pressable></View>
            <TextInput style={styles.input} placeholder="Ville" value={filterCity} onChangeText={setFilterCity} />
            <TextInput style={styles.input} placeholder="Quartier" value={filterQuartier} onChangeText={setFilterQuartier} />
            <TextInput style={styles.input} placeholder="Type de bien" value={filterType} onChangeText={setFilterType} />
            <View style={styles.inputGrid}><TextInput style={[styles.input, styles.half]} placeholder="Prix min" keyboardType="numeric" value={filterMinPrice} onChangeText={setFilterMinPrice} /><TextInput style={[styles.input, styles.half]} placeholder="Prix max" keyboardType="numeric" value={filterMaxPrice} onChangeText={setFilterMaxPrice} /><TextInput style={[styles.input, styles.half]} placeholder="Chambres min" keyboardType="numeric" value={filterMinBedrooms} onChangeText={setFilterMinBedrooms} /></View>
            <Pressable style={showFavoritesOnly ? styles.favoriteFilterActive : styles.favoriteFilter} onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}><Text style={showFavoritesOnly ? styles.favoriteFilterTextActive : styles.favoriteFilterText}>{showFavoritesOnly ? "❤️ Favoris seulement" : "🤍 Afficher mes favoris"}</Text></Pressable>
            <Text style={styles.sectionTitle}>Résultats ({filteredAnnonces.length})</Text>
            {filteredAnnonces.length ? filteredAnnonces.map((item) => renderPropertyCard(item)) : <View style={styles.emptyBox}><Text style={styles.emptyTitle}>Aucune annonce trouvée</Text><Text style={styles.emptyText}>Essaie avec une autre ville, un autre quartier ou un autre budget.</Text></View>}
          </ScrollView>
        )}

        {activeTab === "publish" && (
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
            <View style={styles.inputGrid}><TextInput style={[styles.input, styles.half]} placeholder="Chambres" keyboardType="numeric" value={bedrooms} onChangeText={setBedrooms} /><TextInput style={[styles.input, styles.half]} placeholder="Douches" keyboardType="numeric" value={bathrooms} onChangeText={setBathrooms} /><TextInput style={[styles.input, styles.half]} placeholder="Habitation m²" keyboardType="numeric" value={surface} onChangeText={setSurface} /><TextInput style={[styles.input, styles.half]} placeholder="Terrain m²" keyboardType="numeric" value={landSurface} onChangeText={setLandSurface} /></View>
            <TextInput style={styles.input} placeholder="Nom vendeur ou agence" value={sellerName} onChangeText={setSellerName} />
            <TextInput style={styles.input} placeholder="Téléphone WhatsApp" keyboardType="phone-pad" value={sellerPhone} onChangeText={setSellerPhone} />
            <TextInput style={styles.input} placeholder="Adresse Google Maps" value={mapAddress} onChangeText={setMapAddress} />
            <Pressable style={styles.imageButton} onPress={pickImages}><Text style={styles.imageButtonText}>{images.length ? `Images sélectionnées (${images.length})` : "Ajouter plusieurs images"}</Text></Pressable>
            {images.length > 0 && <ScrollView horizontal style={styles.previewGallery}>{images.map((img, i) => <Image key={i} source={{ uri: img }} style={styles.previewImage} />)}</ScrollView>}
            <Pressable style={[styles.primaryButton, loadingAction && styles.disabledButton]} onPress={publierAnnonce} disabled={loadingAction}>{loadingAction ? <ActivityIndicator color="white" /> : <Text style={styles.primaryButtonText}>{isAgency ? "Publier maintenant" : "Envoyer pour validation"}</Text>}</Pressable>
          </ScrollView>
        )}

        {activeTab === "admin" && isAdmin && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Panel Admin</Text>
            <View style={styles.launchBox}>
              <Text style={styles.launchTitle}>🌍 Checklist publication</Text>
              <Text style={styles.launchItem}>✅ Nom app : Empire Camer Immo</Text>
              <Text style={styles.launchItem}>✅ Firebase Auth / Firestore / Storage</Text>
              <Text style={styles.launchItem}>✅ Boost, agences, leads et admin</Text>
              <Text style={styles.launchItem}>🔜 Play Store : icône, screenshots, description, politique confidentialité</Text>
              <Text style={styles.launchItem}>🔜 App Store : compte Apple Developer + build EAS</Text>
            </View>

            <View style={styles.apiPaymentBox}>
              <Text style={styles.apiPaymentTitle}>💳 Paiement automatique MoMo / Orange API</Text>
              <Text style={styles.apiPaymentText}>Le front est prêt. Pour l’automatique, branche un backend sécurisé : création transaction, webhook paiement, puis activation auto du boost.</Text>
              <Text style={styles.apiPaymentCode}>POST /create-payment → webhook → update payments + boost</Text>
            </View>
            <View style={styles.dashboardGrid}>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{formatFCFA(totalRevenue)}</Text><Text style={styles.dashboardLabel}>Revenus validés</Text></View>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{pendingPayments.length}</Text><Text style={styles.dashboardLabel}>Paiements attente</Text></View>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{activeBoosts}</Text><Text style={styles.dashboardLabel}>Boosts actifs</Text></View>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{leads.length}</Text><Text style={styles.dashboardLabel}>Leads générés</Text></View>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{pendingAnnonces}</Text><Text style={styles.dashboardLabel}>Annonces attente</Text></View>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{adminAnnonces.length}</Text><Text style={styles.dashboardLabel}>Total annonces</Text></View>
            </View>

            <Text style={styles.sectionTitle}>📊 Stats détaillées agences</Text>
            <View style={styles.dashboardGrid}>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{myAnnonces.length}</Text><Text style={styles.dashboardLabel}>Mes annonces</Text></View>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{myLeads.length}</Text><Text style={styles.dashboardLabel}>Mes leads</Text></View>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{myLeads.filter((lead) => lead.source === "whatsapp").length}</Text><Text style={styles.dashboardLabel}>WhatsApp</Text></View>
              <View style={styles.dashboardBox}><Text style={styles.dashboardValue}>{myLeads.filter((lead) => lead.source === "call").length}</Text><Text style={styles.dashboardLabel}>Appels</Text></View>
            </View>

            <Text style={styles.sectionTitle}>Derniers leads ({leads.length})</Text>
            {leads.slice(0, 8).map((lead) => (
              <View key={lead.id} style={styles.leadCard}>
                <Text style={styles.leadTitle}>{lead.annonceTitle}</Text>
                <Text style={styles.leadMeta}>Source : {lead.source} • {lead.city} - {lead.quartier}</Text>
                <Text style={styles.leadMeta}>Client : {lead.buyerName || lead.buyerEmail}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Paiements à vérifier ({pendingPayments.length})</Text>
            {payments.map((payment) => (
              <View key={payment.id} style={styles.adminCard}>
                <Text style={styles.adminTitle}>{payment.packLabel}</Text>
                <Text style={styles.adminMeta}>Montant : {formatFCFA(payment.amount)}</Text>
                <Text style={styles.adminMeta}>Méthode : {payment.method}</Text>
                <Text style={styles.adminMeta}>Téléphone : {payment.paymentPhone}</Text>
                <Text style={styles.adminMeta}>Référence : {payment.reference}</Text>
                <Text style={styles.adminStatus}>Statut : {payment.status}</Text>
                {payment.status === "pending" && <View style={styles.adminActions}><Pressable style={styles.approveButton} onPress={() => approvePayment(payment)}><Text style={styles.adminButtonText}>Valider</Text></Pressable><Pressable style={styles.rejectButton} onPress={() => rejectPayment(payment)}><Text style={styles.adminButtonText}>Refuser</Text></Pressable></View>}
              </View>
            ))}

            <Text style={styles.sectionTitle}>Annonces ({adminAnnonces.length})</Text>
            {adminAnnonces.map((item) => (
              <View key={item.id} style={styles.adminCard}>
                <Text style={styles.adminTitle}>{item.title || "Sans titre"}</Text>
                <Text style={styles.adminMeta}>{item.city} - {item.quartier}</Text>
                <Text style={styles.adminMeta}>{formatFCFA(item.price)} • {item.type}</Text>
                <Text style={styles.adminStatus}>Statut : {item.status}</Text>
                <View style={styles.adminActions}>
                  <Pressable style={styles.approveButton} onPress={() => approveAnnonce(item)}><Text style={styles.adminButtonText}>Valider</Text></Pressable>
                  <Pressable style={styles.boostAdminButton} onPress={() => activateBoostFromAdmin(item)}><Text style={styles.adminButtonText}>Booster 7j</Text></Pressable>
                  <Pressable style={styles.rejectButton} onPress={() => rejectAnnonce(item)}><Text style={styles.adminButtonText}>Refuser</Text></Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06251A" },
  loadingScreen: { flex: 1, backgroundColor: "#06251A", alignItems: "center", justifyContent: "center" },
  loadingText: { color: "white", marginTop: 12, fontWeight: "900" },
  loginHero: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  flagLine: { flexDirection: "row", gap: 6, marginBottom: 18 },
  greenLine: { width: 40, height: 6, backgroundColor: "#00843D", borderRadius: 10 },
  redLine: { width: 40, height: 6, backgroundColor: "#CE1126", borderRadius: 10 },
  yellowLine: { width: 40, height: 6, backgroundColor: "#FCD116", borderRadius: 10 },
  loginLogo: { color: "#FCD116", fontSize: 34, fontWeight: "900", letterSpacing: 1.5 },
  loginSubLogo: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", letterSpacing: 6 },
  loginSlogan: { color: "#E8F5EE", fontSize: 14, marginTop: 10, lineHeight: 20 },
  headerSmall: { paddingTop: 48, paddingHorizontal: 22, paddingBottom: 24 },
  logoSmall: { color: "#FCD116", fontSize: 24, fontWeight: "900" },
  slogan: { color: "rgba(255,255,255,0.85)", marginTop: 8 },
  card: { flex: 1, backgroundColor: "white", borderTopLeftRadius: 34, borderTopRightRadius: 34, padding: 18 },
  title: { fontSize: 30, fontWeight: "900", color: "#06251A", marginBottom: 18 },
  miniTitle: { fontSize: 18, fontWeight: "900", color: "#06251A", marginBottom: 10 },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: "#06251A", marginVertical: 18 },
  input: { backgroundColor: "#F4F2EE", borderRadius: 16, padding: 16, fontSize: 16, marginBottom: 12 },
  heroSearchInput: { flex: 1, backgroundColor: "rgba(244,242,238,0.92)", borderRadius: 20, padding: 18, fontSize: 17, fontWeight: "800", borderWidth: 1, borderColor: "rgba(252,209,22,0.35)" },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  inputGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  half: { flex: 1, minWidth: 140 },
  primaryButton: { backgroundColor: "#00843D", padding: 18, borderRadius: 16, alignItems: "center", marginTop: 10 },
  primaryButtonText: { color: "white", fontWeight: "900", fontSize: 17 },
  secondaryButton: { backgroundColor: "#06251A", padding: 15, borderRadius: 16, alignItems: "center", marginTop: 4 },
  secondaryButtonText: { color: "white", fontWeight: "900" },
  disabledButton: { opacity: 0.55 },
  switchText: { textAlign: "center", color: "#00843D", fontWeight: "900", marginTop: 22 },
  tabs: { flexDirection: "row", backgroundColor: "#F4F2EE", borderRadius: 18, padding: 5, marginBottom: 20 },
  tab: { flex: 1, padding: 11, borderRadius: 14, alignItems: "center" },
  tabActive: { backgroundColor: "#00843D" },
  tabText: { fontWeight: "900", color: "#06251A", fontSize: 12 },
  tabTextActive: { color: "white" },
  homeHero: { borderRadius: 38, marginBottom: 18, minHeight: 410, overflow: "hidden", backgroundColor: "#06251A", shadowColor: "#000", shadowOpacity: 0.22, shadowRadius: 24, elevation: 10 },
  homeHeroImage: { borderRadius: 38 },
  homeHeroOverlay: { flex: 1, padding: 24, justifyContent: "center" },
  homeHeroTitle: { color: "white", fontSize: 40, fontWeight: "900", lineHeight: 46, textAlign: "center", textShadowColor: "rgba(0,0,0,0.35)", textShadowRadius: 8 },
  homeHeroText: { color: "rgba(255,255,255,0.95)", marginTop: 10, lineHeight: 24, textAlign: "center", fontWeight: "900", fontSize: 16 },
  bayutSearchBox: { borderRadius: 34, padding: 18, marginTop: 30, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 26, elevation: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.78)", overflow: "hidden" },
  searchModeRow: { flexDirection: "row", backgroundColor: "rgba(244,242,238,0.82)", borderRadius: 22, padding: 6, marginBottom: 14, gap: 8 },
  searchModeButton: { flex: 1, paddingVertical: 15, borderRadius: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  searchModeActive: { backgroundColor: "#E8F8EF" },
  searchModeActiveBuy: { backgroundColor: "rgba(0,132,61,0.13)", borderWidth: 1, borderColor: "rgba(0,132,61,0.30)" },
  searchModeActiveRent: { backgroundColor: "rgba(206,17,38,0.10)", borderWidth: 1, borderColor: "rgba(206,17,38,0.22)" },
  searchModeIcon: { fontSize: 20 },
  searchModeText: { color: "#06251A", fontWeight: "900", fontSize: 18 },
  searchModeTextActive: { color: "#00843D" },
  searchModeTextBuy: { color: "#00843D" },
  searchModeTextRent: { color: "#CE1126" },
  mainSearchRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  bigSearchButton: { backgroundColor: "#006B4A", paddingHorizontal: 22, paddingVertical: 19, borderRadius: 20, alignItems: "center", justifyContent: "center", shadowColor: "#006B4A", shadowOpacity: 0.30, shadowRadius: 14, elevation: 7 },
  bigSearchButtonText: { color: "white", fontWeight: "900", fontSize: 16 },
  quickFilterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  quickFilter: { backgroundColor: "rgba(255,255,255,0.86)", paddingHorizontal: 15, paddingVertical: 11, borderRadius: 16, borderWidth: 1 },
  quickFilterText: { color: "#006B4A", fontWeight: "900", fontSize: 15 },
  quickFilterGreen: { borderColor: "rgba(0,132,61,0.25)", backgroundColor: "rgba(0,132,61,0.08)" },
  quickFilterRed: { borderColor: "rgba(206,17,38,0.22)", backgroundColor: "rgba(206,17,38,0.07)" },
  quickFilterYellow: { borderColor: "rgba(252,209,22,0.40)", backgroundColor: "rgba(252,209,22,0.14)" },
  softFlagLine: { flexDirection: "row", height: 5, borderRadius: 999, overflow: "hidden", marginBottom: 14 },
  softGreenLine: { flex: 1, backgroundColor: "rgba(0,132,61,0.55)" },
  softRedLine: { flex: 1, backgroundColor: "rgba(206,17,38,0.42)" },
  softYellowLine: { flex: 1, backgroundColor: "rgba(252,209,22,0.62)" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginBottom: 10 },
  categoryPill: { backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 14, borderRadius: 999, borderWidth: 1, borderColor: "#EFEAE2", shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  categoryText: { color: "#06251A", fontWeight: "900", fontSize: 15 },
  segmentRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  segment: { backgroundColor: "#F4F2EE", paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14 },
  segmentActive: { backgroundColor: "#CE1126" },
  segmentText: { color: "#06251A", fontWeight: "900" },
  segmentTextActive: { color: "white" },
  imageButton: { backgroundColor: "#FCD116", padding: 15, borderRadius: 14, alignItems: "center", marginBottom: 12 },
  imageButtonText: { color: "#06251A", fontWeight: "900" },
  previewGallery: { marginBottom: 12 },
  previewImage: { width: 145, height: 105, borderRadius: 14, marginRight: 10 },
  propertyCard: { flexDirection: "row", gap: 14, backgroundColor: "#FFFFFF", padding: 13, borderRadius: 24, marginBottom: 14, borderWidth: 1, borderColor: "#EFEAE2", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  compactCard: { width: 290, minHeight: 175 },
  horizontalCard: { marginRight: 12 },
  boostedCard: { borderColor: "orange", borderWidth: 2 },
  propertyImage: { width: 115, height: 125, borderRadius: 18, backgroundColor: "#06251A" },
  propertyImageFake: { width: 115, height: 125, borderRadius: 18, backgroundColor: "#06251A", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FCD116" },
  compactImage: { width: 95, height: 130, borderRadius: 18, backgroundColor: "#06251A" },
  compactImageFake: { width: 95, height: 130, borderRadius: 18, backgroundColor: "#06251A", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FCD116" },
  placeholderIcon: { fontSize: 42 },
  propertyTitle: { flex: 1, fontSize: 17, fontWeight: "900", color: "#06251A" },
  propertyPrice: { color: "#CE1126", fontSize: 17, fontWeight: "900", marginTop: 5 },
  location: { color: "#6F7772", marginTop: 5 },
  specLine: { color: "#06251A", fontWeight: "700", fontSize: 12, marginTop: 5 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  heart: { fontSize: 22 },
  badgeRow: { flexDirection: "row", gap: 7, flexWrap: "wrap", marginTop: 5 },
  purposeBadge: { backgroundColor: "#00843D", color: "white", fontWeight: "900", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9, fontSize: 11 },
  boostBadge: { backgroundColor: "#FCD116", color: "#06251A", fontWeight: "900", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9, fontSize: 11 },
  verifiedBadge: { backgroundColor: "#E8F8EF", color: "#00843D", fontWeight: "900", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9, fontSize: 11 },
  quickActions: { flexDirection: "row", gap: 8, marginTop: 10 },
  quickWhatsapp: { flex: 1, backgroundColor: "#25D366", paddingVertical: 9, borderRadius: 12, alignItems: "center" },
  quickCall: { flex: 1, backgroundColor: "#06251A", paddingVertical: 9, borderRadius: 12, alignItems: "center" },
  quickActionText: { color: "white", fontWeight: "900", fontSize: 12 },
  favoriteFilter: { backgroundColor: "#F4F2EE", padding: 14, borderRadius: 14, alignItems: "center" },
  favoriteFilterActive: { backgroundColor: "#CE1126", padding: 14, borderRadius: 14, alignItems: "center" },
  favoriteFilterText: { color: "#06251A", fontWeight: "900" },
  favoriteFilterTextActive: { color: "white", fontWeight: "900" },
  logoutButton: { backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12 },
  logoutText: { color: "white", fontWeight: "900" },
  backButton: { backgroundColor: "#F4F2EE", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 15, alignSelf: "flex-start" },
  backButtonText: { fontWeight: "900", color: "#06251A" },
  emptyBox: { backgroundColor: "#F4F2EE", padding: 18, borderRadius: 18, marginBottom: 20 },
  emptyTitle: { color: "#06251A", fontWeight: "900", fontSize: 18, marginBottom: 6 },
  emptyText: { color: "#555", lineHeight: 20 },
  sellBanner: { flexDirection: "row", alignItems: "center", gap: 14, padding: 20, borderRadius: 28, marginVertical: 16, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 14, elevation: 5 },
  sellBannerBadge: { alignSelf: "flex-start", backgroundColor: "#FF2D2D", color: "white", fontWeight: "900", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  sellBannerTitle: { color: "#D7F5C8", fontSize: 26, fontWeight: "900", lineHeight: 32 },
  sellBannerText: { color: "rgba(255,255,255,0.9)", marginTop: 8, lineHeight: 22, fontSize: 15 },
  sellBannerButton: { backgroundColor: "white", paddingHorizontal: 16, paddingVertical: 13, borderRadius: 14 },
  sellBannerButtonText: { color: "#006B4A", fontWeight: "900" },
  monetizationBox: { backgroundColor: "#FFF7DB", padding: 18, borderRadius: 28, marginVertical: 14, borderWidth: 1, borderColor: "#F7E7A6", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  monetizationTitle: { color: "#06251A", fontSize: 22, fontWeight: "900" },
  monetizationText: { color: "#333", marginTop: 6, lineHeight: 22, fontSize: 14 },
  monetizationPrice: { color: "#CE1126", fontWeight: "900", marginVertical: 10, fontSize: 18 },
  paymentInfoBox: { backgroundColor: "#F4F2EE", padding: 20, borderRadius: 24, marginVertical: 14, borderWidth: 1, borderColor: "#E8E2DA" },
  paymentTitle: { color: "#06251A", fontWeight: "900", fontSize: 24, marginBottom: 10 },
  paymentText: { color: "#333", fontWeight: "900", marginTop: 7, fontSize: 17 },
  paymentAmount: { color: "#CE1126", fontSize: 25, fontWeight: "900", marginTop: 14 },
  paymentHint: { color: "#555", lineHeight: 24, marginTop: 10, fontSize: 15, fontWeight: "700" },
  packCard: { backgroundColor: "#F4F2EE", padding: 16, borderRadius: 18, marginBottom: 10, flexDirection: "row", justifyContent: "space-between" },
  packCardActive: { backgroundColor: "#00843D" },
  packTitle: { color: "#06251A", fontWeight: "900", fontSize: 20 },
  packPrice: { color: "#CE1126", fontWeight: "900", fontSize: 20 },
  packTextActive: { color: "white" },
  boostTitle: { fontSize: 38, fontWeight: "900", color: "#06251A", marginBottom: 8, letterSpacing: -0.5 },
  boostSubtitle: { color: "#555", fontSize: 17, fontWeight: "800", lineHeight: 24, marginBottom: 18 },
  elitePackCard: { backgroundColor: "#FFFFFF", padding: 18, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: "#EFEAE2", flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  elitePackCardActive: { backgroundColor: "#00843D", borderColor: "#00843D", shadowColor: "#00843D", shadowOpacity: 0.22, shadowRadius: 18, elevation: 8 },
  packLeftZone: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  packRadio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: "#D8D8D8", alignItems: "center", justifyContent: "center", backgroundColor: "white" },
  packRadioActive: { borderColor: "white" },
  packRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#00843D" },
  packIconBox: { width: 54, height: 54, borderRadius: 18, backgroundColor: "#F0F8F3", alignItems: "center", justifyContent: "center" },
  packIcon: { fontSize: 27 },
  packTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  elitePackTitle: { color: "#06251A", fontWeight: "900", fontSize: 23 },
  elitePackDesc: { color: "#555", fontWeight: "800", fontSize: 15, marginTop: 4 },
  packDescActive: { color: "rgba(255,255,255,0.88)" },
  recommendedBadge: { backgroundColor: "#FCD116", color: "#06251A", fontWeight: "900", fontSize: 11, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  packPriceZone: { alignItems: "flex-end", marginLeft: 10 },
  elitePackPrice: { color: "#CE1126", fontWeight: "900", fontSize: 24 },
  packArrow: { color: "#06251A", fontSize: 34, fontWeight: "900", marginTop: -4 },
  paymentSummaryBox: { backgroundColor: "#06251A", borderRadius: 26, padding: 20, marginTop: 10, marginBottom: 14, shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 14, elevation: 5 },
  paymentSummaryTitle: { color: "#FCD116", fontSize: 23, fontWeight: "900", marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.12)" },
  summaryLabel: { color: "rgba(255,255,255,0.72)", fontSize: 16, fontWeight: "800" },
  summaryValue: { color: "white", fontSize: 17, fontWeight: "900" },
  summaryAmount: { color: "#FCD116", fontSize: 24, fontWeight: "900" },
  summaryTrust: { color: "rgba(255,255,255,0.82)", fontSize: 14, fontWeight: "800", lineHeight: 21, marginTop: 14 },
  boostInput: { backgroundColor: "#F4F2EE", borderRadius: 18, padding: 20, fontSize: 18, marginBottom: 14, fontWeight: "800" },
  boostPayButton: { backgroundColor: "#00843D", padding: 22, borderRadius: 22, alignItems: "center", marginTop: 12, shadowColor: "#00843D", shadowOpacity: 0.25, shadowRadius: 14, elevation: 6 },
  boostPayButtonText: { color: "white", fontWeight: "900", fontSize: 20 },
  paymentSecurityText: { textAlign: "center", color: "#555", fontWeight: "800", fontSize: 14, lineHeight: 20, marginTop: 12, marginBottom: 20 },
  adminCard: { backgroundColor: "#F4F2EE", padding: 15, borderRadius: 18, marginBottom: 12 },
  adminTitle: { color: "#06251A", fontSize: 17, fontWeight: "900" },
  adminMeta: { color: "#333", marginTop: 5, fontWeight: "700" },
  adminStatus: { color: "#CE1126", marginTop: 7, fontWeight: "900" },
  adminActions: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
  approveButton: { backgroundColor: "#00843D", paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12 },
  rejectButton: { backgroundColor: "#CE1126", paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12 },
  boostAdminButton: { backgroundColor: "orange", paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12 },
  adminButtonText: { color: "white", fontWeight: "900" },
  airbnbCard: { backgroundColor: "white", borderRadius: 34, marginBottom: 20, overflow: "hidden", borderWidth: 1, borderColor: "#EFEAE2", shadowColor: "#000", shadowOpacity: 0.13, shadowRadius: 22, elevation: 8 },
  airbnbCompactCard: { width: 300, marginRight: 14 },
  airbnbBoostedCard: { borderColor: "#FCD116", borderWidth: 2 },
  airbnbImageWrap: { height: 245, backgroundColor: "#06251A", position: "relative" },
  airbnbImageSmallWrap: { height: 205, backgroundColor: "#06251A", position: "relative" },
  airbnbImage: { width: "100%", height: "100%", resizeMode: "cover" },
  airbnbImageFake: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  airbnbImageOverlay: { ...StyleSheet.absoluteFillObject },
  airbnbTopRow: { position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  airbnbBadgeGlass: { backgroundColor: "rgba(255,255,255,0.88)", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  airbnbBadgeText: { color: "#06251A", fontWeight: "900", fontSize: 12 },
  airbnbHeartGlass: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.88)", alignItems: "center", justifyContent: "center" },
  airbnbImageBottom: { position: "absolute", left: 16, right: 16, bottom: 16 },
  airbnbPrice: { color: "white", fontSize: 28, fontWeight: "900", textShadowColor: "rgba(0,0,0,0.45)", textShadowRadius: 6 },
  airbnbPlace: { color: "rgba(255,255,255,0.9)", marginTop: 5, fontWeight: "800" },
  airbnbContent: { padding: 18 },
  airbnbTitle: { color: "#06251A", fontSize: 23, fontWeight: "900", lineHeight: 28 },
  airbnbSpecRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  airbnbSpec: { backgroundColor: "#F4F2EE", color: "#06251A", paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999, fontWeight: "900", fontSize: 14 },
  airbnbActions: { flexDirection: "row", gap: 12, marginTop: 16 },
  airbnbWhatsapp: { flex: 1, backgroundColor: "#25D366", padding: 14, borderRadius: 16, alignItems: "center" },
  airbnbCall: { flex: 1, backgroundColor: "#06251A", padding: 14, borderRadius: 16, alignItems: "center" },
  airbnbActionText: { color: "white", fontWeight: "900" },
  cardImageSwiper: { flex: 1 },
  cardImageSlide: { width: 390, height: 230 },
  cardImageSlideSmall: { width: 300, height: 190 },
  fakeImageText: { color: "rgba(255,255,255,0.75)", fontWeight: "800", marginTop: 10 },
  swipeHint: { color: "rgba(255,255,255,0.82)", fontWeight: "800", marginTop: 5, fontSize: 12 },
  zoomModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.94)", alignItems: "center", justifyContent: "center" },
  zoomImage: { width: "100%", height: "82%", resizeMode: "contain" },
  zoomClose: { position: "absolute", top: 48, right: 22, zIndex: 10, width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  zoomCloseText: { color: "white", fontSize: 36, fontWeight: "900", lineHeight: 40 },
  loadingSkeletonWrap: { width: "92%", marginTop: 28 },
  skeletonCard: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 22, padding: 14, marginBottom: 12 },
  skeletonImage: { height: 120, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.18)", marginBottom: 12 },
  skeletonLineLarge: { height: 18, width: "75%", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.18)", marginBottom: 8 },
  skeletonLine: { height: 14, width: "55%", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", marginBottom: 8 },
  skeletonLineSmall: { height: 14, width: "35%", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)" },
  messageSellerButton: { backgroundColor: "#F0F8F3", padding: 15, borderRadius: 18, alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: "#BFE8CF" },
  messageSellerButtonText: { color: "#00843D", fontWeight: "900" },
  boostThisButton: { backgroundColor: "#FCD116", padding: 15, borderRadius: 18, alignItems: "center", marginTop: 12 },
  boostThisButtonText: { color: "#06251A", fontWeight: "900" },
  detailContainer: { flex: 1, backgroundColor: "#F4F2EE" },
  detailScrollContent: { paddingBottom: 110 },
  heroGalleryWrap: { height: 360, backgroundColor: "#06251A", position: "relative" },
  heroGallery: { height: 360 },
  heroImageWrap: { width: 390, height: 360, position: "relative" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroImageOverlay: { ...StyleSheet.absoluteFillObject },
  heroPlaceholder: { height: 360, backgroundColor: "#06251A", alignItems: "center", justifyContent: "center" },
  heroPhotoBadge: { position: "absolute", right: 18, bottom: 22, backgroundColor: "rgba(0,0,0,0.65)", color: "white", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, fontWeight: "900" },
  heroTopActions: { position: "absolute", top: 50, left: 18, right: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroBackButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" },
  heroBackText: { color: "#06251A", fontSize: 26, fontWeight: "900" },
  heroFavoriteButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" },
  heroFavoriteText: { fontSize: 22 },
  detailPremiumCard: { backgroundColor: "white", marginTop: -30, marginHorizontal: 16, borderRadius: 28, padding: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 14, elevation: 4 },
  detailPremiumPrice: { color: "#CE1126", fontSize: 30, fontWeight: "900", marginTop: 14 },
  detailPremiumTitle: { color: "#06251A", fontSize: 26, fontWeight: "900", marginTop: 8, lineHeight: 31 },
  detailPremiumLocation: { color: "#6F7772", marginTop: 8, fontWeight: "700" },
  detailPremiumType: { color: "#00843D", marginTop: 8, fontWeight: "900" },
  premiumSpecRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 },
  premiumSpecBox: { width: "47.8%", backgroundColor: "#F4F2EE", borderRadius: 18, padding: 14 },
  premiumSpecIcon: { fontSize: 22, marginBottom: 6 },
  premiumSpecValue: { color: "#06251A", fontSize: 20, fontWeight: "900" },
  premiumSpecLabel: { color: "#6F7772", fontSize: 12, fontWeight: "800", marginTop: 3 },
  premiumMapButton: { backgroundColor: "#06251A", padding: 16, borderRadius: 18, alignItems: "center", marginTop: 18 },
  premiumMapButtonText: { color: "white", fontWeight: "900" },
  detailSectionCard: { backgroundColor: "white", marginHorizontal: 16, marginTop: 14, borderRadius: 24, padding: 20 },
  detailSectionTitle: { color: "#06251A", fontSize: 21, fontWeight: "900", marginBottom: 12 },
  detailDescription: { color: "#333", lineHeight: 23, fontSize: 15 },
  agentRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  agentAvatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#06251A", alignItems: "center", justifyContent: "center" },
  agentAvatarText: { color: "#FCD116", fontSize: 22, fontWeight: "900" },
  agentName: { color: "#06251A", fontSize: 17, fontWeight: "900" },
  agentMeta: { color: "#6F7772", fontWeight: "700", marginTop: 4 },
  securityPremiumBox: { backgroundColor: "#FFF7DB", marginHorizontal: 16, marginTop: 14, borderRadius: 24, padding: 18 },
  securityTitle: { color: "#CE1126", fontWeight: "900", fontSize: 18, marginBottom: 6 },
  securityText: { color: "#332", lineHeight: 21 },
  fixedContactBar: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "white", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 26, flexDirection: "row", gap: 12, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 12, elevation: 10 },
  fixedCallButton: { flex: 1, backgroundColor: "#06251A", padding: 17, borderRadius: 18, alignItems: "center" },
  fixedWhatsAppButton: { flex: 1, backgroundColor: "#25D366", padding: 17, borderRadius: 18, alignItems: "center" },
  fixedButtonText: { color: "white", fontSize: 16, fontWeight: "900" },
  dashboardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 8 },
  dashboardBox: { width: "48%", backgroundColor: "#F4F2EE", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#EFEAE2" },
  dashboardValue: { color: "#CE1126", fontSize: 19, fontWeight: "900" },
  dashboardLabel: { color: "#06251A", fontWeight: "800", marginTop: 5, fontSize: 12 },
  leadCard: { backgroundColor: "#F0F8F3", padding: 14, borderRadius: 16, marginBottom: 10 },
  leadTitle: { color: "#06251A", fontWeight: "900", fontSize: 16 },
  leadMeta: { color: "#555", fontWeight: "700", marginTop: 5 },
  chatAnnonceCard: { backgroundColor: "#F4F2EE", padding: 16, borderRadius: 18, marginBottom: 14 },
  chatAnnonceTitle: { color: "#06251A", fontSize: 19, fontWeight: "900" },
  chatAnnonceMeta: { color: "#6F7772", fontWeight: "700", marginTop: 6 },
  chatAnnoncePrice: { color: "#CE1126", fontWeight: "900", fontSize: 18, marginTop: 8 },
  chatInput: { minHeight: 150, textAlignVertical: "top" },
  messageCard: { backgroundColor: "#F4F2EE", padding: 14, borderRadius: 16, marginBottom: 10 },
  messageTitle: { color: "#06251A", fontWeight: "900" },
  messageText: { color: "#333", marginTop: 6, lineHeight: 20 },
  messageMeta: { color: "#6F7772", marginTop: 8, fontWeight: "700", fontSize: 12 },
  aiSuggestionText: { color: "#00843D", fontWeight: "900", fontSize: 15, marginTop: -4, marginBottom: 12 },
  launchBox: { backgroundColor: "#F0F8F3", borderRadius: 22, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: "#BFE8CF" },
  launchTitle: { color: "#06251A", fontSize: 22, fontWeight: "900", marginBottom: 10 },
  launchItem: { color: "#333", fontWeight: "800", marginTop: 7, lineHeight: 20 },
  apiPaymentBox: { backgroundColor: "#FFF7DB", borderRadius: 22, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: "#F7E7A6" },
  apiPaymentTitle: { color: "#06251A", fontSize: 21, fontWeight: "900", marginBottom: 8 },
  apiPaymentText: { color: "#333", fontWeight: "700", lineHeight: 22 },
  apiPaymentCode: { color: "#CE1126", fontWeight: "900", marginTop: 10 },
});
