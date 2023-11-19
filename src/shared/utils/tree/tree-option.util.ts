export interface TreeOption<T extends object> {
  id: keyof T;
  children: keyof T;
}
