import Button from "@/components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import type { Nota } from "../index";

const STORAGE_KEY = "@notas_fotograficas";

export default function EditNota() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [imagenOriginal, setImagenOriginal] = useState<string>("");
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    cargarNota();
  }, [id]);

  const cargarNota = async () => {
    try {
      const notasGuardadas = await AsyncStorage.getItem(STORAGE_KEY);
      if (notasGuardadas) {
        const notas: Nota[] = JSON.parse(notasGuardadas);
        const nota = notas.find((n) => n.id === id);
        if (nota) {
          setTitulo(nota.titulo);
          setDescripcion(nota.descripcion);
          setImagenUri(nota.imagenUri);
          setImagenOriginal(nota.imagenUri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la nota");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tomarFoto = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permiso denegado", "Necesitas dar permiso para usar la cámara");
        return;
      }
    }
    setMostrarCamera(true);
  };

  const seleccionarImagen = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Necesitas dar permiso para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const capturarFoto = async (cameraRef: any) => {
    try {
      setGuardando(true);
      const photo = await cameraRef.takePictureAsync();
      setImagenUri(photo.uri);
      setMostrarCamera(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo capturar la foto");
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarNota = async () => {
    if (!titulo.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    if (!descripcion.trim()) {
      Alert.alert("Error", "La descripción es obligatoria");
      return;
    }

    if (!imagenUri) {
      Alert.alert("Error", "Debes tener una imagen");
      return;
    }

    setGuardando(true);

    try {
      const notasGuardadas = await AsyncStorage.getItem(STORAGE_KEY);
      const notas: Nota[] = notasGuardadas ? JSON.parse(notasGuardadas) : [];

      const notaIndex = notas.findIndex((n) => n.id === id);
      if (notaIndex !== -1) {
        notas[notaIndex] = {
          ...notas[notaIndex],
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          imagenUri,
          fechaModificacion: new Date().toISOString(),
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notas));

        Alert.alert("Éxito", "Nota actualizada correctamente", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la nota");
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2dd4bf" />
        <Text className="mt-4 text-gray-600">Cargando nota...</Text>
      </View>
    );
  }

  if (mostrarCamera) {
    return (
      <View className="flex-1">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        />

        <View className="absolute top-8 left-0 right-0 items-center" pointerEvents="none">
          <View className="bg-black bg-opacity-70 px-4 py-2 rounded-lg">
            <Text className="text-white text-center font-bold">
              Captura la nueva imagen
            </Text>
          </View>
        </View>

        <View className="absolute bottom-8 left-0 right-0 items-center flex-row justify-around px-8">
          <TouchableOpacity
            onPress={() => setMostrarCamera(false)}
            className="bg-red-300 p-4 rounded-full"
          >
            <MaterialIcons name="close" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => capturarFoto(cameraRef.current)}
            disabled={guardando}
            className="bg-teal-400 p-6 rounded-full"
          >
            {guardando ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <MaterialIcons name="camera" size={40} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4 mt-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <MaterialIcons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Editar Nota</Text>
        </View>

        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="font-bold text-lg mb-3">Imagen</Text>

          {imagenUri && (
            <View>
              <Image
                source={{ uri: imagenUri }}
                className="w-full h-64 rounded-lg mb-3"
                resizeMode="cover"
              />
              <View className="gap-2">
                <Button
                  text="Tomar Nueva Foto"
                  colorBg="bg-teal-400"
                  colorText="text-white"
                  font="font-bold"
                  onPress={tomarFoto}
                />
                <Button
                  text="Seleccionar de Galería"
                  colorBg="bg-blue-300"
                  colorText="text-white"
                  font="font-bold"
                  onPress={seleccionarImagen}
                />
                {imagenUri !== imagenOriginal && (
                  <Button
                    text="Restaurar imagen original"
                    colorBg="bg-gray-300"
                    colorText="text-black"
                    onPress={() => setImagenUri(imagenOriginal)}
                  />
                )}
              </View>
            </View>
          )}
        </View>

        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="font-bold text-lg mb-3">Información</Text>

          <Text className="font-semibold mb-2">Título *</Text>
          <TextInput
            placeholder="Ingresa el título de la nota"
            value={titulo}
            onChangeText={setTitulo}
            className="bg-gray-100 border border-gray-300 p-3 rounded-lg mb-4"
          />

          <Text className="font-semibold mb-2">Descripción *</Text>
          <TextInput
            placeholder="Describe tu nota..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-gray-100 border border-gray-300 p-3 rounded-lg mb-4"
          />
        </View>

        <View className="mb-8">
          <Button
            text={guardando ? "Guardando..." : "Guardar Cambios"}
            colorBg="bg-teal-400"
            colorText="text-white"
            font="font-bold"
            textSize="text-lg"
            onPress={actualizarNota}
            disabled={guardando}
          />
        </View>
      </ScrollView>
    </View>
  );
}
