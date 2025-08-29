import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

interface FormValues {
  cuil: string;
}

export default function Register() {
  const { control, handleSubmit } = useForm<FormValues>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!photo) {
      setError("Debes seleccionar una foto");
      return;
    }

    const formData = new FormData();
    formData.append("cuil", data.cuil);
    formData.append("image", {
      uri: photo,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any); // 'as any' para TypeScript

    try {
      const response = await fetch("https://52ve8mm1q0ra.share.zrok.io/register", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          skip_zrok_interstitial: true
          
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setError(null);
        console.log("Registro exitoso", result);
      } else {
        setError(result.message || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    }
  };

  return (
    <View className="flex-1">
        <View className="flex-row mt-10 mx-2 gap-4 align-middle bg-gray-300 p-2 rounded-md">
            <TouchableOpacity className="bg-blue-600  p-2 rounded-xl" onPress={()=> router.back()}>
                <Text className="text-xl text-yellow-100 font-bold">volver atras</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold mb-4 relative top-2">Registro</Text>
        </View>

    <View className="flex-1 mt-8 justify-center items-center">
    <Text className=" mb-2 font-bold text-2xl">Ingrese su cuil</Text>
      {/* Input CUIL */}
      <Controller
        control={control}
        name="cuil"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
            <TextInput
            className="w-64 bg-white p-2 rounded mb-3"
            placeholder="00-00000000-0"
            value={value}
            onChangeText={onChange}
            />
        )}
      />

      {/* Botón seleccionar foto */}
      <TouchableOpacity
        className="bg-green-600 px-4 py-2 rounded mb-3"
        onPress={pickImage}
        >
        <Text className="text-white">Seleccionar Foto</Text>
      </TouchableOpacity>

      {/* Vista previa */}
      {photo && <Image source={{ uri: photo }} className="w-32 h-32 mb-3" />}

      {/* Botón Registrar */}
      <TouchableOpacity
        className="bg-blue-600 px-4 py-2 rounded"
        onPress={handleSubmit(onSubmit)}
        >
        <Text className="text-white">Registrarse</Text>
      </TouchableOpacity>

      {error && <Text className="text-red-500 mt-2">{error}</Text>}
    </View>
    </View>
  );
}
