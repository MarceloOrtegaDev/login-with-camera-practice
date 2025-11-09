import Button from "@/components/Button";
import TabBar from "@/components/TabBar";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TextInput, View } from "react-native";

interface Producto {
  id: string;
  nombre: string;
  precio?: string;
}

export default function Index() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [scanning, setScanning] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [codigoActual, setCodigoActual] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No hay permiso para usar la cámara</Text>
        <Button text="Dar permiso" onPress={requestPermission} colorBg="bg-blue-300" colorText="text-white" />
      </View>
    );
  }

  const handleAdd = () => {
    if (!codigoActual) return;
    setLoading(true);
    setTimeout(() => {
      const nuevo: Producto = { id: codigoActual, nombre, precio };
      setProductos([...productos, nuevo]);
      setNombre("");
      setPrecio("");
      setCodigoActual(null);
      setScanning(false);
      setLoading(false);
      Alert.alert("Éxito", "Producto agregado correctamente");
    }, 500);
  };

  const handleEdit = () => {
    if (!editando) return;
    setLoading(true);
    setTimeout(() => {
      setProductos(productos.map(p => p.id === editando.id ? { ...p, nombre, precio } : p));
      setEditando(null);
      setNombre("");
      setPrecio("");
      setLoading(false);
      Alert.alert("Editado", "Producto modificado correctamente");
    }, 500);
  };

  const handleDelete = (id: string) => {
    setProductos(productos.filter(p => p.id !== id));
    Alert.alert("Eliminado", "Producto eliminado correctamente");
  };

  return (
    <View className="flex-1">
      <View className="flex-1 p-4 bg-gray-100 mt-4">
        <Text className="text-xl font-bold mb-4">Gestión de Productos</Text>

        {loading && (
          <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-30 z-50">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {scanning ? (
          <View className="flex-1 relative">
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              onBarcodeScanned={({ data }) => {
                setScanLoading(true);
                setTimeout(() => {
                  setCodigoActual(data);
                  setScanLoading(false);
                  setScanning(false);
                }, 800);
              }}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "ean13", "code128", "code39", "code93", "ean8", "upc_a", "upc_e"],
              }}
            />
                  
            <View className="absolute inset-0 justify-center items-center" pointerEvents="none">
              <View className="w-64 h-64 border-4 border-white rounded-lg opacity-70">
                <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400" />
                <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400" />
                <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400" />
                <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400" />
              </View>
            </View>

            {!scanLoading && (
              <View className="absolute top-8 left-0 right-0 items-center" pointerEvents="none">
                <View className="bg-black bg-opacity-70 px-4 py-2 rounded-lg">
                  <Text className="text-white text-center font-bold">
                    Apunta la cámara hacia el código de barras
                  </Text>
                </View>
              </View>
            )}

            {scanLoading && (
              <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-60" pointerEvents="none">
                <View className="bg-black bg-opacity-90 p-6 rounded-lg items-center">
                  <ActivityIndicator size="large" color="#00ff00" />
                  <Text className="text-green-400 text-lg font-bold mt-4">Escaneando código...</Text>
                </View>
              </View>
            )}

            <View className="absolute bottom-8 left-0 right-0 items-center">
              <Button 
                text="Cancelar escaneo" 
                colorBg="bg-red-300" 
                colorText="text-white"
                font="font-bold"
                onPress={() => {
                  setScanning(false);
                  setScanLoading(false);
                }}
              />
            </View>
          </View>
        ) : (
          <>
            {codigoActual && (
              <>
                <Text>Código: {codigoActual}</Text>
                <TextInput
                  placeholder="Nombre del producto"
                  value={nombre}
                  onChangeText={setNombre}
                  className="bg-white border p-2 rounded mb-3"
                />
                <TextInput
                  placeholder="Precio"
                  value={precio}
                  onChangeText={setPrecio}
                  keyboardType="numeric"
                  className="bg-white border p-2 rounded mb-3"
                />
                <Button colorText="text-white" font="font-bold" textSize="text-lg" text="Guardar Producto" onPress={handleAdd} />
              </>
            )}

            {editando && !codigoActual && (
              <>
                <TextInput
                  placeholder="Nombre del producto"
                  value={nombre}
                  onChangeText={setNombre}
                  className="bg-white border p-2 rounded mb-3"
                />
                <TextInput
                  placeholder="Precio"
                  value={precio}
                  onChangeText={setPrecio}
                  keyboardType="numeric"
                  className="bg-white border p-2 rounded mb-3"
                />
                <Button text="Guardar Cambios" onPress={handleEdit} />
              </>
            )}

            {productos.length === 0 ? <Text>Aún no hay productos..</Text> :
            <FlatList
            data={productos}
            keyExtractor={(item, index) => item.id + index.toString()}
            renderItem={({ item }) => (
                <View className="flex-r justify-between bg-white p-3 mb-2 gap-1 rounded">
                <View className="gap-4 p-2">
                    <Text className="font-bold text-xl">{item.nombre}</Text>
                    {item.precio && <Text>Precio: ${item.precio}</Text>}
                </View>
                <View className="flex-row gap-2 justify-end">
                    <Button
                    colorBg="bg-yellow-300"
                    colorText="text-black"
                    font="font-bold"
                    text="Modificar"
                    onPress={() => {
                      setEditando(item);
                      setNombre(item.nombre);
                      setPrecio(item.precio || "");
                    }}
                    />
                    <Button
                    text="Eliminar"
                    colorBg="bg-gray-800"
                    colorText="text-white"
                    font="font-bold"
                    onPress={() => handleDelete(item.id)}
                    />
                </View>
                  <View className="mt-4 items-end">
                      <Text className="text-xs font-bold">Código de producto: {item.id}</Text>
                  </View>
                </View>
            )}
            />
        }

          </>
        )}
      </View>
        {!codigoActual && !editando && (
        <View className="mb-3 mx-16 p-2 flex-row items-center rounded-md justify-center bg-black ">
            <Ionicons name="qr-code-sharp" size={35} color={"white"}/>
            <Button textSize="text-2xl" colorBg="bg-black" colorText="text-white" text="Escanear producto" onPress={() => setScanning(true)} />
        </View>
        )}
        <TabBar />
    </View>
  );
}
