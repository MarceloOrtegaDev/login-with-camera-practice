import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
          <Text style={styles.text}>Permitir cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'orange', marginTop: 10 }]} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
          <Text style={styles.text}>Volver al login</Text>
        </TouchableOpacity>
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
            <MaterialIcons name="flip-camera-ios" size={24} color="white" />
            <Text style={styles.text}>Voltear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'orange', marginLeft: 10 }]} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
            <Text style={styles.text}>Volver</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Botón simulado de scan */}
      <TouchableOpacity style={[styles.button, styles.scanButton]} onPress={handleScan}>
        <MaterialIcons name="face" size={24} color="white" />
        <Text style={styles.text}>Scanear</Text>
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
    paddingBottom: 20,
    fontSize: 18,
  },
  camera: {
    flex: 1,
    width: 600,
    height: 'auto',
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    gap: 10,
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  scanButton: {
    position: 'relative',
    top: -39,
    backgroundColor: 'green',
  },
});
