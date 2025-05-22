
export interface Task {
    id: number;
    title: string;
    description?: string;
    deadline: string;
    sender_id: number;
    receiver_id?: number;
    task_state: TaskState;
    created_at: string;
}

export enum TaskState {
    PENDING = 0,
    COMPLETED = 1,
}

export interface TaskStats {
    totalTasks: number;
    acceptedTasks: number;
    completedTasks: number;
    pendingTasks: number;
    taskDistribution: { [userId: number]: number };
}