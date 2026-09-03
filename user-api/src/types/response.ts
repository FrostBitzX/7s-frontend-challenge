export interface DepartmentGroup {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

export type DepartmentGroupResponse = Record<string, DepartmentGroup>;
