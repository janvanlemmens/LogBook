import React, { useState, useMemo } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useQuery } from "@realm/react";
import LoggingRow from "../components/LoggingRow";
import VehicleForm from "../components/VehicleForm";

// type Logging = { id: string; createdAt: Date; licenseImage: string; vinImage: string; ... }

export default function BookScreen() {
    // date shown in the center (start at today)
  const [displayedDate, setDisplayedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    return today;
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);  
  
  const handleEdit = (item) => {
  setEditingItem(item);
  setEditModalVisible(true);
};

const closeEditModal = () => {
  setEditModalVisible(false);
  setEditingItem(null);
};

  const startOfDay = useMemo(() => {
    const d = new Date(displayedDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [displayedDate]);

  const endOfDay = useMemo(() => {
    const d = new Date(displayedDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [displayedDate]);

  // ONLY loggings for that day
  const allLoggings = useQuery("Logging");

const loggings = useMemo(
  () =>
    allLoggings
      .filtered("createdAt >= $0 AND createdAt <= $1", startOfDay, endOfDay)
      .sorted("createdAt", true),
  [allLoggings, startOfDay, endOfDay]
);



  const changeDay = (delta) => {
    setDisplayedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta);
      return d;
    });
  };

  const [selectedId, setSelectedId] = useState(null);

  // Find the selected item
  const selectedItem = useMemo(
    () => loggings.find((l) => l.id === selectedId) ?? loggings[0],
    [loggings, selectedId]
  );

  return (
    <View style={styles.container}>
      {/* HEADER with arrows & date */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => changeDay(-1)}
          style={styles.navButton}
        >
          <Text style={styles.navText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.headerDate}>
          {displayedDate.toLocaleDateString(undefined, {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>

        <TouchableOpacity
          onPress={() => changeDay(1)}
          style={styles.navButton}
        >
          <Text style={styles.navText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* EDIT MODAL */}
    <Modal
  visible={isEditModalVisible}
  animationType="fade"
  transparent={true}        // 👈 THIS is the key!
  onRequestClose={closeEditModal}
>
  <TouchableOpacity 
  style={styles.modalOverlay}
  activeOpacity={1}
  onPress={closeEditModal}
>
  <TouchableOpacity
    activeOpacity={1}
    style={styles.modalBox}
  >
    <VehicleForm logging={editingItem} onClose={closeEditModal} />
  </TouchableOpacity>
</TouchableOpacity>


</Modal>


      {/* 2 columns: left = list, right = images */}
      <View style={styles.contentRow}>
        {/* LEFT COLUMN: FlatList */}
        <View style={styles.leftColumn}>
          <FlatList
            data={loggings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <LoggingRow
                item={item}
                onPress={() => setSelectedId(item.id)}
                selected={item.id === selectedItem?.id}
                onEdit={() => handleEdit(item)} 
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>

        {/* RIGHT COLUMN: Images of selected row */}
        <View style={styles.rightColumn}>
          {selectedItem ? (
            <>
             <View style={{ height: '45%' , marginBottom: 20}}>
              <Text style={styles.rightTitle}>LicensePlate</Text>
              <Image
                source={{ uri: selectedItem.urilicenseplate }}
                style={styles.image}
                resizeMode="cover"
              />
              </View>
              <View style={{ height: '35%', marginTop: 30 }}>
              <Text style={styles.imageLabel}>VIN</Text>
              <Image
                source={{ uri: selectedItem.urivin }}
                style={styles.image}
                resizeMode="cover"
              />
              </View>
            </>
          ) : (
            <Text style={styles.placeholderText}>
              Selecteer een rij links om de beelden te zien.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
 header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 25,
    fontWeight: "600",
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  headerDate: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentRow: {
    flex: 1,
    flexDirection: "row",
  },
  leftColumn: {
    flex: 3,
    marginRight: 8,
  },
  rightColumn: {
    flex: 2,
    padding: 8,
    
    borderRadius: 8,
    justifyContent: "flex-start",
  },
  separator: {
    height: 8,
  },
  rightTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    
    marginBottom: 4,
  },
  imageLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // dark transparent backdrop
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "60%",            // 👈 60% of screen width
    height: "80%",           // 👈 80% of screen height
    backgroundColor: "transparent", // transparent to show VehicleForm's own background
    borderRadius: 12,
    padding: 16,
    //elevation: 10,           // Android shadow
    shadowColor: "#000",     // iOS shadow
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "center",
    alignItems: "center",
  },
});


{  /* --- 
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <VehicleForm
        logging={editingItem}
        onClose={closeEditModal}
      />
    </View>
  </View>
   --- */}