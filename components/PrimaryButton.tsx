// components/PrimaryButton.tsx
import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../constants/colors";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ title, onPress, loading }) => {
  return (
    <Pressable
      onPress={loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !loading && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#0f172a" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  text: {
    color: "#0f172a",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PrimaryButton;
