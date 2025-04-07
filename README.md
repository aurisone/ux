# Medical Visits Web App Prototype

A responsive web application prototype for managing medical visits. Built with HTML, CSS, and JavaScript.

## Features

- Responsive design that works on mobile, tablet, and desktop
- List of medical visits with details such as:
  - Visit name
  - Date and time
  - Duration
  - Number of images
  - Number of notes
- Visits grouped by date with "Today", "Yesterday" or date headings
- Interactive elements including menu button and add button
- Slate color palette from shadcn/ui

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser

## Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling with responsive design
- `app.js` - JavaScript functionality and data handling

## Preview

The application displays a list of medical visits with a clean, modern interface, grouped by date.

Date headings include:
- "Dnes" (Today) for today's visits
- "Včera" (Yesterday) for yesterday's visits
- Calendar date for other days

Each visit item includes:
- Name of the visit
- Time in a smaller font
- Icons for duration, image count, and notes count
- Menu button (kebab icon) for additional actions

The header includes:
- Hamburger menu icon on the left
- "Návštěvy" heading in the center
- Add button on the right

## Future Enhancements

- Add form to create new visits
- Implement side navigation menu
- Add detail view for each visit
- Add search and filter functionality 