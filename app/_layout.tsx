
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../hooks/useAuth";
import { TaskProvider } from "../hooks/useTasks";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TaskProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#020617" },
            headerTintColor: "#e5e7eb",
          }}
        />
      </TaskProvider>
    </AuthProvider>
  );
}
