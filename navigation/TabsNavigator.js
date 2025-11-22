import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import LogScreen from "../screens/LogScreen";
import BookScreen from "../screens/BookScreen";

const Tab = createBottomTabNavigator();

function withIconTitle(title, iconName) {
  return () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons name={iconName} size={22} style={{ marginRight: 6 }} />
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{title}</Text>
    </View>
  );
}

const HeaderUsername = ({ name }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Ionicons name="person-circle-outline" size={20} />
    <Text style={{ marginLeft: 6 }}>{name}</Text>
  </View>
);

const HeaderMenu = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
 
  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="ellipsis-vertical" size={20} />
      </TouchableOpacity>

      {open && (
        <View
          style={{
            position: "absolute",
            top: 28,
            right: 0,
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            minWidth: 160,
          
          }}
        >
          <TouchableOpacity
          style={styles.button}
            onPress={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
          
           
        </View>
      ) }
     
    </View>
  );
};


export default function TabsNavigator({ onLogout }) {

     const [uname, setUname] = useState(null);

     useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const usr = await SecureStore.getItemAsync("uname");
        if (mounted) setUname(usr ?? ""); // fallback to empty string if not set
      } catch (e) {
        if (mounted) setUname(""); // avoid staying null on error
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (uname === null) {
    // show nothing or a tiny loader while we fetch
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center", // titel centreren
        headerLeft: () => <HeaderUsername name={uname} />, // uiterst links
        headerLeftContainerStyle: { paddingLeft: 12 },
        headerRight: () => <HeaderMenu onLogout={onLogout} />, // uiterst rechts
        headerRightContainerStyle: { paddingRight: 12 },
        tabBarActiveTintColor: "#333",
      }}
    >
        <Tab.Group>
             <Tab.Screen
             name="Log"
             component={LogScreen}
             options={{
            headerTitle: withIconTitle("Log", "camera-outline"),
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="camera-outline" color={focused ? "#c96161ff" : "#333"} size={size} />
            ),
             }}
             />
             <Tab.Screen
             name="Book"
             component={BookScreen}
             options={{
            headerTitle: withIconTitle("Book", "book-outline"),
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name="book-outline" color={focused ? "#c96161ff" : "#333"} size={size} />
            ),
             }}
             />
        </Tab.Group>
        </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
    container: {
    padding: 16, // optional padding for the whole group
  },
  button: {
    backgroundColor: "#e0e0e0", // light grey
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12, // vertical space between buttons
  },
  buttonText: {
    fontSize: 16, // bigger text
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
})