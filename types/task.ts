// src/types/task.ts
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number;   // timestamp (ms)
  deadline: number;    // timestamp (ms)
  priority: Priority;
  completed: boolean;
}
