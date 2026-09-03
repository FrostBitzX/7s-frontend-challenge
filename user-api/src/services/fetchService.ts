import { DummyJsonUser, DummyJsonUsersResponse, User, mapDummyJsonUserToUser } from '../types/user';

const DUMMY_JSON_URL = 'https://dummyjson.com/users';
const PAGE_LIMIT = 30;

/**
 * Fetches a single page of users from DummyJSON.
 */
async function fetchPage(skip: number, limit: number = PAGE_LIMIT): Promise<DummyJsonUsersResponse> {
  const url = `${DUMMY_JSON_URL}?limit=${limit}&skip=${skip}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Upstream DummyJSON error: HTTP ${response.status} (${response.statusText})`);
  }

  return (await response.json()) as DummyJsonUsersResponse;
}

/**
 * Fetches all users from DummyJSON using concurrent pagination.
 * 1. Fetches first page to determine total user count.
 * 2. Fetches remaining pages in parallel via Promise.all.
 * 3. Maps and filters users to normalized User domain objects.
 */
export async function fetchAllUsers(): Promise<User[]> {
  // Step 1: Fetch initial page to inspect total
  const firstPage = await fetchPage(0, PAGE_LIMIT);
  const total = firstPage.total;
  const rawUsers: DummyJsonUser[] = [...firstPage.users];

  // Step 2: Concurrently fetch remaining pages if total exceeds first page
  if (total > PAGE_LIMIT) {
    const remainingOffsets: number[] = [];
    for (let skip = PAGE_LIMIT; skip < total; skip += PAGE_LIMIT) {
      remainingOffsets.push(skip);
    }

    const remainingPages = await Promise.all(
      remainingOffsets.map((skip) => fetchPage(skip, PAGE_LIMIT))
    );

    for (const page of remainingPages) {
      rawUsers.push(...page.users);
    }
  }

  // Step 3: Map to domain User objects, ignoring invalid/missing department records
  const validUsers: User[] = [];
  for (const raw of rawUsers) {
    const user = mapDummyJsonUserToUser(raw);
    if (user) {
      validUsers.push(user);
    }
  }

  return validUsers;
}
