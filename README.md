# CSS Gradient Generator

A sleek and user-friendly tool to create beautiful CSS gradients with a live preview and instantly copyable code.

> See the latest updates: https://github.com/TurboRx/CSS-Gradient-Generator#-recent-fixes--improvements

## 🌐 Website

You can use the tool directly here: https://turborx.github.io/CSS-Gradient-Generator/

## 🛠️ Testing

To verify all functionality works correctly, visit: test.html

## 🎆 Features

- **Live gradient preview** with real-time updates
- **Multiple gradient types**: Linear, Radial, Conic, and Repeating variants
- **Drag & drop color stops** with dynamic positioning
- **Dark and light theme toggle** with system preference detection
- **Random gradient generator** for inspiration
- **Undo/Redo functionality** with complete history
- **Multiple export formats**: CSS, SCSS, JSON, SVG
- **Copy-to-clipboard** functionality
- **Share gradients** via URL
- **Preset gradients** collection
- **Keyboard shortcuts** for power users
- **Fully accessible** with ARIA support
- **Mobile responsive** design

## 📚 Table of Contents

- Features
- Installation
- Usage
- Keyboard Shortcuts
- Export Formats
- Browser Support
- Troubleshooting
- Contributing
- License

## 💻 Installation

### Option 1: Direct Use
Simply visit the live website - no installation required!

### Option 2: Local Development

1. **Clone the repository**:

```
   git clone https://github.com/TurboRx/CSS-Gradient-Generator.git
   cd CSS-Gradient-Generator
```

2. **Serve the files** (required for proper functionality):

```
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (npx)
   npx serve .

   # Using PHP
   php -S localhost:8000
```

3. **Open in browser**: Navigate to
```
   http://localhost:8000
```
4. **Run tests**: Visit
```
   http://localhost:8000/test.html
```
   to verify everything works

## 🎨 Usage

1. **Select Gradient Type**: Choose from Linear, Radial, or Conic gradients
2. **Adjust Parameters**: Modify angle, shape, size, and position as needed
3. **Manage Colors**: Add, remove, or modify color stops
4. **Preview Live**: See real-time updates in the preview area
5. **Export**: Copy CSS code or download in various formats
6. **Share**: Generate shareable URLs for your gradients

### Advanced Features

- **Preset Gradients**: Click any preset to apply instantly
- **Random Generation**: Use the "Random Design" button for inspiration
- **Undo/Redo**: Use buttons or keyboard shortcuts to navigate history
- **Theme Toggle**: Switch between light and dark modes

## ⌨️ Keyboard Shortcuts

|Shortcut|Action|
|--|--|
|``` Ctrl/Cmd + C ```|Copy gradient code|
|``` Ctrl/Cmd + Z ```|Undo last action|
|``` Ctrl/Cmd + Shift + Z ```|Redo action|
|``` Ctrl/Cmd + Y ```|Redo action (alternative)|
|``` Ctrl/Cmd + R ```|Generate random gradient|
|``` Escape ```|Clear focus|

## 📎 Export Formats

### CSS

```
background-image: linear-gradient(45deg, #ff0000, #0000ff);
```

### SCSS

```
$gradient: linear-gradient(45deg, #ff0000, #0000ff);
background-image: $gradient;
```

### JSON

```
{
  "type": "linear-gradient",
  "angle": 45,
  "colors": [
    {"color": "#ff0000", "position": null},
    {"color": "#0000ff", "position": null}
  ],
  "css": "linear-gradient(45deg, #ff0000, #0000ff)"
}
```

### SVG

```
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff0000" />
      <stop offset="100%" style="stop-color:#0000ff" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
</svg>
```

## 🌍 Browser Support

- **Chrome**: 88+ ✅
- **Firefox**: 85+ ✅
- **Safari**: 14+ ✅
- **Edge**: 88+ ✅
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 88+ ✅

### Feature Support

- CSS Gradients: All modern browsers
- Material Icons: Loaded via Google Fonts API
- Clipboard API: HTTPS required for full functionality
- File Download: All modern browsers

## 🔧 Troubleshooting

### Common Issues

#### 1. "Material Icons not loading"

**Symptoms**: Icons appear as text or squares

**Solutions**:

- Ensure internet connection for Google Fonts
- Check if Content Security Policy blocks external fonts
- Try refreshing the page
- Verify the page is served over HTTP/HTTPS (not
```
  file://
```
  )

#### 2. "Copy to clipboard not working"

**Symptoms**: Copy button doesn't work

**Solutions**:

- Ensure page is served over HTTPS (required for Clipboard API)
- Use a local server for development (see installation instructions)
- Try manual copy from the text area

#### 3. "Gradient preview not updating"

**Symptoms**: Changes don't reflect in preview

**Solutions**:

- Check browser console for JavaScript errors
- Ensure all script files are loaded correctly
- Try refreshing the page
- Verify no browser extensions are interfering

#### 4. "Theme toggle not working"

**Symptoms**: Dark/Light mode buttons don't respond

**Solutions**:

- Check that JavaScript is enabled
- Verify theme buttons exist in the DOM
- Clear browser cache and reload
- Check for console errors

#### 5. "Export/Download failing"

**Symptoms**: Download button doesn't create file

**Solutions**:

- Check browser's download settings
- Ensure pop-ups aren't blocked
- Try a different export format
- Verify JavaScript is enabled

### Debug Mode

To enable debug mode, open browser console and run:
```
localStorage.setItem('gradient-debug', 'true');
location.reload();
```

This will enable detailed logging to help diagnose issues.

### Testing Your Installation

1. Visit
```
 test.html
```
 in your browser
2. Review the test results
3. Address any failed tests
4. Green checkmarks = everything is working!

### Getting Help

If you encounter issues:

1. **Check the test page**: Visit
```
 test.html
```
 first
2. **Review console errors**: Open browser DevTools (F12)
3. **Try different browsers**: Test in Chrome, Firefox, Safari
4. **Check network**: Ensure internet access for external resources
5. **Create an issue**: Report bugs on GitHub Issues

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

### Quick Contributions

1. **Fork** the repository
2. **Clone** your fork:

```
   git clone https://github.com/YourUsername/CSS-Gradient-Generator.git
```
3. **Create** a feature branch:

```
   git checkout -b feature/your-feature-name
```
4. **Make** your changes
5. **Test** your changes with
```
 test.html
```
6. **Commit** your changes:

```
   git add .
   git commit -m "Add your descriptive message"
```
7. **Push** to your fork:

```
   git push origin feature/your-feature-name
```
8. **Create** a Pull Request

### Development Guidelines

- **Test thoroughly**: Run
```
 test.html
```
 before submitting
- **Follow conventions**: Match existing code style
- **Document changes**: Update README if needed
- **Consider accessibility**: Maintain ARIA compliance
- **Mobile-first**: Ensure responsive design
- **Performance**: Optimize for fast loading

### Reporting Issues

When reporting bugs:

1. **Use test.html**: Include test results
2. **Browser info**: Specify browser and version
3. **Steps to reproduce**: Clear reproduction steps
4. **Expected vs actual**: What should happen vs what does happen
5. **Console errors**: Include any error messages

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute as needed.

```
MIT License

Copyright (c) 2024 TurboRx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMplied, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Developer and Maintainer

**TurboRx** - GitHub Profile

### Connect

- 🐛 **Issues**: Report bugs or request features
- 🌟 **Star**: Show your support by starring the repository
- 🌴 **Fork**: Create your own version

**Made with ❤️ for the web development community**

Live Demo | Test Suite | GitHub