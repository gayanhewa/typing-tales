// Mock window object
global.window = {};

// Mock document object
global.document = {
<<<<<<< Updated upstream
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
=======
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
>>>>>>> Stashed changes
};

// Mock Set constructor to handle the Set operations in the game
global.Set = Set;

// Load the game code
const gameCode = await Bun.file("../../public/game.js").text();
<<<<<<< Updated upstream
const script = new Function("window", gameCode);
script(global.window);

// Make the game function available globally for tests
global.storyTypingGame = window.storyTypingGame;
=======
const script = new Function('window', gameCode);
script(global.window);

// Make the game function available globally for tests
global.storyTypingGame = window.storyTypingGame; 
>>>>>>> Stashed changes
