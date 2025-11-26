import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@realm/react";

export default function BookScreen() {
  // Haal ALLE Logging-objecten op, gesorteerd op createdAt (desc)
  const loggings = useQuery("Logging", (collection) =>
    collection.sorted("createdAt", true) // true = descending
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voertuighistoriek</Text>

      <FlatList
        data={loggings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LoggingRow item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

function LoggingRow({ item }) {
  const dateStr = item.createdAt.toLocaleString(); // of eigen formaat

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.plate}>{item.nrpl}</Text>
        <Text style={styles.model}>
          {item.merk ?? "Onbekend"} {item.model ?? ""}
        </Text>
        <Text style={styles.meta}>VIN: {item.chassisnr ?? "-"}</Text>
      </View>
      <Text style={styles.date}>{dateStr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f3f3f3",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "flex-start",
  },
  plate: {
    fontSize: 16,
    fontWeight: "700",
  },
  model: {
    fontSize: 14,
    color: "#333",
  },
  meta: {
    fontSize: 12,
    color: "#666",
  },
  date: {
    marginLeft: 8,
    fontSize: 10,
    color: "#777",
  },
});


{  /* 
 Filter only a specific plate, sort by date:
  const filtered = useQuery("Logging", (collection) =>
  collection
    .filtered("nrpl == $0", "1-ABC-123")
    .sorted("createdAt", true)
);

Filter all that contain text (case-insensitive) + sort:
const search = "A1".toLowerCase();
const filtered = useQuery("Logging", (collection) =>
  collection
    .filtered("nrpl CONTAINS[c] $0", search)
    .sorted("createdAt", true)
);

  End of BookScreen.js */ }