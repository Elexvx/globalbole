// Stable category slugs are shared by content validation, the public API and UI.
export const categories = [
  {slug:"technology",label:"Technology",title:"AI & Frontier Technology",description:"Artificial intelligence, frontier technology, digital tools and infrastructure."},
  {slug:"innovation",label:"Innovation",title:"Innovation in Practice",description:"New services, design methods and practical collaboration."},
  {slug:"business",label:"Business",title:"Finance & Business",description:"Economics, investment, companies, markets and supply chains."},
  {slug:"work-life",label:"Work & City Life",title:"Work & City Life",description:"Employment, careers, urban services and everyday city life."},
  {slug:"current-affairs",label:"Current Affairs",title:"Current Affairs",description:"Major domestic and international news, diplomacy and public policy."},
  {slug:"energy",label:"Energy & Industry",title:"Energy & Industry",description:"New energy, storage, industrial developments and energy supply."},
];

export const categoryLabels = Object.fromEntries(categories.map(category => [category.slug,category.label]));

export function categoryPool(stories, category, count = stories.length) {
  return stories.filter(story => story.category === category).slice(0,count);
}
