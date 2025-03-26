# TypingTales - Interactive Typing Practice for Kids

TypingTales is an engaging web-based typing practice application designed specifically for children aged 6-13. It combines the fun of storytelling with typing practice, creating a personalized learning experience that helps kids improve their typing skills while enjoying themselves.

## 🌟 Features

- **Personalized Stories**: Stories are customized with the child's name as the main character
- **Age-Appropriate Content**: Content tailored for children aged 6-13
- **Gender-Specific Stories**: Stories adapted based on the child's gender
- **Visual Feedback**: Real-time feedback with color-coded typing indicators
  - Green: Correctly typed text
  - Red: Mistakes
  - Blue highlight: Current character
- **Progress Tracking**:
  - Score tracking
  - Level progression (5 levels)
  - Session history
- **Session Management**:
  - 15-minute time limit per session
  - Multiple sessions allowed
  - Progress saved between sessions
- **No Repeat Stories**: Stories don't repeat until all stories for a gender have been used
- **Responsive Design**: Works on all devices and screen sizes
- **Kid-Friendly Interface**: Clean, intuitive design suitable for children

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for loading resources
- Basic typing skills

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gayanhewa/typing-tales.git
cd typing-tales
```

2. Set up git hooks (for development):

```bash
# Copy pre-commit and pre-push hooks
cp .hooks/pre-commit .git/hooks/
cp .hooks/pre-push .git/hooks/
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
```

3. Set up a local web server (required for loading stories.json):

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx serve
```

4. Open your browser and visit:

```
http://localhost:8000
```

## 🎮 How to Play

1. Enter your name and select your gender
2. Click "Start Typing Adventure"
3. Type the story as it appears on screen
4. Watch your progress with the color-coded feedback
5. Complete the story within the time limit
6. View your score and play again with a new story

## 🛠️ Technical Details

### Built With

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (Alpine.js)
- JSON for story data

### File Structure

```
typing-tales/
├── public/             # Public assets
│   ├── index.html     # Main application file
│   ├── game.js        # Game logic
│   └── stories.json   # Story data
├── src/               # Source files
│   └── test/         # Test files
├── .hooks/           # Git hooks
├── README.md         # This file
└── package.json      # Project configuration
```

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📚 Story Format

Stories are stored in `public/stories.json` with the following structure:

```json
{
  "stories": [
    {
      "id": "unique_id",
      "title": "Story Title",
      "text": "Story content with {{NAME}} placeholder",
      "gender": "boy/girl"
    }
  ]
}
```

Want to add more stories? [Contribute to the repository](https://github.com/gayanhewa/typing-tales)!

## 🔒 Privacy & Data

- No personal data is stored on servers
- Progress is saved locally in the browser
- No registration required
- No tracking or analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Stories are original content created for TypingTales
- UI components styled with Tailwind CSS
- Interactive functionality powered by Alpine.js

## 📞 Support

For support, please open an issue in the [GitHub repository](https://github.com/gayanhewa/typing-tales) or contact us at gayanhewa@gmail.com

## 🔄 Updates

- Version 1.0.0 (March 2024)
  - Initial release
  - Basic typing functionality
  - Story personalization
  - Progress tracking

## 🌐 Website

Visit typingtales.org to try the application online.
