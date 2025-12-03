// components/TaskCard.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Task } from "../types/task";
import { colors } from "../constants/colors";

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const priorityLabel: Record<Task["priority"], string> = {
  low: "🧊 Low",
  medium: "⚡ Medium",
  high: "🔥 High",
};

const TaskCard: React.FC<Props> = ({ task, onToggle, onDelete }) => {
  const deadline = new Date(task.deadline).toLocaleString();

  return (
    <View
      style={[
        styles.card,
        task.completed && { opacity: 0.5, borderColor: colors.accentSoft },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{task.title}</Text>
        {!!task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
        <Text style={styles.meta}>
          {priorityLabel[task.priority]} • Deadline: {deadline}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onToggle}>
          <Text style={styles.doneText}>{task.completed ? "Undo" : "Done"}</Text>
        </Pressable>
        <Pressable onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  meta: {
    color: colors.textMuted,
    marginTop: 6,
    fontSize: 12,
  },
  actions: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
  },
  doneText: {
    color: colors.accent,
    fontWeight: "600",
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "600",
  },
});

export default TaskCard;
