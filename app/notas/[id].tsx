import Button from "@/components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import type { Nota } from "./index";

const STORAGE_KEY = "@notas_fotograficas";

export default function NotaDetalle() {
  const [nota, setNota] = useState<Nota | null>(null);
  const [loading, setLoading] = useState(true);
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
        const notaEncontrada = notas.find((n) => n.id === id);
        setNota(notaEncontrada || null);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la nota");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarNota = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta nota? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const notasGuardadas = await AsyncStorage.getItem(STORAGE_KEY);
              if (notasGuardadas) {
                const notas: Nota[] = JSON.parse(notasGuardadas);
                const notasActualizadas = notas.filter((n) => n.id !== id);
                await AsyncStorage.setItem(
                  STORAGE_KEY,
                  JSON.stringify(notasActualizadas)
                );
                Alert.alert("Éxito", "Nota eliminada correctamente", [
                  { text: "OK", onPress: () => router.back() },
                ]);
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la nota");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2dd4bf" />
        <Text className="mt-4 text-gray-600">Cargando nota...</Text>
      </View>
    );
  }

  if (!nota) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialIcons name="error-outline" size={80} color="#ccc" />
        <Text className="text-xl text-gray-600 mt-4">Nota no encontrada</Text>
        <Button
          text="Volver"
          colorBg="bg-teal-400"
          colorText="text-white"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        {/* Header con navegación */}
        <View className="bg-white p-4 flex-row justify-between items-center shadow">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/notas/edit/${nota.id}` as any)}>
            <MaterialIcons name="edit" size={28} color="#2dd4bf" />
          </TouchableOpacity>
        </View>

        {/* Imagen principal */}
        <Image
          source={{ uri: nota.imagenUri }}
          className="w-full h-80"
          resizeMode="cover"
        />

        {/* Contenido de la nota */}
        <View className="p-4">
          {/* Título */}
          <Text className="text-3xl font-bold mb-2">{nota.titulo}</Text>

          {/* Fechas */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="access-time" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">
                Creada: {formatearFecha(nota.fechaCreacion)}
              </Text>
            </View>
            {nota.fechaModificacion !== nota.fechaCreacion && (
              <View className="flex-row items-center">
                <MaterialIcons name="update" size={16} color="#666" />
                <Text className="text-gray-600 text-sm ml-2">
                  Modificada: {formatearFecha(nota.fechaModificacion)}
                </Text>
              </View>
            )}
          </View>

          {/* Descripción */}
          <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="font-bold text-lg mb-2">Descripción</Text>
            <Text className="text-gray-700 text-base leading-6">
              {nota.descripcion}
            </Text>
          </View>

          {/* Botón eliminar */}
          <View className="mb-8">
            <Button
              text="Eliminar Nota"
              colorBg="bg-red-300"
              colorText="text-white"
              font="font-bold"
              textSize="text-lg"
              onPress={eliminarNota}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
