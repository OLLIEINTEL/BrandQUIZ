const questions = [
  {
    id: 'q1',
    text: 'What is the primary goal of your brand?',
    options: [
      { value: 'freedom', text: 'To help people break free from constraints', description: 'Encouraging independence and self-expression' },
      { value: 'service', text: 'To care for and protect others', description: 'Providing safety, support and comfort' },
      { value: 'mastery', text: 'To help people improve and excel', description: 'Delivering expertise and empowering achievement' },
      { value: 'connection', text: 'To bring people together', description: 'Creating belonging and fostering relationships' }
    ]
  },
  {
    id: 'q2',
    text: "How would you describe your brand's approach to innovation?",
    options: [
      { value: 'disruptive', text: 'Revolutionary - we challenge the status quo', description: 'Breaking rules and creating new paradigms' },
      { value: 'evolutionary', text: 'Thoughtful - we improve on what works', description: 'Refining and perfecting existing approaches' },
      { value: 'visionary', text: 'Transformative - we imagine new possibilities', description: 'Creating new visions of what could be' },
      { value: 'practical', text: 'Pragmatic - we solve real problems', description: 'Focusing on useful, functional solutions' }
    ]
  },
  {
    id: 'q3',
    text: "What tone best describes your brand's communication style?",
    options: [
      { value: 'playful', text: 'Playful and lighthearted', description: 'Fun, humorous, and entertaining' },
      { value: 'authoritative', text: 'Confident and authoritative', description: 'Expert, decisive, and commanding' },
      { value: 'authentic', text: 'Honest and straightforward', description: 'Genuine, transparent, and direct' },
      { value: 'inspiring', text: 'Inspiring and uplifting', description: 'Motivational, optimistic, and encouraging' }
    ]
  },
  {
    id: 'q4',
    text: 'What does your brand help customers achieve?',
    options: [
      { value: 'belonging', text: 'Feel part of something bigger', description: 'Community, acceptance, and connection' },
      { value: 'control', text: 'Take control of their situation', description: 'Mastery, competence, and capability' },
      { value: 'transformation', text: 'Transform themselves or their world', description: 'Change, growth, and reinvention' },
      { value: 'stability', text: 'Find stability and reliability', description: 'Consistency, dependability, and trust' }
    ]
  },
  {
    id: 'q5',
    text: 'How does your brand approach challenges?',
    options: [
      { value: 'creative', text: 'With creativity and imagination', description: 'Finding novel, unexpected solutions' },
      { value: 'methodical', text: 'With careful analysis and planning', description: 'Systematic, thorough approach' },
      { value: 'bold', text: 'With courage and determination', description: 'Facing challenges head-on' },
      { value: 'collaborative', text: 'By bringing people together', description: 'Harnessing collective wisdom and effort' }
    ]
  },
  {
    id: 'q6',
    text: 'What value does your brand emphasize most?',
    options: [
      { value: 'freedom', text: 'Freedom and independence', description: 'Living life on your own terms' },
      { value: 'excellence', text: 'Excellence and quality', description: 'Being the best at what you do' },
      { value: 'joy', text: 'Joy and pleasure', description: 'Enjoying life to the fullest' },
      { value: 'wisdom', text: 'Wisdom and truth', description: 'Understanding deeper meanings' }
    ]
  },
  {
    id: 'q7',
    text: "How would you describe your brand's personality?",
    options: [
      { value: 'nurturing', text: 'Caring and supportive', description: 'Focused on helping and protecting others' },
      { value: 'adventurous', text: 'Bold and adventurous', description: 'Seeking excitement and new experiences' },
      { value: 'orderly', text: 'Organized and structured', description: 'Creating order from chaos' },
      { value: 'magical', text: 'Magical and transformative', description: 'Creating wonder and possibility' }
    ]
  },
  {
    id: 'q8',
    text: 'What fear does your brand help customers overcome?',
    options: [
      { value: 'insignificance', text: 'Fear of being insignificant', description: 'Helping them stand out and be recognized' },
      { value: 'vulnerability', text: 'Fear of vulnerability', description: 'Providing protection and security' },
      { value: 'conformity', text: 'Fear of conformity', description: 'Helping them express individuality' },
      { value: 'chaos', text: 'Fear of chaos and uncertainty', description: 'Creating stability and predictability' }
    ]
  },
  {
    id: 'q9',
    text: "What is your brand's approach to tradition?",
    options: [
      { value: 'revolutionary', text: 'We challenge traditions', description: 'Breaking with the past to create something new' },
      { value: 'respectful', text: 'We honor traditions', description: 'Building on the wisdom of the past' },
      { value: 'reinventive', text: 'We reinvent traditions', description: 'Updating the past for modern needs' },
      { value: 'timeless', text: 'We create new traditions', description: 'Establishing lasting practices and rituals' }
    ]
  },
  {
    id: 'q10',
    text: 'How does your brand make customers feel?',
    options: [
      { value: 'powerful', text: 'Powerful and capable', description: 'Able to achieve their goals' },
      { value: 'delighted', text: 'Delighted and entertained', description: 'Experiencing joy and pleasure' },
      { value: 'understood', text: 'Understood and accepted', description: 'Seen for who they truly are' },
      { value: 'inspired', text: 'Inspired and motivated', description: 'Ready to take action and make changes' }
    ]
  },
  {
    id: 'q11',
    text: "What best describes your brand's visual aesthetic?",
    options: [
      { value: 'luxurious', text: 'Elegant and sophisticated', description: 'Refined, high-end, and polished' },
      { value: 'authentic', text: 'Authentic and natural', description: 'Genuine, unfiltered, and organic' },
      { value: 'bold', text: 'Bold and striking', description: 'Eye-catching, vibrant, and distinctive' },
      { value: 'minimalist', text: 'Clean and minimalist', description: 'Simple, uncluttered, and focused' }
    ]
  },
  {
    id: 'q12',
    text: "What is your brand's ultimate purpose?",
    options: [
      { value: 'change', text: 'To change the world', description: 'Creating significant, lasting transformation' },
      { value: 'serve', text: 'To serve others', description: 'Meeting needs and solving problems' },
      { value: 'delight', text: 'To bring joy and delight', description: 'Making life more enjoyable and fun' },
      { value: 'empower', text: 'To empower individuals', description: 'Helping people realize their potential' }
    ]
  }
];

export default questions; 