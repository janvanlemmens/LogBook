import {
  Camera,
  CameraView,
  CameraType,
} from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import CustomPressable from "../components/CustomPressable";
import { extractTextFromImage, isSupported } from "expo-text-extractor";
import OcrView from "../components/OcrView";

const LogScreen = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [imagel, setImagel] = useState(null);
  const [imagev, setImagev] = useState(null);
  const cameraRef = useRef(null);
  const [type, setType] = useState('back');   
  const [flash, setFlash] = useState('off');
  const [lines, setLines] = useState([]);

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
    console.log("Extracted1 lines:", lines);
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
              <Button title="Test" onPress={() => {
                if (!imagel) return alert("No image selected");
                  extracttext(imagel);
              }} />
              {lines.length > 0 && (
                <OcrView lines={lines} onSelectLine={handleSelect} />
              )}
          </View>
        </View>

        {/* Middle Row */}
        <View style={{ flex: 2, backgroundColor: 'lightgrey' }}>
          <View>
            <Text>Middle Row - Info / Logs</Text>
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
          <View style={styles.bottomRight} />
        </View>

      </View>

      {/* RIGHT COLUMN */}
      <View style={styles.rightColumn} />

    </View>
  )
}

export default LogScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  leftColumn: {
    flex: 1,
  },
  topBox: {
    flex: 8,
    backgroundColor: 'tomato',
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
    backgroundColor: 'yellowgreen',
  },
  rightColumn: {
    flex: 1,
    backgroundColor: 'skyblue'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  }
});
