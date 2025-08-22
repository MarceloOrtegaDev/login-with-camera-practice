import CameraOption from "@/components/CameraOption";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface User {
  user: string;
  email: string;
  password: string;
}

const usuario: User = {
  user: "marcelo",
  email: "machelo@gmail.com",
  password: "123456",
};

interface FormValues {
  email: string;
  password: string;
}

export default function Index() {
  const { control, handleSubmit } = useForm<FormValues>();
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

const onSubmit = (data: FormValues) => {
  const emailUsuario = data.email.trim().toLowerCase();
  const passwordUsuario = data.password.trim();

  if (emailUsuario === usuario.email.toLowerCase() && passwordUsuario === usuario.password) {
    setError(false);
    console.log("acá");
    router.push("/home");
  } else {
    setError(true);
  }
};



  return (
    <View className="flex-1 mt-8 justify-center items-center">
      <Text className="text-xl font-bold mb-4">Login</Text>

      {!showCamera ? (
        <>
          {/* Input email */}
          <Controller
            control={control}
            name="email"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="w-64 bg-white p-2 rounded mb-3"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Input password */}
          <Controller
            control={control}
            name="password"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="w-64 bg-white p-2 rounded mb-3"
                placeholder="Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Botón Login */}
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white">Ingresar</Text>
          </TouchableOpacity>

          {error && (
            <Text className="text-white mt-2">Credenciales incorrectas</Text>
          )}

          {/* Botón alternativo para usar cámara */}
          <TouchableOpacity
            className="bg-green-600 px-4 py-2 rounded mt-4"
            onPress={() => setShowCamera(true)}
          >
            <Text className="text-white">Login con detección facial</Text>
          </TouchableOpacity>
        </>
      ) : (
        <CameraOption onBack={() => setShowCamera(false)} />
      )}
    </View>
  );
}
