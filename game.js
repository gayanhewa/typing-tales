export function storyTypingGame() {
    return {
        // Game State
        gameState: 'registration',
        playerName: '',
        playerGender: '',
        stories: [],
        usedStoryIds: new Set(), // Track used stories
        // Story Management
        currentStory: null,
        currentStoryText: '',
        currentLevel: 1,
        // Typing Mechanics
        userInput: '',
        characterIndex: 0,
        currentWordIndex: 0,
        hasMistake: false,
        score: 0,
        progress: 0,
        timeLeft: 900, // 15 minutes total
        timer: null,
        // Game Outcomes
        completedSuccessfully: false,
        // Initialize Stories
        async initializeStories() {
            try {
                const response = await fetch('stories.json');
                const data = await response.json();
                this.stories = data.stories;
                
                // Check for saved game state
                const savedState = localStorage.getItem('gameState');
                if (savedState) {
                    const state = JSON.parse(savedState);
                    this.playerName = state.playerName;
                    this.playerGender = state.playerGender;
                    this.usedStoryIds = new Set(state.usedStoryIds);
                    this.gameState = 'playing';
                    this.startGame();
                }
            } catch (error) {
                console.error('Error loading stories:', error);
                alert('Failed to load stories. Please refresh the page.');
            }
        },
        // Name Replacement Method
        replaceNameInStory(story, playerName) {
            const namePlaceholders = [
                '{{NAME}}',
                '[NAME]',
                '{PLAYER_NAME}',
                'PROTAGONIST_NAME'
            ];

            let modifiedStory = story.text;

            namePlaceholders.forEach(placeholder => {
                modifiedStory = modifiedStory.split(placeholder).join(playerName);
            });

            return {
                ...story,
                text: modifiedStory
            };
        },
        // Validate and Prepare Name
        validateName(name) {
            let cleanedName = name.trim();
            // Capitalize first letter
            cleanedName = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
            // Remove special characters and spaces
            cleanedName = cleanedName.replace(/[^a-zA-Z]/g, '');
            return cleanedName || 'Player';
        },
        // Start Game Method
        startGame() {
            if (!this.playerName || !this.playerGender) {
                alert('Please fill in all details');
                return;
            }
            // Validate name
            this.playerName = this.validateName(this.playerName);

            // Filter stories by player's gender and exclude used stories
            const availableStories = this.stories.filter(story => {
                const storyGender = story.gender === 'boy' ? 'male' : 
                                  story.gender === 'girl' ? 'female' : 
                                  story.gender;
                return storyGender === this.playerGender && !this.usedStoryIds.has(story.id);
            });

            // If no new stories available for the selected gender, reset used stories
            if (availableStories.length === 0) {
                this.usedStoryIds.clear();
                return this.startGame(); // Retry with reset used stories
            }

            // Select a random story
            let selectedStory = availableStories[Math.floor(Math.random() * availableStories.length)];
            this.usedStoryIds.add(selectedStory.id);

            // Replace name in the story
            this.currentStory = this.replaceNameInStory(selectedStory, this.playerName);
            this.currentStoryText = this.currentStory.text;
            this.gameState = 'playing';
            this.startTimer();

            // Save game state
            this.saveGameState();
        },
        // Save Game State
        saveGameState() {
            const state = {
                playerName: this.playerName,
                playerGender: this.playerGender,
                usedStoryIds: Array.from(this.usedStoryIds)
            };
            localStorage.setItem('gameState', JSON.stringify(state));
        },
        // Play Again Method
        playAgain() {
            this.userInput = '';
            this.characterIndex = 0;
            this.currentWordIndex = 0;
            this.hasMistake = false;
            this.score = 0;
            this.progress = 0;
            this.timeLeft = 900;
            this.currentLevel = 1;
            this.completedSuccessfully = false;
            this.startGame();
        },
        // Logout Method
        logout() {
            clearInterval(this.timer);
            localStorage.removeItem('gameState');
            this.resetGame();
        },
        // Timer Management
        startTimer() {
            this.timer = setInterval(() => {
                this.timeLeft--;

                // Level progression
                const totalLength = this.currentStoryText.length;
                const levelLength = Math.floor(totalLength / 5);
                const currentLevelProgress = Math.floor(this.characterIndex / levelLength) + 1;

                this.currentLevel = Math.min(currentLevelProgress, 5);
                this.progress = (this.characterIndex / totalLength) * 100;

                // Game over conditions
                if (this.timeLeft <= 0 || this.characterIndex >= this.currentStoryText.length) {
                    this.endGame();
                }
            }, 1000);
        },
        // Input Checking
        checkInput() {
            // Check if user input matches the next characters
            if (this.userInput === this.currentStoryText.slice(0, this.userInput.length)) {
                this.characterIndex = this.userInput.length;
                this.score = this.characterIndex;
            } else {
                // Don't remove the last character, just mark it as incorrect
                this.characterIndex = this.userInput.length;
                this.score = this.characterIndex;
            }
        },
        // Handle Space Key
        handleSpace(event) {
            event.preventDefault();
            const nextChar = this.currentStoryText[this.characterIndex];
            if (nextChar === ' ') {
                this.userInput += ' ';
                this.characterIndex++;
                this.score = this.characterIndex;
            }
        },
        // End Game Method
        endGame() {
            clearInterval(this.timer);
            this.gameState = 'gameOver';
            this.completedSuccessfully = this.characterIndex >= this.currentStoryText.length;

            // Save game history
            const gameHistory = JSON.parse(localStorage.getItem('storyTyperHistory') || '[]');
            gameHistory.push({
                name: this.playerName,
                gender: this.playerGender,
                story: this.currentStory.title,
                score: this.score,
                completed: this.completedSuccessfully,
                date: new Date().toISOString()
            });
            localStorage.setItem('storyTyperHistory', JSON.stringify(gameHistory));
        },
        // Reset Game
        resetGame() {
            this.gameState = 'registration';
            this.userInput = '';
            this.characterIndex = 0;
            this.currentWordIndex = 0;
            this.hasMistake = false;
            this.score = 0;
            this.progress = 0;
            this.timeLeft = 900;
            this.currentLevel = 1;
            this.completedSuccessfully = false;
            this.usedStoryIds.clear();
        }
    }
} 