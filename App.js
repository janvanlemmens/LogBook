// npx expo start --dev-client
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import LoginScreen from "./screens/LoginScreen";
import TabsNavigator from "./navigation/TabsNavigator"; // your existing tab navigation
import { RealmProvider } from "@realm/react";
import { Logging } from "./realm/Schemas";

const Stack = createNativeStackNavigator();

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AppStack({ onLogout }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp">
        {(props) => <TabsNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = async () => {
    // e.g. clear secure storage, tokens, etc.
    await SecureStore.deleteItemAsync("uname");
    await SecureStore.deleteItemAsync("token");
    setIsLoggedIn(false); // <- this switches to AuthStack
   
    //realm.delete(realm.objects("Orders"));
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RealmProvider schema={[Logging]}>
        <NavigationContainer>
          {isLoggedIn ? (
            <AppStack onLogout={handleLogout} />
          ) : (
            <AuthStack onLogin={handleLogin} />
          )}
        </NavigationContainer>
      </RealmProvider>
    </GestureHandlerRootView>
  );
}


