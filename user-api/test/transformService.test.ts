import { groupUsersByDepartment } from '../src/services/transformService';
import { User } from '../src/types/user';
import * as fc from 'fast-check';

describe('groupUsersByDepartment', () => {
  const sampleUsers: User[] = [
    {
      id: 1,
      firstName: 'Terry',
      lastName: 'Medhurst',
      age: 50,
      gender: 'male',
      department: 'Marketing',
      hairColor: 'Black',
      postalCode: '20020',
    },
    {
      id: 2,
      firstName: 'Sheldon',
      lastName: 'Quigley',
      age: 28,
      gender: 'male',
      department: 'Marketing',
      hairColor: 'Chestnut',
      postalCode: '40203',
    },
    {
      id: 3,
      firstName: 'Terrill',
      lastName: 'Hills',
      age: 38,
      gender: 'female',
      department: 'Marketing',
      hairColor: 'Black',
      postalCode: '95945',
    },
    {
      id: 4,
      firstName: 'Miles',
      lastName: 'Cummerata',
      age: 49,
      gender: 'male',
      department: 'Engineering',
      hairColor: 'Blond',
      postalCode: '37209',
    },
    {
      id: 5,
      firstName: 'Mavis',
      lastName: 'Schultz',
      age: 25,
      gender: 'female',
      department: 'Engineering',
      hairColor: 'Brown',
      postalCode: '40014',
    },
  ];

  it('should correctly group users by department', () => {
    const result = groupUsersByDepartment(sampleUsers);

    expect(Object.keys(result)).toEqual(expect.arrayContaining(['Marketing', 'Engineering']));
    expect(Object.keys(result)).toHaveLength(2);
  });

  it('should aggregate gender counts accurately', () => {
    const result = groupUsersByDepartment(sampleUsers);

    expect(result['Marketing'].male).toBe(2);
    expect(result['Marketing'].female).toBe(1);

    expect(result['Engineering'].male).toBe(1);
    expect(result['Engineering'].female).toBe(1);
  });

  it('should compute the correct min-max ageRange', () => {
    const result = groupUsersByDepartment(sampleUsers);

    // Marketing: ages are 50, 28, 38 -> min 28, max 50
    expect(result['Marketing'].ageRange).toBe('28-50');

    // Engineering: ages are 49, 25 -> min 25, max 49
    expect(result['Engineering'].ageRange).toBe('25-49');
  });

  it('should aggregate hair color frequencies correctly', () => {
    const result = groupUsersByDepartment(sampleUsers);

    expect(result['Marketing'].hair).toEqual({
      Black: 2,
      Chestnut: 1,
    });

    expect(result['Engineering'].hair).toEqual({
      Blond: 1,
      Brown: 1,
    });
  });

  it('should map addressUser with firstName+lastName as key and postalCode as value', () => {
    const result = groupUsersByDepartment(sampleUsers);

    expect(result['Marketing'].addressUser).toEqual({
      TerryMedhurst: '20020',
      SheldonQuigley: '40203',
      TerrillHills: '95945',
    });

    expect(result['Engineering'].addressUser).toEqual({
      MilesCummerata: '37209',
      MavisSchultz: '40014',
    });
  });

  it('should handle single user in a department', () => {
    const singleUser: User[] = [
      {
        id: 99,
        firstName: 'Solo',
        lastName: 'Developer',
        age: 30,
        gender: 'female',
        department: 'DevOps',
        hairColor: 'Red',
        postalCode: '10001',
      },
    ];

    const result = groupUsersByDepartment(singleUser);
    expect(result['DevOps']).toEqual({
      male: 0,
      female: 1,
      ageRange: '30-30',
      hair: { Red: 1 },
      addressUser: { SoloDeveloper: '10001' },
    });
  });

  // Property-based testing with fast-check
  describe('Property-based invariant checks', () => {
    const userArbitrary = fc.record({
      id: fc.integer({ min: 1, max: 10000 }),
      firstName: fc.stringMatching(/^[A-Z][a-z]{2,10}$/),
      lastName: fc.stringMatching(/^[A-Z][a-z]{2,10}$/),
      age: fc.integer({ min: 18, max: 90 }),
      gender: fc.constantFrom('male', 'female'),
      department: fc.constantFrom('Sales', 'Marketing', 'Engineering', 'HR', 'Support'),
      hairColor: fc.constantFrom('Black', 'Blond', 'Brown', 'Auburn', 'Chestnut'),
      postalCode: fc.stringMatching(/^\d{5}$/),
    });

    it('property: total male and female counts across departments equal input counts', () => {
      fc.assert(
        fc.property(fc.array(userArbitrary, { minLength: 1, maxLength: 50 }), (users) => {
          const result = groupUsersByDepartment(users);

          let totalMaleOutput = 0;
          let totalFemaleOutput = 0;

          for (const dept of Object.values(result)) {
            totalMaleOutput += dept.male;
            totalFemaleOutput += dept.female;
          }

          const expectedMale = users.filter((u) => u.gender === 'male').length;
          const expectedFemale = users.filter((u) => u.gender === 'female').length;

          return totalMaleOutput === expectedMale && totalFemaleOutput === expectedFemale;
        })
      );
    });

    it('property: all user address keys are preserved in their respective departments', () => {
      fc.assert(
        fc.property(fc.array(userArbitrary, { minLength: 1, maxLength: 40 }), (users) => {
          const result = groupUsersByDepartment(users);

          for (const user of users) {
            const dept = result[user.department];
            if (!dept) return false;
            const key = `${user.firstName}${user.lastName}`;
            if (!(key in dept.addressUser)) return false;
          }

          return true;
        })
      );
    });
  });
});
