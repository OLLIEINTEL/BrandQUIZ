const { archetypes, areFromSamePair } = require('../data/archetypes');
const questions = require('../../client/src/data/questions');

/**
 * Calculates the primary and secondary archetypes based on quiz answers
 * @param {Array} answers - Array of {questionId, optionId} objects
 * @returns {Object} - Primary and secondary archetype names
 */
const calculateArchetypes = (answers) => {
  // Initialize scores for all archetypes
  const scores = {};
  archetypes.forEach(archetype => {
    scores[archetype.name] = 0;
  });
  
  // Process each answer to accumulate points
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    const option = question.options.find(opt => opt.id === answer.optionId);
    if (!option) return;
    
    // Add points to each archetype based on the option's archetypePoints
    Object.entries(option.archetypePoints).forEach(([archetype, points]) => {
      scores[archetype] = (scores[archetype] || 0) + points;
    });
  });
  
  // Sort archetypes by score (highest first)
  const sortedArchetypes = Object.entries(scores)
    .sort((a, b) => {
      // Sort by score (descending)
      if (b[1] !== a[1]) return b[1] - a[1];
      // If scores are tied, sort alphabetically
      return a[0].localeCompare(b[0]);
    })
    .map(entry => entry[0]); // Extract just the archetype names
  
  // Get primary archetype (highest score)
  const primary = sortedArchetypes[0];
  
  // Get secondary archetype (next highest score from a different pair)
  let secondary = null;
  for (let i = 1; i < sortedArchetypes.length; i++) {
    if (!areFromSamePair(primary, sortedArchetypes[i])) {
      secondary = sortedArchetypes[i];
      break;
    }
  }
  
  return {
    primary,
    secondary,
    scores
  };
};

module.exports = {
  calculateArchetypes
}; 