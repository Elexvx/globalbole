const normalize = value => value.normalize('NFKC').trim().toLocaleLowerCase();

// Public policy alone is too broad to make two reports relevant. Vehicle tags
// have different wording across desks, so recognize their shared subject in
// all five editions rather than using a newest-story fallback.
const broadTags = new Set([
  '公共政策', 'Public policy', 'Государственная политика', 'Politiques publiques',
].map(normalize));
const mobilityTags = new Set([
  '汽车产业', '汽車產業', '电动汽车', '電動汽車', '辅助驾驶', '輔助駕駛', '汽车监管', '汽車監管',
  'Automotive industry', 'Electric vehicles', 'Driver assistance', 'Vehicle regulation',
  'Автомобильная промышленность', 'Электромобили', 'Помощь водителю', 'Регулирование автомобилей',
  'Industrie automobile', 'Véhicules électriques', 'Aide à la conduite', 'Réglementation automobile',
].map(normalize));

export function relatedStoryScore(lead, candidate) {
  const leadTags = new Set((lead.tags || []).map(normalize).filter(tag => !broadTags.has(tag)));
  const candidateTags = new Set((candidate.tags || []).map(normalize).filter(tag => !broadTags.has(tag)));
  const shared = [...candidateTags].filter(tag => leadTags.has(tag)).length;
  const mobility = [...leadTags].some(tag => mobilityTags.has(tag)) && [...candidateTags].some(tag => mobilityTags.has(tag));
  return shared * 2 + Number(mobility);
}

export function innovationRelatedStories(ordered, lead, count = 4) {
  if (!lead) return [];
  const seen = new Set([lead.slug]);
  const candidates = ordered.filter(story => {
    if (seen.has(story.slug) || (story.lang || 'en') !== (lead.lang || 'en')) return false;
    seen.add(story.slug);
    return true;
  });
  const innovation = candidates.filter(story => story.category === 'innovation');
  const related = candidates.filter(story => story.category !== 'innovation')
    .map((story, order) => ({ story, order, score: relatedStoryScore(lead, story) }))
    .filter(item => item.score > 0)
    .sort((a, b) => Number(b.story.category === 'technology') - Number(a.story.category === 'technology') || b.score - a.score || a.order - b.order)
    .map(item => item.story);
  return [...innovation, ...related].slice(0, count);
}

// Fill the secondary lead row with real, distinct stories, never stories
// already occupying the lead or either adjacent list.
export function uniqueHomepageStories(ordered, excluded = [], count = 4) {
  const seen = new Set(excluded);
  return ordered.filter(story => {
    if (seen.has(story.slug)) return false;
    seen.add(story.slug);
    return true;
  }).slice(0, count);
}
