export function planHomeEdition<T extends {slug: string}>(ordered: T[]): {hero: T | undefined; supporting: T[]; latest: T[]; remaining: T[]};
