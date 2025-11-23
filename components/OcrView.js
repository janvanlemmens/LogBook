import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";

export default function OcrView({ lines, onSelectLine }) {
  const [selected, setSelected] = useState(null);
  console.log("Extracted2 lines:", lines);

  return (
    <View style={{ padding: 10 }}>
      {lines.map((text, index) => (
        <Pressable
          key={index}
          onPress={() => onSelectLine?.(text)}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            backgroundColor: selected === text ? "#cce5ff" : "transparent",
            borderRadius: 5,
          }}
        >
          <Text style={{ fontSize: 16 }}>{text}</Text>
        </Pressable>
      ))}
    </View>
  );
}
