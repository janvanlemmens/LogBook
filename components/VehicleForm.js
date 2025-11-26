import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function VehicleForm({
  onSave,
  parlicenseplate = "",
  parvin = "",
  onReset,
}) {
  const [form, setForm] = useState({
    licenseplate: "",
    vin: "",
    make: "",
    model: "",
    color: "",
    mileage: "",
    year: "",
  });

  const [lastDecodedVin, setLastDecodedVin] = useState(null);
  const isValid =
  form.vin.trim().length === 17 &&
  form.licenseplate.trim().length > 0 &&
  form.make.trim().length > 0 &&
  form.model.trim().length > 0;

  // 🔹 User typing / local updates
  const update = (key, rawValue) => {
  let value = rawValue;
  if (key === "vin" || key === "licenseplate") {
    value = rawValue.replace(/[^A-Za-z0-9]/g, "");
  }
  console.log("prev",form);
  console.log("updating",key,"to",value);
  setForm(prev => ({ ...prev, [key]: value }));
};



  // 🔹 Sync props (from parent) into form, but only when they change
  useEffect(() => {
    const cleanLp =
      (parlicenseplate || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const cleanVin = (parvin || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    setForm((prev) => {
      const next = { ...prev };

      // only update if non-empty and actually changed
      if (cleanLp && cleanLp !== prev.licenseplate) {
        next.licenseplate = cleanLp;
      }
      if (cleanVin && cleanVin !== prev.vin) {
        next.vin = cleanVin;
      }

      return next;
    });
  }, [parlicenseplate, parvin]);

  // 🔍 Debug log: what vin is REALLY in state
  // useEffect(() => {
  //   console.log(
  //     "VIN in state (effect):",
  //     JSON.stringify(form.vin),
  //     "length:",
  //     form.vin.length
  //   );
  //   console.log("parvin",parvin)
  // }, [form.vin]);

  //VIN decode when VIN hits 17 chars and is new
  useEffect(() => {
    const vin = form.vin.trim();
    if (vin.length !== 17 || vin === lastDecodedVin) return;

    setLastDecodedVin(vin);
    console.log("VIN changed, attempting to decode:", vin);

    const fetchVehicleData = async () => {
      try {
        const res = await fetch(`https://db.vin/api/v1/vin/${vin}`);
        const data = await res.json();
        console.log("VIN decode data:", data);

        setForm((prev) => ({
          ...prev,
          make: data.brand || prev.make,
          model: data.model || prev.model,
          year: String(data.year || prev.year),
          color: data.color || prev.color,
        }));
      } catch (err) {
        console.error("Error decoding VIN:", err);
      }
    };

    fetchVehicleData();
  }, [form.vin, lastDecodedVin]);

  const handleSave = () => {
  console.log("HANDLE_SAVE: start");

  const vin = form.vin.trim();
  if (vin.length !== 17) {
    //console.log("HANDLE_SAVE: invalid VIN:", vin);
    Alert.alert("Invalid VIN", "VIN must be exactly 17 characters long.");
    return;
  }

  if (!form.licenseplate || !form.make || !form.model) {
    //console.log("HANDLE_SAVE: missing fields:", form);
    Alert.alert("Missing data", "Please fill license plate, make and model.");
    return;
  }

  //console.log("HANDLE_SAVE: Saving vehicle data:", form);

  if (onSave) {
    try {
      //console.log("HANDLE_SAVE: calling onSave");
      onSave(form);
    } catch (e) {
      console.error("HANDLE_SAVE: Error in onSave:", e);
    }
  }

  //aAlert.alert("HANDLE_SAVE: Saved", "Vehicle data has been sssaved (from VehicleForm).");
};


  const resetForm = () => {
    setForm({
      licenseplate: "",
      vin: "",
      make: "",
      model: "",
      color: "",
      mileage: "",
      year: "",
    });
    setLastDecodedVin(null);

    if (onReset) onReset(); // parent can also clear its selectedLicense/selectedVin
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputRow}>
        <MaterialIcons name="directions-car" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="License Plate"
          value={form.licenseplate}
          autoCapitalize="characters"
          onChangeText={(t) => update("licenseplate", t)}
        />
      </View>

      <View style={styles.inputRow}>
        <MaterialIcons name="confirmation-number" size={22} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="VIN Number"
          value={form.vin}
          autoCapitalize="characters"
          maxLength={17}
          onChangeText={(t) => update("vin", t)}
        />
      </View>

      <Text
        style={{
          textAlign: "right",
          fontSize: 12,
          marginTop: -8,
          marginBottom: 10,
          color: form.vin.length === 17 ? "green" : "red",
        }}
      >
        {form.vin.length}/17
      </Text>

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

      <View
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <Pressable
        //disabled={!isValid}
          onPress={handleSave}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1.0 },
            styles.saveButton,
          ]}
        >
          <MaterialIcons name="save" size={22} color="#fff" />
          <Text style={styles.saveButtonText}>Save Vehicle</Text>
        </Pressable>
        <Pressable
          onPress={resetForm}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1.0 },
            styles.saveButton,
          ]}
        >
          <MaterialIcons name="refresh" size={22} color="#fff" />
          <Text style={styles.saveButtonText}>Clear form</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
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
  saveButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e86de",
    paddingVertical: 6,
    borderRadius: 10,
    gap: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
