import { User } from '../types/user';
import { DepartmentGroup, DepartmentGroupResponse } from '../types/response';

interface DepartmentAccumulator {
  male: number;
  female: number;
  minAge: number;
  maxAge: number;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

/**
 * Transforms a list of users into a DepartmentGroupResponse.
 * Executes in a single pass O(n) time complexity.
 */
export function groupUsersByDepartment(users: User[]): DepartmentGroupResponse {
  const accumulatorMap = new Map<string, DepartmentAccumulator>();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const dept = user.department;

    let acc = accumulatorMap.get(dept);
    if (!acc) {
      acc = {
        male: 0,
        female: 0,
        minAge: user.age,
        maxAge: user.age,
        hair: {},
        addressUser: {},
      };
      accumulatorMap.set(dept, acc);
    }

    // 1. Update gender count (supports case-insensitive check)
    if (user.gender === 'male') {
      acc.male += 1;
    } else if (user.gender === 'female') {
      acc.female += 1;
    }

    // 2. Track min and max age
    if (user.age < acc.minAge) {
      acc.minAge = user.age;
    }
    if (user.age > acc.maxAge) {
      acc.maxAge = user.age;
    }

    // 3. Increment hair color frequency
    const hairColor = user.hairColor || 'Unknown';
    acc.hair[hairColor] = (acc.hair[hairColor] || 0) + 1;

    // 4. Map "firstNameLastName" to postalCode
    const userKey = `${user.firstName}${user.lastName}`;
    acc.addressUser[userKey] = user.postalCode;
  }

  // Convert accumulator into final response format with formatted ageRange
  const result: DepartmentGroupResponse = {};

  for (const [dept, acc] of accumulatorMap.entries()) {
    result[dept] = {
      male: acc.male,
      female: acc.female,
      ageRange: `${acc.minAge}-${acc.maxAge}`,
      hair: acc.hair,
      addressUser: acc.addressUser,
    };
  }

  return result;
}
