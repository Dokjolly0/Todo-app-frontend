export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: User | string;
  picture: User | string;
}
