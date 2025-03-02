/**
 * Brand archetypes data with paired relationships
 * Each archetype belongs to a pair
 */
const archetypes = [
  { name: 'Pioneer', pair: 'Pioneer–Pathfinder', description: 'Breaks new ground, leads the way into unexplored territory' },
  { name: 'Pathfinder', pair: 'Pioneer–Pathfinder', description: 'Guides others through journeys of discovery and growth' },
  
  { name: 'Monarch', pair: 'Monarch–Executive', description: 'Projects authority, sets standards of excellence and leadership' },
  { name: 'Executive', pair: 'Monarch–Executive', description: 'Manages systems efficiently, brings order and organization' },
  
  { name: 'Iconoclast', pair: 'Iconoclast–Catalyst', description: 'Breaks rules and challenges conventions to create change' },
  { name: 'Catalyst', pair: 'Iconoclast–Catalyst', description: 'Inspires transformation and facilitates meaningful change' },
  
  { name: 'Prophet', pair: 'Prophet–Futurist', description: 'Delivers wisdom and foresight with conviction and purpose' },
  { name: 'Futurist', pair: 'Prophet–Futurist', description: 'Envisions possibilities and paints a picture of what could be' },
  
  { name: 'Sentinel', pair: 'Sentinel–Anchor', description: 'Protects what matters, maintains vigilance over core values' },
  { name: 'Anchor', pair: 'Sentinel–Anchor', description: 'Provides stability and safety in changing circumstances' },
  
  { name: 'Storyteller', pair: 'Storyteller–Mythmaker', description: 'Connects through authentic narratives that resonate' },
  { name: 'Mythmaker', pair: 'Storyteller–Mythmaker', description: 'Creates powerful stories that transcend ordinary reality' },
  
  { name: 'Crusader', pair: 'Crusader–Reformer', description: 'Champions causes with passion and unwavering commitment' },
  { name: 'Reformer', pair: 'Crusader–Reformer', description: 'Improves systems and structures to create better outcomes' },
  
  { name: 'Artisan', pair: 'Artisan–Curator', description: 'Creates with skill and vision, valuing craft and quality' },
  { name: 'Curator', pair: 'Artisan–Curator', description: 'Selects and presents the finest elements with discernment' },
  
  { name: 'Tactician', pair: 'Tactician–Engineer', description: 'Strategizes for advantage, using intelligence and planning' },
  { name: 'Engineer', pair: 'Tactician–Engineer', description: 'Builds functional solutions through technical innovation' },
  
  { name: 'Sage', pair: 'Sage–Enlightener', description: 'Offers wisdom and expertise, providing depth of knowledge' },
  { name: 'Enlightener', pair: 'Sage–Enlightener', description: 'Illuminates truths and expands awareness for others' },
  
  { name: 'Shepherd', pair: 'Shepherd–Host', description: 'Cares for others with compassion and protective guidance' },
  { name: 'Host', pair: 'Shepherd–Host', description: 'Creates welcoming spaces where connections can flourish' },
  
  { name: 'Adventurer', pair: 'Adventurer–Daredevil', description: 'Explores with curiosity and embraces new experiences' },
  { name: 'Daredevil', pair: 'Adventurer–Daredevil', description: 'Takes bold risks and pushes boundaries with flair' },
];

// Get all archetype pairs
const getArchetypePairs = () => {
  const pairs = [];
  const pairNames = new Set(archetypes.map(a => a.pair));
  
  pairNames.forEach(pairName => {
    const pairArchetypes = archetypes.filter(a => a.pair === pairName);
    pairs.push({
      name: pairName,
      archetypes: pairArchetypes
    });
  });
  
  return pairs;
};

// Get an archetype by name
const getArchetypeByName = (name) => {
  return archetypes.find(a => a.name === name);
};

// Get the other archetype in the same pair
const getPairedArchetype = (name) => {
  const archetype = getArchetypeByName(name);
  if (!archetype) return null;
  
  return archetypes.find(a => a.pair === archetype.pair && a.name !== name);
};

// Check if two archetypes are from the same pair
const areFromSamePair = (name1, name2) => {
  const archetype1 = getArchetypeByName(name1);
  const archetype2 = getArchetypeByName(name2);
  
  if (!archetype1 || !archetype2) return false;
  
  return archetype1.pair === archetype2.pair;
};

// Get list of all archetype names
const getAllArchetypeNames = () => {
  return archetypes.map(a => a.name);
};

module.exports = {
  archetypes,
  getArchetypePairs,
  getArchetypeByName,
  getPairedArchetype,
  areFromSamePair,
  getAllArchetypeNames,
}; 