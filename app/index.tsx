// app/index.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../constants/colors";

export default function TaskListScreen() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, toggleComplete, deleteTask } =
    useTasks();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading]);

  if (authLoading || (!user && authLoading)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>Hi, {user.email}</Text>
        <PrimaryButton title="Logout" onPress={logout} />
      </View>

      {tasksLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={() => toggleComplete(item.id, !item.completed)}
              onDelete={() => deleteTask(item.id)}
            />
          )}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
        />
      )}

      <View style={styles.fabWrapper}>
        <PrimaryButton
          title="Add Task"
          onPress={() => router.push("/add-task")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  topBar: {
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  fabWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
