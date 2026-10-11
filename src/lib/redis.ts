/**
 * Redis Sorted Set & Real-Time Ranking Client for PrepSmart
 *
 * Provides high-performance Redis Sorted Set operations (ZADD, ZINCRBY, ZRANGE, ZREVRANK, ZSCORE).
 * Features:
 * - Upstash Redis REST integration when UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are set.
 * - In-memory fallback Sorted Set with globalThis persistence for local testing without external servers.
 * - Fail-safe error handling and zero crash on network/credentials issues.
 */

interface SortedSetEntry {
  member: string;
  score: number;
}

class InMemorySortedSet {
  private sets: Map<string, Map<string, number>> = new Map();

  private getSet(key: string): Map<string, number> {
    if (!this.sets.has(key)) {
      this.sets.set(key, new Map());
    }
    return this.sets.get(key)!;
  }

  async zadd(key: string, member: string, score: number): Promise<number> {
    const set = this.getSet(key);
    const isNew = !set.has(member);
    set.set(member, score);
    return isNew ? 1 : 0;
  }

  async zincrby(key: string, increment: number, member: string): Promise<number> {
    const set = this.getSet(key);
    const current = set.get(member) ?? 0;
    const newScore = current + increment;
    set.set(member, newScore);
    return newScore;
  }

  async zrangeWithScores(
    key: string,
    start: number,
    stop: number,
    rev = false
  ): Promise<SortedSetEntry[]> {
    const set = this.getSet(key);
    const entries: SortedSetEntry[] = Array.from(set.entries()).map(
      ([member, score]) => ({ member, score })
    );

    // Sort descending if rev, ascending otherwise
    entries.sort((a, b) => (rev ? b.score - a.score : a.score - b.score));

    // Handle python/redis style negative index
    const len = entries.length;
    const actualStart = start < 0 ? Math.max(0, len + start) : start;
    const actualStop = stop < 0 ? Math.max(0, len + stop) : stop;

    return entries.slice(actualStart, actualStop + 1);
  }

  async zrevrank(key: string, member: string): Promise<number | null> {
    const set = this.getSet(key);
    if (!set.has(member)) return null;

    const entries = Array.from(set.entries()).sort((a, b) => b[1] - a[1]);
    const index = entries.findIndex(([m]) => m === member);
    return index >= 0 ? index : null;
  }

  async zscore(key: string, member: string): Promise<number | null> {
    const set = this.getSet(key);
    return set.get(member) ?? null;
  }
}

class PrepSmartRedisClient {
  private url?: string;
  private token?: string;
  private inMemory: InMemorySortedSet;

  constructor() {
    this.url = process.env.UPSTASH_REDIS_REST_URL;
    this.token = process.env.UPSTASH_REDIS_REST_TOKEN;

    const globalForMem = globalThis as unknown as {
      __prepSmartRedisMem?: InMemorySortedSet;
    };
    if (!globalForMem.__prepSmartRedisMem) {
      globalForMem.__prepSmartRedisMem = new InMemorySortedSet();
    }
    this.inMemory = globalForMem.__prepSmartRedisMem;
  }

  private hasUpstash(): boolean {
    return !!(this.url && this.token);
  }

  private async fetchUpstash(command: (string | number)[]): Promise<any> {
    if (!this.url || !this.token) return null;

    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });

    if (!res.ok) {
      throw new Error(`Upstash error HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    return data.result;
  }

  /**
   * Add or update member score in a sorted set
   */
  async zadd(key: string, score: number, member: string): Promise<number> {
    // Keep in-memory cache synchronized as immediate fallback
    await this.inMemory.zadd(key, member, score);

    if (this.hasUpstash()) {
      try {
        const result = await this.fetchUpstash(["ZADD", key, score, member]);
        return Number(result);
      } catch (err) {
        console.warn("Upstash ZADD failed, in-memory updated:", err);
      }
    }
    return 1;
  }

  /**
   * Increment member score by increment in a sorted set
   */
  async zincrby(key: string, increment: number, member: string): Promise<number> {
    const memScore = await this.inMemory.zincrby(key, increment, member);

    if (this.hasUpstash()) {
      try {
        const result = await this.fetchUpstash(["ZINCRBY", key, increment, member]);
        return Number(result);
      } catch (err) {
        console.warn("Upstash ZINCRBY failed, in-memory updated:", err);
      }
    }
    return memScore;
  }

  /**
   * Get ranked entries with scores (supports rev=true for highest-first)
   */
  async zrevrangeWithScores(
    key: string,
    start: number,
    stop: number
  ): Promise<SortedSetEntry[]> {
    if (this.hasUpstash()) {
      try {
        // ZRANGE key start stop REV WITHSCORES returns ["member1", "score1", "member2", "score2", ...]
        const result = await this.fetchUpstash([
          "ZRANGE",
          key,
          start,
          stop,
          "REV",
          "WITHSCORES",
        ]);

        if (Array.isArray(result) && result.length > 0) {
          const entries: SortedSetEntry[] = [];
          for (let i = 0; i < result.length; i += 2) {
            entries.push({
              member: String(result[i]),
              score: Number(result[i + 1]),
            });
          }
          return entries;
        }
      } catch (err) {
        console.warn("Upstash ZRANGE failed, falling back to in-memory:", err);
      }
    }

    return this.inMemory.zrangeWithScores(key, start, stop, true);
  }

  /**
   * Get 0-indexed rank of member in descending order (0 = 1st place)
   */
  async zrevrank(key: string, member: string): Promise<number | null> {
    if (this.hasUpstash()) {
      try {
        const result = await this.fetchUpstash(["ZREVRANK", key, member]);
        return result !== null && result !== undefined ? Number(result) : null;
      } catch (err) {
        console.warn("Upstash ZREVRANK failed, using in-memory:", err);
      }
    }

    return this.inMemory.zrevrank(key, member);
  }

  /**
   * Get member score
   */
  async zscore(key: string, member: string): Promise<number | null> {
    if (this.hasUpstash()) {
      try {
        const result = await this.fetchUpstash(["ZSCORE", key, member]);
        return result !== null && result !== undefined ? Number(result) : null;
      } catch (err) {
        console.warn("Upstash ZSCORE failed, using in-memory:", err);
      }
    }

    return this.inMemory.zscore(key, member);
  }
}

const globalForRedisClient = globalThis as unknown as {
  __prepSmartRedisSingleton?: PrepSmartRedisClient;
};

export const redis =
  globalForRedisClient.__prepSmartRedisSingleton ?? new PrepSmartRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedisClient.__prepSmartRedisSingleton = redis;
}
