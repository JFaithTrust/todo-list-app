export interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  category?: string;
  column: string;
}