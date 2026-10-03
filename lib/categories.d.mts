export type CategorySlug = "technology" | "innovation" | "business" | "work-life" | "current-affairs" | "energy";
export type Category = {slug:CategorySlug;label:string;title:string;description:string};
export const categories: Category[];
export const categoryLabels: Record<CategorySlug,string>;
export function categoryPool<T extends {category:string}>(stories:T[], category:CategorySlug, count?:number):T[];
