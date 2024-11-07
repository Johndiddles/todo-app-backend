export interface ITask {
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  createdBy?: string;
  assignedTo?: string;
  tags?: string[];
  sharedWith?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
