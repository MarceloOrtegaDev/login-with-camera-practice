import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraOptionProps {
  onBack: () => void; // función que se ejecuta al volver
}

export default function CameraOption({ onBack }: CameraOptionProps) {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
        <Button onPress={onBack} title="Volver al login" color="orange" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function handleScan() {
    // Simula la detección del rostro
    router.push('/home');
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'orange', marginLeft: 10 }]} onPress={onBack}>
            <Text style={styles.text}>Volver al login</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Botón simulado de scan */}
      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <Text style={styles.text}>Scanear y entrar al Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 100,
  },
  camera: {
    flex: 1,
    width: 400,
    height: 'auto',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scanButton: {
    marginTop: 2,
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'green',
    borderRadius: 8,
    alignItems: 'center',
  },
});
