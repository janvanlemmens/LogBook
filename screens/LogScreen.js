import {
  Camera,
  CameraView,
  CameraType,
} from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View, Modal} from "react-native";
import { Image } from "expo-image";
import CustomPressable from "../components/CustomPressable";
import { extractTextFromImage, isSupported } from "expo-text-extractor";
import OcrView from "../components/OcrView";
import VehicleForm from "../components/VehicleForm";

const LogScreen = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [imagel, setImagel] = useState(null);
  const [imagev, setImagev] = useState(null);
  const cameraRef = useRef(null);
  const [type, setType] = useState('back');   
  const [flash, setFlash] = useState('off');
  const [lines, setLines] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

 useEffect(() => {
  (async () => {
    const mediaResp = await MediaLibrary.requestPermissionsAsync();
    console.log('media status:', mediaResp.status);

    const camResp = await Camera.requestCameraPermissionsAsync();
    console.log('camera status:', camResp.status);

    setCameraPermission(camResp.status); // or camResp.status === 'granted'
  })();
}, []);
  
 if (cameraPermission === null) {
    // Permission request is still in progress
    return <View />;
  }
  if (cameraPermission === false) {
    // Permission was denied
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={async () => {
            const camResp = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(camResp.status);
          }}
          title="grant permission"
        />
      </View>
    );
  }

  {/*
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
    */}

    const handleSelect = (text) => {
      alert(`You selected: ${text}`);
      setModalVisible(false);
    }

    const extracttext = async (imageUri) => {
    console.log("IMAGE URI:", imageUri);

  if (!imageUri) {
    alert("No image selected!");
    return;
  }

  if (!isSupported) {
    alert("Text extraction is NOT supported on this device.");
    return;
  }

  try {
    // pass the string, not an object
    const lines = await extractTextFromImage(imageUri); // lines: string[]
  
    setLines(lines);
   setModalVisible(true);
  } catch (error) {
    console.error("Error extracting text:", error);
    alert("Failed to extract text from image.");
  }
};
  

  return (
     <View style={styles.container}>
      
      {/* LEFT COLUMN */}
      <View style={styles.leftColumn}>

        {/* Top Row */}
        <View style={styles.topBox}>
           <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={type}   // 'back' or 'front'
            flash={flash}   // 'off' | 'on' | 'auto' | 'torch'
          >
           
          </CameraView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
            <CustomPressable
              text="LicensePlate"
              icon="camera"
              onPress={async () => {
                if (cameraRef.current) {
                  const photo = await cameraRef.current.takePictureAsync();
                  setImagel(photo.uri);
                  // Save to media library
                  const asset = await MediaLibrary.createAssetAsync(photo.uri);
                  console.log('Photo saved to media library:', asset.uri);
                  extracttext(photo.uri);
                }
              }}
            />
            <CustomPressable
              text="VinNumber"
              icon="camera"
              onPress={async () => {
                if (cameraRef.current) {
                  const photo = await cameraRef.current.takePictureAsync();
                  setImagev(photo.uri);
                  // Save to media library
                  const asset = await MediaLibrary.createAssetAsync(photo.uri);
                  console.log('Photo saved to media library:', asset.uri);
                }
              }}
            />


            {/*
            <CustomPressable
              text="Flip"
              onPress={() => {
                setType((current) =>
                  current === 'back' ? 'front' : 'back'
                );
              }}
            />
            */}
            
            <CustomPressable
              text="Flash"
              icon="flash"
              onPress={() => {
                setFlash((current) =>
                  current === 'off' ? 'on' : 'off'
                );
              }}
            />  
          </View>
        </View>

       
        {/* Bottom Row Split into 2 Equal Columns */}
        <View style={styles.bottomRow}>
         <View style={styles.bottomLeft}>
       {imagel && (
         <Image
         source={{ uri: imagel }}
         style={styles.previewImage}
          contentFit="cover"   // expo-image prop
         />
       )}
</View>
          <View style={styles.bottomRight} >
            {imagel && (
         <Image
         source={{ uri: imagev }}
         style={styles.previewImage}
          contentFit="cover"   // expo-image prop
         />
       )}
          </View>
        </View>

      </View>

      {/* RIGHT COLUMN */}
      <View style={styles.rightColumn} >
        <VehicleForm />
       </View>
        {/* Modal for selecting a line */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Tap a line to select</Text>

            <OcrView lines={lines} onSelectLine={handleSelect} />

            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default LogScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightgray',
  },
  leftColumn: {
    flex: 1,
  },
  topBox: {
    flex: 8,
  },
  bottomRow: {
    flex:5,
    flexDirection: 'row'
  },
  bottomLeft: {
    flex: 1,
    backgroundColor: 'gold',
  },
  previewImage: {
  width: '100%',
  height: '100%',
},
  bottomRight: {
    flex: 1,
   
  },
  rightColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
});

{/*
  {lines.length > 0 && (
                <OcrView lines={lines} onSelectLine={handleSelect} />
              )} 
  */}
