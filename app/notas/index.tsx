import TabBar from "@/components/TabBar";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export interface Nota {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUri: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

const STORAGE_KEY = "@notas_fotograficas";

export default function NotasIndex() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar notas desde AsyncStorage
  const cargarNotas = async () => {
    try {
      const notasGuardadas = await AsyncStorage.getItem(STORAGE_KEY);
      if (notasGuardadas) {
        setNotas(JSON.parse(notasGuardadas));
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las notas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Recargar notas cada vez que la pantalla gana el foco
  useFocusEffect(
    useCallback(() => {
      cargarNotas();
    }, [])
  );

  useEffect(() => {
    cargarNotas();
  }, []);

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Cargando notas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-1 p-4 bg-gray-100 mt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Mis Notas Fotográficas</Text>
          <TouchableOpacity
            onPress={() => router.push("/notas/create" as any)}
            className="bg-teal-400 p-3 rounded-full"
          >
            <MaterialIcons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {notas.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="photo-library" size={80} color="#ccc" />
            <Text className="text-lg text-gray-500 mt-4 text-center">
              Aún no hay notas fotográficas
            </Text>
            <Text className="text-gray-400 mt-2 text-center px-8">
              Toca el botón + para crear tu primera nota con foto
            </Text>
          </View>
        ) : (
          <FlatList
            data={notas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/notas/${item.id}` as any)}
                className="bg-white p-3 mb-3 rounded-lg shadow flex-row"
              >
                {/* Miniatura de la imagen */}
                <Image
                  source={{ uri: item.imagenUri }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />

                {/* Información de la nota */}
                <View className="flex-1 ml-3 justify-center">
                  <Text className="font-bold text-lg" numberOfLines={1}>
                    {item.titulo}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
                    {item.descripcion}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-2">
                    {formatearFecha(item.fechaModificacion)}
                  </Text>
                </View>

                {/* Icono de flecha */}
                <View className="justify-center">
                  <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <TabBar />
    </View>
  );
}
