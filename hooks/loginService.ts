import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

interface FormValues {
  cuil: string;
}

export const loginFuncion = () => {
  const { control, handleSubmit } = useForm<FormValues>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [User, setUsuario] = useState<string | null>(null);

  const router = useRouter();

  // Recuperando mi cuil del asyncstorage
  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = await AsyncStorage.getItem("userRegistered");
      if (savedUser === "true") {
        const storedCUIL = await AsyncStorage.getItem("cuil");
        setUsuario(storedCUIL);
      }
    };
    fetchUser();
  }, []);

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

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("cuil", data.cuil);
    formData.append("image", {
      uri: photo,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch(
        "https://52ve8mm1q0ra.share.zrok.io/recognize",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "multipart/form-data",
            skip_zrok_interstitial: true,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        if (result.matches[0] === "unknown") {
          setError("Error al iniciar sesión: usuario no registrado");
        } else if (result.matches.includes(data.cuil)) {
          // Guardamos localmente que ya registró rostro y el CUIL
          await AsyncStorage.setItem("userRegistered", "true");
          await AsyncStorage.setItem("cuil", data.cuil);
          setError(null);
          setUsuario(data.cuil);
          console.log("Inicio de sesión exitoso", result);
          router.push("/home");
        } else {
          setError("El CUIL ingresado no coincide con la foto");
        }
      } else {
        setError(result.message || "Error en el inicio de sesión");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Revisa tu internet.");
    } finally {
      setLoading(false);
    }
  };

  return {
    router,
    Controller,
    pickImage,
    photo,
    loading,
    onSubmit,
    error,
    handleSubmit,
    control,
    User,
  };
};
