import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Maison");

  const [city, setCity] = useState("Douala");
  const [quartier, setQuartier] = useState("");
  const [referencePoint, setReferencePoint] = useState("");

  const [agentName, setAgentName] = useState("");
  const [company, setCompany] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [surface, setSurface] = useState("");
  const [landSurface, setLandSurface] = useState("");

  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

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

  function removeAllImages() {
    Alert.alert(
      "Supprimer les images",
      "Veux-tu supprimer toutes les images sélectionnées ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => setImages([]),
        },
      ]
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
      !company ||
      !sellerPhone ||
      !price ||
      !description
    ) {
      Alert.alert(
        "Champs manquants",
        "Remplis : titre, type, ville, quartier, nom agent, compagnie, contact, prix et description."
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack}>
        <Text style={styles.back}>← Retour</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>Publier une annonce</Text>
        <Text style={styles.subtitle}>
          Ajoute les informations du bien. L’annonce sera vérifiée avant publication.
        </Text>

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

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.big]}
            placeholder="Titre de l’annonce"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Ville"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Quartier"
            value={quartier}
            onChangeText={setQuartier}
          />

          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Point de repère"
            value={referencePoint}
            onChangeText={setReferencePoint}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Nom de l’agent"
            value={agentName}
            onChangeText={setAgentName}
          />

          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Compagnie"
            value={company}
            onChangeText={setCompany}
          />

          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Contact"
            value={sellerPhone}
            onChangeText={setSellerPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Chambres"
            value={bedrooms}
            onChangeText={setBedrooms}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Douches"
            value={bathrooms}
            onChangeText={setBathrooms}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Surface m²"
            value={surface}
            onChangeText={setSurface}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Terrain m²"
            value={landSurface}
            onChangeText={setLandSurface}
            keyboardType="numeric"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Prix en FCFA"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description du bien"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.imageActions}>
          <Pressable style={styles.imageButton} onPress={pickImages}>
            <Text style={styles.imageText}>
              {images.length
                ? `Images sélectionnées (${images.length})`
                : "Ajouter des photos"}
            </Text>
          </Pressable>

          {images.length > 0 && (
            <Pressable style={styles.deleteAllButton} onPress={removeAllImages}>
              <Text style={styles.deleteAllText}>Tout supprimer</Text>
            </Pressable>
          )}
        </View>

        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <View key={index} style={styles.previewBox}>
                <Image source={{ uri: img }} style={styles.preview} />

                <Pressable
                  style={styles.deleteImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.deleteImageText}>×</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}

        <Pressable
          style={[styles.button, loading && styles.disabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Envoyer l’annonce</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F4",
    padding: 18,
  },

  back: {
    color: "#1F5C42",
    fontWeight: "900",
    marginBottom: 14,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#EDE6D6",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#06251A",
  },

  subtitle: {
    color: "#6B6B5F",
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  flex: {
    flex: 1,
  },

  big: {
    flex: 2,
  },

  small: {
    flex: 1,
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
    color: "white",
  },

  input: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EDE6D6",
    color: "#06251A",
  },

  textArea: {
    minHeight: 130,
    textAlignVertical: "top",
    marginBottom: 12,
  },

  imageActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  imageButton: {
    flex: 1,
    backgroundColor: "#F0D77A",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  imageText: {
    color: "#06251A",
    fontWeight: "900",
  },

  deleteAllButton: {
    backgroundColor: "#A84A3A",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteAllText: {
    color: "white",
    fontWeight: "900",
  },

  previewBox: {
    position: "relative",
    marginRight: 10,
    marginBottom: 14,
  },

  preview: {
    width: 130,
    height: 100,
    borderRadius: 16,
  },

  deleteImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#A84A3A",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteImageText: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#1F5C42",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});