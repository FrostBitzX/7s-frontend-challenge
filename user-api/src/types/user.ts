export interface DummyJsonHair {
  color: string;
  type: string;
}

export interface DummyJsonAddress {
  address?: string;
  city?: string;
  postalCode?: string;
  state?: string;
}

export interface DummyJsonCompany {
  department?: string;
  name?: string;
  title?: string;
}

export interface DummyJsonUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  hair?: DummyJsonHair;
  address?: DummyJsonAddress;
  company?: DummyJsonCompany;
}

export interface DummyJsonUsersResponse {
  users: DummyJsonUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  department: string;
  hairColor: string;
  postalCode: string;
}

export function mapDummyJsonUserToUser(raw: DummyJsonUser): User | null {
  const department = raw.company?.department?.trim();
  if (!department) {
    return null; // Skip users without a valid company department
  }

  return {
    id: raw.id,
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    age: Number(raw.age) || 0,
    gender: (raw.gender ?? '').toLowerCase(),
    department,
    hairColor: raw.hair?.color?.trim() || 'Unknown',
    postalCode: raw.address?.postalCode?.trim() || 'Unknown',
  };
}
