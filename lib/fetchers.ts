import { leetcodeFallback } from "@/content/profile";

export type LeetCodeStats = {
  totalSolved: number;
  ranking: number;
  updated: string;
  stale: boolean;
};

const LEETCODE_QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

export async function getLeetCodeStats(): Promise<LeetCodeStats> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username: "Aditya1Ahlawat" },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`LeetCode fetch failed: ${res.status}`);

    const json = await res.json();
    const all = json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum?.find(
      (e: { difficulty: string }) => e.difficulty === "All"
    );

    if (!all) throw new Error("Unexpected LeetCode response shape");

    return {
      totalSolved: all.count,
      ranking: leetcodeFallback.ranking,
      updated: new Date().toISOString().slice(0, 10),
      stale: false,
    };
  } catch {
    return { ...leetcodeFallback, stale: true };
  }
}
