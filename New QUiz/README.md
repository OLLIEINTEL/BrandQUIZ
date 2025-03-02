# Brand Archetype Quiz

An AI-powered brand archetype quiz funnel for e-commerce brands. This system engages users through a 12-question quiz to determine their desired brand archetypes, collects user metadata, and leverages AI to assess the brand's current online presence based on its website.

## System Overview

This application provides a complete solution for helping e-commerce brands discover and align their brand identity through archetypes. The system:

1. Guides users through an interactive quiz experience
2. Analyzes quiz answers to determine desired brand archetypes
3. Scrapes and analyzes the brand's existing website using AI
4. Generates a personalized report comparing desired vs. current brand identity
5. Delivers the report via email and manages the contact in a CRM

## How It Works

### User Experience Flow

1. Users navigate through a 12-question quiz with multiple-choice options
2. Each answer contributes points to different brand archetypes
3. After completing the quiz, users provide contact and brand information
4. Upon submission, a personalized report is generated and sent via email

### Technical Implementation

#### Front-end (React + Vite + Tailwind CSS)

- Mobile-first, responsive interface using Tailwind CSS
- Quiz with progress tracking and intuitive navigation
- Form validation for user metadata
- Success confirmation page

#### Back-end (Node.js + Express)

- RESTful API for quiz submission processing
- Scoring algorithm to calculate brand archetypes
- Web scraping to analyze brand's existing website
- AI integration via OpenAI for classification and report generation
- CRM integration with GoHighLevel for contact management and email delivery

## Key Features

- Sophisticated scoring system that balances archetype distribution
- Robust error handling for web scraping and API interactions
- AI-driven content analysis of brand's existing website
- Personalized HTML reports comparing desired vs. current brand identity
- CRM integration for lead management and follow-up

## Brand Archetypes

The system uses 24 brand archetypes organized into 12 pairs. The final BrandType consists of a primary archetype (highest-scoring) and a secondary archetype (next highest-scoring from a different pair):

1. Pioneer–Pathfinder
2. Monarch–Executive
3. Iconoclast–Catalyst
4. Prophet–Futurist
5. Sentinel–Anchor
6. Storyteller–Mythmaker
7. Crusader–Reformer
8. Artisan–Curator
9. Tactician–Engineer
10. Sage–Enlightener
11. Shepherd–Host
12. Adventurer–Daredevil

## Implementation Details

### Quiz Scoring Logic

The scoring system assigns points to different archetypes based on user answers. Each question's options are weighted to contribute points to multiple archetypes, ensuring a balanced distribution. After tallying all points, the system selects:

- **Primary Archetype**: The archetype with the highest total points
- **Secondary Archetype**: The next highest-scoring archetype from a different pair

This approach ensures that the resulting brand identity is nuanced and multi-dimensional, reflecting the complexity of real-world brand positioning.

### Website Analysis

The system scrapes the user's website to extract:

- Logo image (for inclusion in the report)
- Text content from headings, paragraphs, and meta descriptions
- Navigation items and button text
- Color schemes and typography (when available)

This content is then analyzed by the OpenAI API to classify the current brand into primary and secondary archetypes, with confidence scores and reasoning for each classification.

### Report Generation

The AI-generated HTML report includes:

- Executive Summary
- Brand Identity Analysis (comparing desired vs. current archetypes)
- Messaging Strategy
- Visual Aesthetics Guidelines
- Content Strategy Recommendations
- Actionable Next Steps

The report is designed to be both visually appealing and actionable, providing concrete guidance for brand alignment.

### CRM Integration

The system integrates with GoHighLevel CRM to:

- Create or update contact records with quiz results
- Store brand archetype data as custom fields
- Send personalized emails with the HTML report
- Enable follow-up sequences based on quiz results

### Error Handling & Resilience

The application implements robust error handling to ensure:

- Graceful degradation if website scraping fails
- Fallback options if AI analysis encounters issues
- Continued processing even if CRM integration fails
- Comprehensive logging for troubleshooting

## Future Extensions

The system is designed to be extended with:

- Premium upsell for detailed brand strategy playbooks
- Enhanced analytics dashboard
- Additional quiz customization options
- More detailed brand analysis with visual component assessment
- Integration with additional marketing platforms

This implementation provides a solid foundation for an e-commerce brand analysis system that delivers personalized insights and actionable recommendations for brand strategy.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GoHighLevel API credentials
- OpenAI API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/brand-archetype-quiz.git
   cd brand-archetype-quiz
   ```

2. Install dependencies
   ```
   npm install
   cd client && npm install && cd ..
   ```

3. Create a `.env` file in the root directory based on the `.env.example` template
   ```
   # Example .env file contents:
   PORT=3000
   NODE_ENV=development
   OPENAI_API_KEY=your_openai_api_key
   GOHIGHLEVEL_API_KEY=your_gohighlevel_api_key
   GOHIGHLEVEL_LOCATION_ID=your_location_id
   ```

4. Start the development servers
   ```
   npm run dev
   ```

### Project Structure

```
brand-archetype-quiz/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
├── server/                 # Backend Express application
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── server.js           # Express server setup
├── .env                    # Environment variables (gitignored)
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## API Endpoints

- `POST /api/quiz/submit` - Submit quiz answers and generate report
- `GET /api/quiz/status/:reportId` - Check status of a report

## Deployment

### Deploying to GitHub Pages

GitHub Pages is a great option for hosting the frontend of your application. Note that GitHub Pages only hosts static content, so you'll need to deploy your backend separately (e.g., on Heroku, Render, or another hosting service).

#### Frontend Deployment Steps

1. **Prepare your project for GitHub Pages**

   First, install the `gh-pages` package:
   ```
   cd client
   npm install --save-dev gh-pages
   ```

2. **Update package.json in the client directory**

   Add the following to your client's `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/brand-archetype-quiz",
     "scripts": {
       // ... existing scripts
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
   Replace `yourusername` with your actual GitHub username.

3. **Configure Vite for base path**

   Update your `vite.config.js` in the client directory:
   ```javascript
   export default defineConfig({
     base: '/brand-archetype-quiz/',
     // ... other config options
   });
   ```

4. **Update API endpoints**

   Ensure your frontend API calls point to your deployed backend, not localhost:
   ```javascript
   // In client/src/utils/api.js or similar
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-url.com/api' 
     : 'http://localhost:3000/api';
   ```

5. **Deploy to GitHub Pages**

   Run the deploy script:
   ```
   npm run deploy
   ```

6. **Configure GitHub Repository**

   - Go to your GitHub repository
   - Navigate to Settings > Pages
   - Ensure the source is set to the `gh-pages` branch
   - Your site will be published at `https://yourusername.github.io/brand-archetype-quiz`

#### Backend Deployment

For the backend, consider these hosting options:

1. **Heroku**
   - Create a `Procfile` in your root directory with: `web: node server/server.js`
   - Deploy using the Heroku CLI or GitHub integration

2. **Render**
   - Create a new Web Service pointing to your repository
   - Set the build command: `npm install`
   - Set the start command: `node server/server.js`

3. **Railway**
   - Connect your GitHub repository
   - Railway will automatically detect Node.js and deploy your application

Remember to set all your environment variables in your hosting platform's dashboard.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- GoHighLevel for CRM integration #   B r a n d Q U I Z  
 