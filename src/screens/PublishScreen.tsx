import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import PublishBasicInfo from "../components/publish/PublishBasicInfo";
import PublishContactInfo from "../components/publish/PublishContactInfo";
import PublishImages from "../components/publish/PublishImages";
import PublishLocationInfo from "../components/publish/PublishLocationInfo";
import PublishPriceInfo from "../components/publish/PublishPriceInfo";
import PrimaryButton from "../components/shared/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { storage } from "../services/firebase";
import { createProperty } from "../services/propertyService";

type Props = {
  onBack: () => void;
};

export function PublishScreen({ onBack }: Props) {
  const { user, profile, isAdmin, isAgency } = useAuth();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [purpose, setPurpose] = useState<"Vente" | "Location">("Vente");
  const [type, setType] = useState("Maison");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [city, setCity] = useState("Douala");
  const [quartier, setQuartier] = useState("");
  const [referencePoint, setReferencePoint] = useState("");

  const [price, setPrice] = useState("");
  const [surface, setSurface] = useState("");
  const [landSurface, setLandSurface] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const [agentName, setAgentName] = useState(profile?.name || "");
  const [company, setCompany] = useState("");
  const [sellerPhone, setSellerPhone] = useState(profile?.phone || "");

  async function pickImages() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission refusée", "Autorise l’accès aux photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((current) => [...current, ...selectedImages]);
    }
  }

  function removeImage(indexToRemove: number) {
    setImages((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );
  }

  async function uploadImages() {
    if (!user) return [];

    const urls: string[] = [];

    for (const uri of images) {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileName = `annonces/${user.uid}/${Date.now()}-${Math.random()}.jpg`;
      const imageRef = ref(storage, fileName);

      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);

      urls.push(url);
    }

    return urls;
  }

  async function handleSubmit() {
    if (!user) {
      Alert.alert("Connexion requise", "Connecte-toi pour publier.");
      return;
    }

    if (
      !title ||
      !type ||
      !city ||
      !quartier ||
      !agentName ||
      !sellerPhone ||
      !price ||
      !description
    ) {
      Alert.alert(
        "Champs manquants",
        "Remplis : titre, type, ville, quartier, agent, contact, prix et description."
      );
      return;
    }

    try {
      setLoading(true);

      const imageUrls = await uploadImages();

      await createProperty(
        {
          purpose,
          title: title.trim(),
          type: type.trim(),

          city: city.trim(),
          quartier: quartier.trim(),
          reference: referencePoint.trim(),

          agentName: agentName.trim(),
          company: company.trim(),

          bedrooms: bedrooms.trim(),
          bathrooms: bathrooms.trim(),
          surface: surface.trim(),
          landSurface: landSurface.trim(),

          price: price.trim(),
          description: description.trim(),

          sellerName: agentName.trim() || profile?.name || "Agent",
          sellerPhone: sellerPhone.trim(),

          images: imageUrls,

          ownerId: user.uid,
          ownerEmail: user.email || "",
        },
        isAdmin || isAgency
      );

      Alert.alert(
        "Succès",
        isAdmin || isAgency
          ? "Annonce publiée avec succès."
          : "Annonce envoyée. Elle sera visible après validation admin."
      );

      onBack();
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Erreur publication"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={onBack}>
        <Text style={styles.back}>← Retour</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Publier une annonce</Text>
        <Text style={styles.subtitle}>
          Ajoute les informations du bien. L’annonce sera vérifiée avant
          publication.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.smallTitle}>Type d’annonce</Text>

        <View style={styles.row}>
          <Pressable
            style={[styles.segment, purpose === "Vente" && styles.segmentActive]}
            onPress={() => setPurpose("Vente")}
          >
            <Text
              style={[
                styles.segmentText,
                purpose === "Vente" && styles.segmentTextActive,
              ]}
            >
              Vente
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segment,
              purpose === "Location" && styles.segmentActive,
            ]}
            onPress={() => setPurpose("Location")}
          >
            <Text
              style={[
                styles.segmentText,
                purpose === "Location" && styles.segmentTextActive,
              ]}
            >
              Location
            </Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Type de bien</Text>
        <TextInput
          style={styles.input}
          placeholder="Maison, Appartement, Terrain..."
          placeholderTextColor="#7A807C"
          value={type}
          onChangeText={setType}
        />
      </View>

      <PublishBasicInfo
        title={title}
        description={description}
        type={type}
        purpose={purpose}
        onChangeTitle={setTitle}
        onChangeDescription={setDescription}
      />

      <PublishLocationInfo
        city={city}
        neighborhood={quartier}
        address={referencePoint}
        onChangeCity={setCity}
        onChangeNeighborhood={setQuartier}
        onChangeAddress={setReferencePoint}
      />

      <PublishPriceInfo
        price={price}
        surface={surface}
        bedrooms={bedrooms}
        bathrooms={bathrooms}
        onChangePrice={setPrice}
        onChangeSurface={setSurface}
        onChangeBedrooms={setBedrooms}
        onChangeBathrooms={setBathrooms}
      />

      <View style={styles.card}>
        <Text style={styles.smallTitle}>Terrain / complément</Text>

        <Text style={styles.label}>Surface terrain (m²)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 500"
          placeholderTextColor="#7A807C"
          value={landSurface}
          onChangeText={setLandSurface}
          keyboardType="numeric"
        />
      </View>

      <PublishImages
        images={images}
        onAddImage={pickImages}
        onRemoveImage={removeImage}
      />

      <PublishContactInfo
        name={agentName}
        phone={sellerPhone}
        email={user?.email || ""}
        onChangeName={setAgentName}
        onChangePhone={setSellerPhone}
      />

      <View style={styles.card}>
        <Text style={styles.smallTitle}>Agence / Compagnie</Text>

        <Text style={styles.label}>Nom de l’agence</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Empire Camer Immo"
          placeholderTextColor="#7A807C"
          value={company}
          onChangeText={setCompany}
        />
      </View>

      <View style={styles.submitBox}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#1F5C42" />
            <Text style={styles.loadingText}>Publication en cours...</Text>
          </View>
        ) : (
          <PrimaryButton title="Envoyer l’annonce" onPress={handleSubmit} />
        )}
      </View>
    </ScrollView>
  );
}

export default PublishScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F4",
  },

  content: {
    padding: 18,
    paddingBottom: 90,
  },

  back: {
    color: "#1F5C42",
    fontWeight: "900",
    marginBottom: 14,
    fontSize: 16,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#06251A",
  },

  subtitle: {
    color: "#6B6B5F",
    fontWeight: "700",
    marginTop: 8,
    lineHeight: 22,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 18,
  },

  smallTitle: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  segment: {
    flex: 1,
    backgroundColor: "#F6F1E6",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDE6D6",
  },

  segmentActive: {
    backgroundColor: "#1F5C42",
    borderColor: "#1F5C42",
  },

  segmentText: {
    color: "#06251A",
    fontWeight: "900",
  },

  segmentTextActive: {
    color: "#FFFFFF",
  },

  label: {
    color: "#06251A",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },

  input: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#F7F8F6",
    borderWidth: 1,
    borderColor: "#E3EAE6",
    paddingHorizontal: 16,
    color: "#06251A",
    fontSize: 15,
    fontWeight: "700",
    outlineStyle: "none" as any,
  },

  submitBox: {
    marginTop: 4,
    marginBottom: 30,
  },

  loadingBox: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "#EAF4EF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  loadingText: {
    color: "#1F5C42",
    fontWeight: "900",
  },
});