import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@realm/react";

export default function HistoryWithSearch() {
  const [search, setSearch] = useState("");

  const loggings = useQuery("Logging", (collection) => {
    let q = collection;

    const term = search.trim();
    if (term.length > 0) {
      // Filter op nummerplaat, case-insensitive
      q = q.filtered("nrpl CONTAINS[c] $0", term);
    }

    // Nieuwste eerst
    return q.sorted("createdAt", true);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voertuighistoriek</Text>

      {/* 🔍 Zoekveld */}
      <TextInput
        style={styles.searchInput}
        placeholder="Zoek op nummerplaat (bv. 1-ABC-123)"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      <FlatList
        data={loggings}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <LoggingRow item={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Geen resultaten{search ? ` voor "${search}"` : ""}.
          </Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

function LoggingRow({ item }) {
  const dateStr = item.createdAt.toLocaleString();

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.plate}>{item.nrpl}</Text>
        <Text style={styles.model}>
          {(item.merk || "Onbekend") + (item.model ? ` ${item.model}` : "")}
        </Text>
        {item.chassisnr ? (
          <Text style={styles.meta}>VIN: {item.chassisnr}</Text>
        ) : null}
      </View>
      <Text style={styles.date}>{dateStr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 6,
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
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: "#777",
    fontStyle: "italic",
  },
});
