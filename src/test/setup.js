// Mock window object
global.window = {};

// Mock document object
global.document = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
};

// Mock Set constructor to handle the Set operations in the game
global.Set = Set;

// Load the game code
const gameCode = await Bun.file("../../public/game.js").text();
const script = new Function("window", gameCode);
script(global.window);

// Make the game function available globally for tests
global.storyTypingGame = window.storyTypingGame;
