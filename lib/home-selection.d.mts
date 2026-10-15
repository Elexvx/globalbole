type RelatedStory = { slug: string; category: string; lang?: string; tags?: string[] };
export function relatedStoryScore(lead: RelatedStory, candidate: RelatedStory): number;
export function innovationRelatedStories<T extends RelatedStory>(ordered: T[], lead: T | undefined, count?: number): T[];
