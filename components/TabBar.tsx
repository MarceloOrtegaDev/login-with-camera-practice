import { View } from "react-native";
import React from "react";
import Button from "./Button";
import { useRouter } from "expo-router";

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
          text="Productos"
          textSize="text-xl"
          colorBg="bg-teal-400"
          colorText="text-white"
          font="font-bold"
          onPress={() => router.push("/productos")}
          />
      <Button
        text="prox.."
        textSize="text-xl"
        colorBg="bg-teal-400"
        colorText="text-white"
        font="font-bold"
        onPress={() => console.log("...")}
        />
      <Button
        text="prox.."
        textSize="text-xl"
        colorBg="bg-teal-400"
        colorText="text-white"
        font="font-bold"
        onPress={() => console.log("...")}
        />
    </View>
  );
}
