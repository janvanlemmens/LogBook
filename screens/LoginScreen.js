import { 
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform, } from 'react-native'
import React, { useState, useEffect } from 'react';
import DeviceInfo from "react-native-device-info";
import CustomPressable from '../components/CustomPressable';
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState("");
  const [checkingToken, setCheckingToken] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {   
    const fetchDeviceInfo = async () => {
      const brand = DeviceInfo.getBrand();
      const model = DeviceInfo.getModel();
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();Ò
      setBrand(brand);
       console.log(`Running on: ${brand} ${model} (${systemName} ${systemVersion})`);
    };
    fetchDeviceInfo();
    let isMounted = true;
    // verify token if exists
    const verifyToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
         const res = await axios.get(`${apiUrl}?func=verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!isMounted) return;

        console.log("response", res.data);
        if (res.data?.success) {
          // Eventueel state/storage bijwerken met profielinfo
          if (res.data.uname)
            await SecureStore.setItemAsync("uname", res.data.uname);
          if (res.data.depot)
            await SecureStore.setItemAsync("depot", res.data.depot);
          onLogin(); // -> direct door naar app
          return;
        } else {
          // Ongeldig token opruimen
          await SecureStore.deleteItemAsync("token");
        }
      }
      setCheckingToken(false);
    };
    
    verifyToken();
  }, []);

  const handleLogin = async () => {   

     if (!username || !password) {
      Alert.alert("Missing Fields", "Please enter both username and password");
      return;
    }
    setLoading(true);

     try {
      const response = await axios.post(
        apiUrl + "?func=login",
        {
          user: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assume response contains { success: true } if login is valid

      if (response.data.success) {
        await SecureStore.setItemAsync("depot", response.data.depot);
        await SecureStore.setItemAsync("brand", brand);
        await SecureStore.setItemAsync("uname", response.data.uname);
        await SecureStore.setItemAsync("token", response.data.token);
       onLogin(); // navigate to the main app
      } else {
        Alert.alert(
          "Login Failed",
          response.data.message || "Invalid credentials"
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Server error or network issue"
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingToken) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
     <View style={styles.container}>
      
        <View style={styles.form}>
          <Text style={styles.title}>LogBook</Text>
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <CustomPressable
              text="Login"
              borderRadius={18}
              hoverColor="#0EA371" // only on web
              onPress={handleLogin}
            />
          )}
        </View>
     
    </View>
     </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: { 
  flex: 1, 
  flexDirection: 'row',
  alignItems: 'center',     // centers vertically (add if needed)
  justifyContent: 'center', // centers horizontally
},
  title: { fontSize: 32, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  form: {
  
    justifyContent: "center",
    padding: 16,
    width: "60%",
    alignSelf: "center",
   
  },
})