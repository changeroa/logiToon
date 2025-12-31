import { PromptConfig, AgentStage } from './types';
import { PromptBuilder } from './builder';

/**
 * Simple LRU Cache implementation for prompt memoization
 */
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;
  private ttl: number;
  private timestamps: Map<K, number>;

  constructor(options: { max: number; ttl: number }) {
    this.cache = new Map();
    this.timestamps = new Map();
    this.maxSize = options.max;
    this.ttl = options.ttl;
  }

  has(key: K): boolean {
    if (!this.cache.has(key)) return false;

    const timestamp = this.timestamps.get(key);
    if (timestamp && Date.now() - timestamp > this.ttl) {
      this.delete(key);
      return false;
    }

    return true;
  }

  get(key: K): V | undefined {
    if (!this.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    // Delete if exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.delete(firstKey);
      }
    }

    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  delete(key: K): void {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global prompt cache instance
const promptCache = new LRUCache<string, string>({
  max: 100,           // Cache up to 100 prompts
  ttl: 1000 * 60 * 60 // 1 hour TTL
});

/**
 * Generate a cache key from config and stage
 */
const getCacheKey = (config: PromptConfig, stage: AgentStage): string => {
  return `${stage}:${config.ageGroup}:${config.tone}:${config.character}:${config.style}:${config.language}:${config.topicCategory || 'general'}`;
};

/**
 * Get a cached prompt, building it if not cached
 */
export const getCachedPrompt = (config: PromptConfig, stage: AgentStage): string => {
  const key = getCacheKey(config, stage);

  if (promptCache.has(key)) {
    return promptCache.get(key)!;
  }

  const prompt = new PromptBuilder(config).build(stage);
  promptCache.set(key, prompt);

  return prompt;
};

/**
 * Invalidate all cached prompts
 */
export const invalidatePromptCache = (): void => {
  promptCache.clear();
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => ({
  size: promptCache.size(),
  maxSize: 100
});

/**
 * Pre-warm cache with common configurations
 */
export const prewarmCache = (configs: PromptConfig[]): void => {
  const stages: AgentStage[] = ['logic', 'story', 'visual'];

  for (const config of configs) {
    for (const stage of stages) {
      getCachedPrompt(config, stage);
    }
  }
};

/**
 * Cached PromptBuilder - wrapper that uses cache automatically
 */
export class CachedPromptBuilder {
  private config: PromptConfig;

  constructor(config: PromptConfig) {
    this.config = config;
  }

  build(stage: AgentStage): string {
    return getCachedPrompt(this.config, stage);
  }

  getConfig(): PromptConfig {
    return { ...this.config };
  }
}

export { LRUCache };
