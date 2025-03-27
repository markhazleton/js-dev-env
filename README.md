# Bootstrap 5 + Express.js Starter Kit

A simple, lightweight starter kit for building websites with Bootstrap 5, Express.js, and EJS templates.

## Features

- 🚀 **Express.js Backend** - Fast, unopinionated, minimalist web framework for Node.js
- 📝 **EJS Templates** - Simple templating language for generating HTML
- 🎨 **Bootstrap 5** - Powerful, responsive front-end framework
- 💅 **SASS Support** - For more organized and maintainable CSS
- 🖌️ **Bootstrap Icons** - Over 1,800 high-quality icons
- 🔄 **Live Reload** - Automatically refresh your browser on code changes
- 📱 **Mobile-First** - Responsive design that works on all devices
- 🎛️ **Content Management** - Simple JSON-based content management

## Quick Start

### Prerequisites

- Node.js (v14 or newer)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository (or download the ZIP file)
git clone https://github.com/yourusername/bootstrap-express-starter.git
cd bootstrap-express-starter

# Install dependencies
npm install

# Start the development server
npm run start:dev

# Open your browser and navigate to http://localhost:3000
```

## Project Structure

```
project-root/
├── data/
│   └── pages.json             # Content definitions for pages
├── public/                    # Static files served to the client
│   ├── css/                   # Compiled CSS files
│   └── fonts/                 # Font files including Bootstrap Icons
├── scss/                      # SASS source files
│   ├── _custom.scss           # Custom styles
│   ├── _variables.scss        # Bootstrap variable overrides
│   └── main.scss              # Main SASS file
├── scripts/                   # Utility scripts
│   └── copy-icons.js          # Script to copy Bootstrap Icons
├── views/                     # EJS template files
│   ├── partials/              # Reusable template parts
│   ├── layout.ejs             # Main layout template
│   └── page.ejs               # Page template
├── index.js                   # Main server file
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon for auto-reloading
- `npm run build-css` - Compile SASS to CSS once
- `npm run watch-css` - Watch SASS files and compile on changes
- `npm run copy-icons` - Copy Bootstrap Icons to the public directory
- `npm run start:dev` - Do all of the above at once (recommended for development)
- `npm run lint` - Run ESLint to check code quality

## Adding New Pages

To add a new page, add an entry to `data/pages.json`:

```json
{
  "title": "Page Title",
  "url": "/page-url",
  "template": "page",
  "content": {
    "heading": "Page Heading",
    "text": "Page description text",
    "body": "Page content in HTML format"
  }
}
```

The server automatically creates routes for all pages defined in the JSON file.

## Customizing Bootstrap

To customize Bootstrap variables, edit `scss/_variables.scss`. For example:

```scss
$primary: #ff5733; // Change primary color
$font-size-base: 1.1rem; // Change base font size
```

## Deployment

This starter kit can be deployed to various hosting platforms:

- **Heroku**: Add a `Procfile` with `web: node index.js`
- **Vercel/Netlify**: Configure as a Node.js application
- **Traditional Hosting**: Build the site and upload via FTP

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.