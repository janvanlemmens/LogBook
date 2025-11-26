import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const LoggingRow = ({ item, onPress, onEdit, selected }) => {
  return (
    <TouchableOpacity onPress={onPress}
      onLongPress={onEdit}
      delayLongPress={300}
    >
      <View style={[rowStyles.row, selected && rowStyles.rowSelected]}>
        <View>
  {/* 👉 Row of 4 equal fields */}
  <View style={rowStyles.topRow}>
    <View style={{ width : '20%' }}>
    <Text style={rowStyles.titleText}>{item.nrpl}</Text>
    </View>
     <View style={{ width : '30%' }}>
    <Text style={rowStyles.titleText}>{item.chassisnr}</Text>
    </View>
     <View style={{ width : '25%' }}>   
    <Text style={rowStyles.titleText}>{item.merk}</Text>
     </View>
        <View style={{ width : '25%' }}>
     <Text style={rowStyles.titleText}>{item.model}</Text>      
   </View>
  
  </View>

  {/* 👉 Only Hour */}
  <Text style={rowStyles.subtitleText}>
    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </Text>
</View>
      </View>
    </TouchableOpacity>
  );
};

const rowStyles = StyleSheet.create({
  row: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  rowSelected: {
    backgroundColor: "#e0f0ff",
  },
  titleText: {
    flex: 1,
    fontWeight: "600",
    fontSize: 16,
  },
  subtitleText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  topRow: {
    flexDirection: "row",
  },
});

export default LoggingRow;
