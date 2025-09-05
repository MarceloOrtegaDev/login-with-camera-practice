import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Button from "@/components/Button";
import TabBar from "@/components/TabBar";

export default function Inicio() {
  const router = useRouter();
  return (
    <View className="flex-1">
      <View className="w-screen items-end bg-white">
        <TouchableOpacity onPress={() => router.push("/")} className="mt-8 mr-2 rounded-lg text-end px-4 py-2 bg-teal-400">
          <Text className="font-bold text-white">Cerrar sessión
          </Text>
        </TouchableOpacity>
      </View>
    <View className="flex-1">
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-3xl mb-4 font-bold">Bienvenido al home</Text>
        <Text className="font-bold text-xl text-center">Aplicación para escanear y guardar tus productos</Text>
      </View>
        <TabBar/>
    </View>
    </View>
  );
}
