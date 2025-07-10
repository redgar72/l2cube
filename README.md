# Rubik's Cube Tutorial - Jekyll Site

A Jekyll-based website for learning Rubik's Cube moves and solving techniques. This site uses the Twisty library via CDN and has no bundled dependencies.

## Structure

```
tutorial/
├── _config.yml            # Jekyll configuration
├── _layouts/
│   └── default.html       # Main layout template
├── _includes/             # Reusable HTML sections
│   ├── welcome.html
│   ├── move-definitions.html
│   ├── face-turns-breakdown.html
│   ├── wide-turns-breakdown.html
│   ├── slice-turns-breakdown.html
│   ├── rotations-breakdown.html
│   ├── cross.html
│   └── f2l.html
├── index.html             # Main page (uses default layout)
├── index.css              # Styles
├── static.js              # JavaScript functionality
├── components/
│   └── CubeComponent.js   # Custom cube component
└── README.md
```

## Features

- **Jekyll Static Site Generator**: Clean, modular structure with layouts and includes
- **No Bundled Dependencies**: Uses Twisty library directly from CDN
- **Interactive Cubes**: 3D and 2D cube visualizations
- **Navigation**: Collapsible sidebar with smooth scrolling
- **Responsive**: Works on desktop and mobile devices
- **GitHub Pages Ready**: Can be deployed directly to GitHub Pages

## Dependencies

- **Jekyll**: Static site generator (Ruby-based)
- **Twisty Library**: Loaded from `https://cdn.cubing.net/v0/js/cubing/twisty`
- **No build tools required**: Pure HTML, CSS, and JavaScript

## How to Run

### Prerequisites
Make sure you have Ruby and Jekyll installed:
```bash
# Install rbenv (Ruby version manager)
brew install rbenv

# Install Ruby
rbenv install 3.2.2
rbenv global 3.2.2

# Install Jekyll
gem install jekyll bundler
```

### Local Development
1. Clone or download the repository
2. Serve the site locally:
   ```bash
   jekyll serve
   ```
3. Open `http://localhost:4000` in your browser

### Static File Serving
You can also serve the built site from the `_site` directory:
```bash
# Build the site
jekyll build

# Serve the built site
cd _site
python -m http.server 8000
```

## Customization

- **Add new sections**: Create HTML files in the `_includes/` directory and add them to `index.html`
- **Modify layout**: Edit `_layouts/default.html` for structural changes
- **Modify styling**: Edit `index.css` for visual changes
- **Add cube components**: Use the `CubeComponent` class in `components/CubeComponent.js`

## Deployment

### GitHub Pages
This site is ready for GitHub Pages deployment. Simply push to a GitHub repository and enable GitHub Pages in the repository settings. GitHub Pages will automatically build your Jekyll site - no custom workflow needed!

### Other Static Hosting
Build the site and upload the `_site` directory:
```bash
jekyll build
# Upload contents of _site/ to your hosting provider
```

## Browser Support

Works in all modern browsers that support:
- ES6 modules
- Custom elements (Web Components)
- CSS Grid and Flexbox

## License

This project is open source and available under the MIT License. 