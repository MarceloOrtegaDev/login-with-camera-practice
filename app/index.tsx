import CameraOption from "@/components/CameraOption";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 mt-8 justify-center items-center gap-4">
        <Text className="text-3xl font-bold">
            Bienvenido a la aplicación
        </Text>
        <View className="flex-row gap-2 items-center">
          <Text className="text-2xl">¿Tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => router.push("/login")} className="p-2 rounded-md bg-green-500" >
              <Text className="text-xl font-bold text-white">
                  Iniciar sesión
              </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-2 items-center">
          <Text className="text-2xl">¿Quieres registrarte?</Text>
          <TouchableOpacity onPress={() => router.push("/register")} className="p-2 rounded-md bg-red-600">
              <Text className="text-xl text-white font-bold">
                  Registrarme
              </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}
