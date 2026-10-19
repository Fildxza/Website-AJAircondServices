import { en, type Copy } from "./copy.en";
import { ms } from "./copy.ms";

export type { Copy };
export type Lang = "ms" | "en";

/** Bahasa Melayu is the default language. */
export const DEFAULT_LANG: Lang = "ms";
export const LANGS: readonly Lang[] = ["ms", "en"];
export const LANG_STORAGE_KEY = "aj-lang";

export const copy: Record<Lang, Copy> = { ms, en };

export const isLang = (value: unknown): value is Lang => value === "ms" || value === "en";

/** Replaces {placeholders} in a copy string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
