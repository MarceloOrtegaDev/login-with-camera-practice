import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { loginFuncion } from "@/hooks/loginService";

export default function Login() {

    const {Controller, error, loading, onSubmit, photo, pickImage, router, control, handleSubmit} = loginFuncion()
  


  return (
    <View className="flex-1">
      <View className="flex-row mt-10 mx-2 gap-4 align-middle bg-gray-300 p-2 rounded-md">
        <TouchableOpacity
          className="bg-blue-600 p-2 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-xl text-yellow-100 font-bold">volver atras</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold mb-4 relative top-2">Login</Text>
      </View>

      <View className="flex-1 mt-8 justify-center items-center">
        <Text className="mb-2 font-bold text-2xl">
          Ingrese su CUIL para validar que es usted
        </Text>

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

        {/* Loading spinner */}
        {loading && <ActivityIndicator size="large" color="#0000ff" className="mb-3" />}

        {/* Botón iniciar sesión */}
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text className="text-white">Iniciar sesión</Text>
        </TouchableOpacity>

        {error && <Text className="text-red-500 mt-2">{error}</Text>}
      </View>
    </View>
  );
}

