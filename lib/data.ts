import publishedArticles from "@/content/generated/articles.json";

export type CategorySlug = "technology" | "innovation" | "business";

export type StorySection = {
  heading: string;
  body: string;
};

export type Story = {
  slug: string;
  title: string;
  category: CategorySlug;
  categoryLabel: string;
  author: string;
  authorRole: string;
  date: string;
  displayDate: string;
  readTime: number;
  dek: string;
  image: string;
  imageAlt: string;
  tags: string[];
  body: StorySection[];
  quote?: string;
  lang?: string;
  translationKey?: string;
  issue?: string;
  markdown?: string;
};

export type Category = {
  slug: CategorySlug;
  label: string;
  title: string;
  description: string;
};

export const categories: Category[] = [
  {slug:"technology",label:"Technology",title:"Technology & Applications",description:"Tools, data and digital infrastructure."},
  {slug:"innovation",label:"Innovation",title:"New Ideas in Practice",description:"Better services, design and collaboration."},
  {slug:"business",label:"Business",title:"Business & Operations",description:"Operations, costs and supply chains."},
];

export const stories: Story[] = publishedArticles as Story[];
export const tickerStories = stories.slice(0,8);
export const curatedAssets = stories.map(story=>({label:story.title,image:story.image,imageAlt:story.imageAlt}));
export const getCategory = (slug:string) => categories.find(category=>category.slug===slug);
export const getStaticStory = (slug:string) => stories.find(story=>story.slug===slug);
export const getStoriesByCategory = (category:CategorySlug) => stories.filter(story=>story.category===category);
export const sortStories = (items:Story[]) => [...items].sort((a,b)=>b.date.localeCompare(a.date));
