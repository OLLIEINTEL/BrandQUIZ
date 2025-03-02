const axios = require('axios');
const cheerio = require('cheerio');
const { AppError } = require('../utils/errorHandler');

/**
 * Scrapes a website to extract content for AI analysis
 * @param {string} url - The website URL to scrape
 * @returns {Object} - Extracted logo URL and content
 */
const scrapeWebsite = async (url) => {
  try {
    // Validate URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Fetch the website
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000, // 10 second timeout
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract logo
    let logoUrl = null;
    
    // Try different strategies to find the logo
    // 1. Look for images with "logo" in the class, id, or alt text
    const logoSelectors = [
      'img[class*="logo"]',
      'img[id*="logo"]',
      'img[alt*="logo"]',
      'img[src*="logo"]',
      'a[class*="logo"] img',
      'div[class*="logo"] img',
      'header img',
      '.logo img',
      '#logo img'
    ];
    
    for (const selector of logoSelectors) {
      const img = $(selector).first();
      if (img.length > 0) {
        logoUrl = img.attr('src');
        if (logoUrl) break;
      }
    }
    
    // If logo URL is relative, convert to absolute
    if (logoUrl && !logoUrl.startsWith('http')) {
      const base = new URL(url);
      logoUrl = new URL(logoUrl, base.origin).href;
    }
    
    // Extract content for analysis
    const content = {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      h1: $('h1').map((i, el) => $(el).text().trim()).get(),
      h2: $('h2').map((i, el) => $(el).text().trim()).get(),
      paragraphs: $('p').map((i, el) => $(el).text().trim()).get().filter(p => p.length > 30).slice(0, 20), // Limit to 20 substantive paragraphs
    };
    
    // Combine all extracted content into a single string for analysis
    const combinedContent = [
      content.title,
      content.description,
      ...content.h1,
      ...content.h2,
      ...content.paragraphs,
    ].join(' ');
    
    return {
      logoUrl,
      content: combinedContent,
      originalUrl: url,
    };
  } catch (error) {
    // Handle common errors
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      throw new AppError(`Could not connect to the website. Please verify the URL is correct and the site is accessible.`, 400);
    }
    
    if (error.response && error.response.status === 403) {
      throw new AppError(`Access to this website is blocked. The site may have security measures preventing analysis.`, 400);
    }
    
    if (error.response && error.response.status === 404) {
      throw new AppError(`Website not found. Please check the URL and try again.`, 400);
    }
    
    // General error
    console.error('Web scraping error:', error);
    throw new AppError(`Could not analyze the website: ${error.message}`, 500);
  }
};

module.exports = {
  scrapeWebsite,
}; 