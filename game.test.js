import { expect, test, describe, beforeEach, mock, spyOn } from "bun:test";
import { storyTypingGame } from "./game.js";

// Mock localStorage
const localStorageMock = {
    getItem: mock(() => null),
    setItem: mock(() => {}),
    removeItem: mock(() => {}),
    clear: mock(() => {})
};
global.localStorage = localStorageMock;

// Test data
const testStories = {
    stories: [
        {
            id: '1',
            title: 'Test Story 1',
            text: 'Hello {{NAME}}, welcome to the story!',
            gender: 'boy'
        },
        {
            id: '2',
            title: 'Test Story 2',
            text: 'Hi [NAME], this is another story!',
            gender: 'girl'
        }
    ]
};

// Mock fetch
global.fetch = mock(async () => ({
    json: async () => testStories
}));

// Mock browser APIs
global.alert = mock(() => {});
global.console.error = mock(() => {});
global.setInterval = mock(() => 'timer-id');
global.clearInterval = mock(() => {});

describe('storyTypingGame', () => {
    let game;

    beforeEach(() => {
        // Reset all mocks
        localStorageMock.getItem.mockReset();
        localStorageMock.setItem.mockReset();
        localStorageMock.removeItem.mockReset();
        localStorageMock.clear.mockReset();
        global.fetch.mockReset();
        global.alert.mockReset();
        global.console.error.mockReset();
        global.setInterval.mockReset();
        global.clearInterval.mockReset();

        // Reset fetch mock implementation
        global.fetch.mockImplementation(async () => ({
            json: async () => testStories
        }));

        // Create new game instance
        game = storyTypingGame();
    });

    describe('initializeStories', () => {
        test('should load stories and set up initial state', async () => {
            await game.initializeStories();
            expect(game.stories.length).toBe(2);
            expect(game.stories[0].id).toBe('1');
            expect(game.stories[1].id).toBe('2');
        });

        test('should handle fetch errors gracefully', async () => {
            global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
            
            await game.initializeStories();
            expect(global.console.error).toHaveBeenCalled();
            expect(global.alert).toHaveBeenCalledWith('Failed to load stories. Please refresh the page.');
        });

        test('should restore saved game state if available', async () => {
            localStorageMock.getItem.mockImplementationOnce(() => JSON.stringify({
                playerName: 'TestPlayer',
                playerGender: 'male',
                usedStoryIds: ['1']
            }));

            await game.initializeStories();
            expect(game.playerName).toBe('TestPlayer');
            expect(game.playerGender).toBe('male');
            expect(game.usedStoryIds.has('1')).toBe(true);
        });
    });

    describe('validateName', () => {
        test('should capitalize first letter and remove special characters', () => {
            expect(game.validateName('john doe')).toBe('Johndoe');
            expect(game.validateName('john@doe')).toBe('Johndoe');
            expect(game.validateName('')).toBe('Player');
        });
    });

    describe('replaceNameInStory', () => {
        test('should replace all name placeholders with player name', () => {
            const story = {
                id: '1',
                title: 'Test Story',
                text: 'Hello {{NAME}}, welcome [NAME]!'
            };
            const result = game.replaceNameInStory(story, 'John');
            expect(result.text).toBe('Hello John, welcome John!');
        });
    });

    describe('startGame', () => {
        beforeEach(async () => {
            await game.initializeStories();
        });

        test('should validate required fields', () => {
            game.startGame();
            expect(global.alert).toHaveBeenCalledWith('Please fill in all details');
        });

        test('should select appropriate story based on gender', () => {
            game.playerName = 'John';
            game.playerGender = 'male';
            game.startGame();
            expect(game.currentStory.gender).toBe('boy');
        });

        test('should reset used stories when all stories are used', () => {
            game.playerName = 'John';
            game.playerGender = 'male';
            game.usedStoryIds = new Set(['1']);
            game.startGame();
            expect(game.usedStoryIds.size).toBe(1);
        });
    });

    describe('checkInput', () => {
        beforeEach(async () => {
            await game.initializeStories();
            game.currentStoryText = 'Hello world';
        });

        test('should update character index for correct input', () => {
            game.userInput = 'Hello';
            game.checkInput();
            expect(game.characterIndex).toBe(5);
            expect(game.score).toBe(5);
        });

        test('should handle incorrect input', () => {
            game.userInput = 'Hallo';
            game.checkInput();
            expect(game.characterIndex).toBe(5);
            expect(game.score).toBe(5);
        });
    });

    describe('handleSpace', () => {
        beforeEach(async () => {
            await game.initializeStories();
            game.currentStoryText = 'Hello world';
        });

        test('should handle space key correctly', () => {
            const event = { preventDefault: mock(() => {}) };
            game.characterIndex = 5;
            game.handleSpace(event);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(game.characterIndex).toBe(6);
            expect(game.score).toBe(6);
        });
    });

    describe('endGame', () => {
        beforeEach(async () => {
            await game.initializeStories();
            game.currentStory = { title: 'Test Story' };
            game.playerName = 'John';
            game.playerGender = 'male';
            game.score = 100;
        });

        test('should save game history', () => {
            game.endGame();
            expect(localStorageMock.getItem).toHaveBeenCalledWith('storyTyperHistory');
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        test('should set completedSuccessfully based on progress', () => {
            game.currentStoryText = 'Hello world';
            game.characterIndex = 11;
            game.endGame();
            expect(game.completedSuccessfully).toBe(true);
        });
    });

    describe('resetGame', () => {
        test('should reset all game state to initial values', () => {
            game.userInput = 'test';
            game.score = 100;
            game.timeLeft = 500;
            game.resetGame();
            expect(game.userInput).toBe('');
            expect(game.score).toBe(0);
            expect(game.timeLeft).toBe(900);
            expect(game.gameState).toBe('registration');
        });
    });

    describe('logout', () => {
        test('should clear timer and game state', () => {
            game.timer = 'timer-id';
            game.logout();
            expect(global.clearInterval).toHaveBeenCalledWith('timer-id');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('gameState');
        });
    });
}); 