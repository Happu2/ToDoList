// hooks/useTasks.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Task, Priority } from "../types/task";

import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import { db } from "../api/firebase";

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  addTask: (input: {
    title: string;
    description: string;
    deadline: number;
    priority: Priority;
  }) => Promise<void>;
  toggleComplete: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const priorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: Task[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: docSnap.id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt,
          deadline: data.deadline,
          priority: data.priority,
          completed: data.completed,
        });
      });

      // custom sort: incomplete first, then nearest deadline, then higher priority, then newest
      list.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.deadline !== b.deadline) return a.deadline - b.deadline;
        if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return b.createdAt - a.createdAt;
      });

      setTasks(list);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const addTask: TaskContextValue["addTask"] = async (input) => {
    if (!user) return;
    await addDoc(collection(db, "tasks"), {
      userId: user.uid,
      title: input.title,
      description: input.description,
      createdAt: Date.now(),
      deadline: input.deadline,
      priority: input.priority,
      completed: false,
    });
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, "tasks", id), { completed });
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, addTask, toggleComplete, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};
