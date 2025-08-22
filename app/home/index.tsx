import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Inicio() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl mb-4">Bienvenido al home</Text>
      
      <Image
        source={{
          uri: "https://img.wattpad.com/7fcab6371bc6dfdfd6a3db966e05b0ba7d68b288/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f334d7436346f36726965477933673d3d2d38342e313634343164346437333931396135343133323437333237393330322e6a7067?s=fit&w=720&h=720",
        }}
        style={{ width: 200, height: 200, borderRadius: 16 }}
      />
      <TouchableOpacity onPress={() => router.push("/")} className="mt-4 bg-white border-2 px-4 py-2 rounded">
        <Text className="font-bold">Cerrar sessión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
