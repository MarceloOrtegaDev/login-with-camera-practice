import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Button from "./Button";

export default function TabBar() {
    const router = useRouter()
  return (
    <View className="w-screen flex-row justify-around items-center bg-white border-1 py-3 shadow-xl mb-10">
      <Button
        text="Home"
        textSize="text-xl"
        colorBg="bg-teal-400"
        colorText="text-white"
        font="font-bold"
        onPress={() => router.push("/home")}
        />
        <Button
          text="Mis Notas"
          textSize="text-xl"
          colorBg="bg-teal-400"
          colorText="text-white"
          font="font-bold"
          onPress={() => router.push("/notas" as any)}
          />
    </View>
  );
}
