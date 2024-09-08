import { User } from './user.entity';

export interface Todo {
  id?: string;
  title: string;
  creationDate?: Date | string;
  dueDate?: Date | string;
  completed: Boolean;
  expired?: Boolean;
  createdBy?: User;
  assignedTo?: User;
}
