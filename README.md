# bashtype 🚀

A terminal-style typing test application that simulates a command-line interface for an engaging typing practice experience.

![bashtype Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- **Terminal-style interface**: Authentic command-line experience
- **Real-time statistics**: Track your WPM, accuracy, and progress
- **Multiple commands**: Interactive terminal commands for different actions
- **Custom font**: JetBrains Mono for optimal coding typography
- **Responsive design**: Works seamlessly across different screen sizes
- **Live stats display**: Optional real-time performance monitoring

## 🖥️ Commands Available

- `help` - Display all available commands
- `welcome` - Show the welcome message
- `start` - Begin the typing test
- `reset` - Reset the current typing test
- `stats` - View your typing statistics
- `config` - Configure test settings
- `clear` - Clear the terminal screen

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/7vignesh/bashtype.git
   cd bashtype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   or with yarn:
   ```bash
   yarn dev
   ```

4. **Open your browser**
   
   The application will automatically open in your default browser at `http://localhost:5173` (or the next available port).

### 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
bashtype/
├── public/                 # Static assets
│   ├── favicon.ico        # Site favicon
│   ├── vite.svg          # Vite logo
│   └── fonts/            # JetBrains Mono font files
├── npm/                   # NPM package source
│   ├── package.json      # NPM package configuration
│   └── src/              # Package source files
├── index.html            # Main HTML file
├── main.js               # Core JavaScript functionality
├── style.css             # Compiled CSS styles
├── style.scss            # SCSS source styles
├── words.json            # Typing test word database
├── package.json          # Project dependencies and scripts
└── README.md            # Project documentation
```

## ⚙️ Configuration

The application includes several configurable options that can be accessed through the `config` command in the terminal interface:

- Test duration settings
- Difficulty levels
- Display preferences
- Statistics tracking options

## 🎮 How to Use

1. **Start the application** following the installation steps above
2. **Wait for the page to load** - you'll see a terminal-style interface
3. **Type `help`** to see all available commands
4. **Type `start`** to begin a typing test
5. **Follow the on-screen text** and type as accurately and quickly as possible
6. **View your results** with the `stats` command after completing a test
7. **Use `reset`** to start over or try again

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

### Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3/SCSS
- **Build Tool**: Vite
- **Fonts**: JetBrains Mono
- **Package Manager**: npm

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill the process using the port (usually 5173)
npx kill-port 5173
# Then restart the dev server
npm run dev
```

**Dependencies not installing:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
```bash
# Make sure all dependencies are installed
npm install
# Try building with verbose output
npm run build --verbose
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/7vignesh/bashtype/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

## 🌟 Acknowledgments

- Font: [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- Build tool: [Vite](https://vitejs.dev/)

---

**Happy Typing! 🎯**