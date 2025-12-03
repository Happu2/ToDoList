// app/add-task.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTasks } from "../hooks/useTasks";
import { Priority } from "../types/task";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../constants/colors";

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineText, setDeadlineText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSave = () => {
    if (!title.trim() || !deadlineText.trim()) {
      Alert.alert("Missing fields", "Title and deadline are required");
      return;
    }

    const deadline = new Date(deadlineText).getTime();
    if (Number.isNaN(deadline)) {
      Alert.alert("Invalid date", "Use format YYYY-MM-DD HH:MM");
      return;
    }

    // ✅ Fire-and-forget write to Firestore
    addTask({
      title: title.trim(),
      description: description.trim(),
      deadline,
      priority,
    }).catch((err: any) => {
      console.log("Add task error", err);
      Alert.alert(
        "Failed to add task",
        err?.message ?? "Something went wrong while saving the task."
      );
    });

    // ✅ Immediately go back to task list
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>New task</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Description"
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Deadline (YYYY-MM-DD HH:MM)"
          placeholderTextColor={colors.textMuted}
          value={deadlineText}
          onChangeText={setDeadlineText}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {(["low", "medium", "high"] as Priority[]).map((p) => (
            <Text
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityChip,
                priority === p && styles.priorityChipActive,
              ]}
            >
              {p.toUpperCase()}
            </Text>
          ))}
        </View>

        {/* 🔥 No loading prop here */}
        <PrimaryButton title="Save task" onPress={handleSave} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, padding: 24, paddingTop: 40 },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#0b1120",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.textPrimary,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  priorityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    color: colors.textSecondary,
    fontSize: 12,
  },
  priorityChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    color: "#0f172a",
    fontWeight: "600",
  },
});
