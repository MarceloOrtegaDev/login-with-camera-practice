import { Text, TouchableOpacity } from "react-native";
import React from "react";

type TextSize = "text-sm" | "text-md" | "text-lg" | "text-xl";
type Color = "text-blue-300" | "text-white" | "text-red-300" | "text-black" | "text-yellow-500" | "text-green-300" | "text-gray-800";
type ColorBg = "bg-blue-300" | "bg-white" | "bg-red-300" | "bg-black" | "bg-yellow-300" | "bg-green-300" | "bg-gray-800" | "bg-teal-400"; 
type Font = "font-bold" | "font-semibold" | "font-light";

interface ButtonProps {
  text: string;
  textSize?: TextSize;
  colorBg?: ColorBg;
  colorText?: Color;
  font?: Font;
  onPress?: () => void;
}

export default function Button({
  text,
  textSize = "text-sm",
  colorBg = "bg-green-300",    
  colorText = "text-black", 
  font = "font-bold",       
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`${colorBg} px-4 py-2 rounded items-center`}
      onPress={onPress}
    >
      <Text className={`${colorText} ${font} ${textSize}`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
