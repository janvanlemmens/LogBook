import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function VehicleForm({}) {
  const [form, setForm] = useState({
    licenseplate: "",
    vin: "",
    make: "",
    model: "",
    color: "",
    mileage: "",
    year: "",
  });

  const update = (key, value) => setForm({ ...form, [key]: value });

    const handleSave = () => {
    const vin = form.vin.trim();
    if (vin.length !== 17) {
      Alert.alert("Invalid VIN", "VIN must be exactly 17 characters long.");
      return;
    }

    if (!form.licenseplate || !form.make || !form.model) {
      Alert.alert("Missing data", "Please fill license plate, make and model.");
      return;
    }

    // You can send `form` to API / storage / parent component
    if (onSave) {
      onSave(form);
    }

    Alert.alert("Saved", "Vehicle data has been saved.");
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputRow}>
        <MaterialIcons name="directions-car" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="License Plate"
          value={form.licenseplate}
          onChangeText={(t) => update("licenseplate", t)}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcons name="confirmation-number" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="VIN Number"
          value={form.vin}
          onChangeText={(t) => update("vin", t)}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcons name="build" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Make"
          value={form.make}
          onChangeText={(t) => update("make", t)}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcons name="directions-car-filled" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Model"
          value={form.model}
          onChangeText={(t) => update("model", t)}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcons name="color-lens" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={form.color}
          onChangeText={(t) => update("color", t)}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcons name="speed" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Mileage"
          keyboardType="numeric"
          value={form.mileage}
          onChangeText={(t) => update("mileage", t)}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcons name="event" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Year"
          keyboardType="numeric"
          maxLength={4}
          value={form.year}
          onChangeText={(t) => update("year", t)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  formContainer: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});


{/*
function decodeVin(vin) {
  if (!vin || vin.length < 3) return { make: "", modelHint: "" };

  const wmi = vin.slice(0, 3).toUpperCase(); // World Manufacturer Identifier

  const wmiToMake = {
    WVW: "Volkswagen",
    WBA: "BMW",
    WDB: "Mercedes-Benz",
    WDC: "Mercedes-Benz",
    WAU: "Audi",
    VF1: "Renault",
    VF3: "Peugeot",
    VF7: "Citroën",
    VSS: "SEAT",
    VSK: "Nissan",
    JHM: "Honda",
    JHG: "Honda",
    JTD: "Toyota",
    JT2: "Toyota",
    1HG: "Honda",
    1FA: "Ford",
    1F1: "Subaru",
    3VW: "Volkswagen",
    SAL: "Land Rover",
    ZFA: "Fiat",
    ZFF: "Ferrari",
    YV1: "Volvo",
  };

  const make = wmiToMake[wmi] || "";

  // Model decoding needs a full VIN database or API,
  // so here we just return an empty hint or a generic text.
  const modelHint = make ? `Detected brand: ${make}` : "";

  return { make, modelHint };
}    
    
*/}