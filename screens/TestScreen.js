import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function TestScreen() {
  const handleSave = () => {
    console.log("Save pressed");
    Alert.alert("Saved", "Vehicle data has been saved.");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <MaterialIcons name="save" size={22} color="#fff" />
        <Text style={styles.saveButtonText}>Save Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e86de",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});
