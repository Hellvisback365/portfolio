export function parseLLMJSON<T>(text: string, fallback: T): T {
  try { return JSON.parse(text) as T; } catch {}
  try {
    const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (blockMatch && blockMatch[1]) return JSON.parse(blockMatch[1].trim()) as T;
  } catch {}
  try {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(text.substring(first, last + 1)) as T;
    }
  } catch {}
  return fallback;
}
