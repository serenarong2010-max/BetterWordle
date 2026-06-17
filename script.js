// Game State
const gameState = {
    score: 0,
    level: 1,
    wordsFound: 0,
    currentWord: [],
    selectedCandies: [],
    targetWord: '',
    hint: '',
    foundWords: [],
    candyLetters: [],
    maxLevel: 10
};

// Word lists by difficulty
const wordLists = {
    1: {
        words: ['CAT', 'DOG', 'SUN', 'FUN', 'HAT', 'BAT', 'MAT', 'RUN', 'CUP', 'BUS'],
        hints: {
            'CAT': 'A cute pet that says meow',
            'DOG': 'A loyal pet that says woof',
            'SUN': 'It shines in the sky',
            'FUN': 'Having a good time',
            'HAT': 'Wear it on your head',
            'BAT': 'Flies at night',
            'MAT': 'Put it on the floor',
            'RUN': 'Move fast with legs',
            'CUP': 'Drink from it',
            'BUS': 'Big vehicle for many people'
        }
    },
    2: {
        words: ['FISH', 'BIRD', 'CAKE', 'PLAY', 'TREE', 'BOOK', 'FROG', 'STAR', 'RAIN', 'JUMP'],
        hints: {
            'FISH': 'Swims in water',
            'BIRD': 'Flies in the sky',
            'CAKE': 'Sweet birthday treat',
            'PLAY': 'Have fun with toys',
            'TREE': 'Tall with leaves',
            'BOOK': 'Read stories in it',
            'FROG': 'Says ribbit, hops around',
            'STAR': 'Twinkles at night',
            'RAIN': 'Falls from clouds',
            'JUMP': 'Leap into the air'
        }
    },
    3: {
        words: ['CANDY', 'HAPPY', 'WATER', 'PIZZA', 'MUSIC', 'DANCE', 'SMILE', 'CLOUD', 'DREAM', 'MAGIC'],
        hints: {
            'CANDY': 'Sweet colorful treat',
            'HAPPY': 'Feeling joyful',
            'WATER': 'Drink when thirsty',
            'PIZZA': 'Cheesy Italian food',
            'MUSIC': 'Listen to songs',
            'DANCE': 'Move to rhythm',
            'SMILE': 'Show happiness',
            'CLOUD': 'Floats in sky',
            'DREAM': 'See while sleeping',
            'MAGIC': 'Wonderful powers'
        }
    },
    4: {
        words: ['PLANET', 'GARDEN', 'ROCKET', 'CASTLE', 'DRAGON', 'PRINCE', 'SCHOOL', 'FAMILY', 'SUMMER', 'WINTER'],
        hints: {
            'PLANET': 'Earth is one',
            'GARDEN': 'Grow flowers here',
            'ROCKET': 'Flies to space',
            'CASTLE': 'King lives here',
            'DRAGON': 'Breathes fire',
            'PRINCE': 'Royal son',
            'SCHOOL': 'Learn here',
            'FAMILY': 'People you love',
            'SUMMER': 'Hot season',
            'WINTER': 'Cold season'
        }
    },
    5: {
        words: ['ADVENTURE', 'CHOCOLATE', 'BIRTHDAY', 'FRIENDSHIP', 'TREASURE', 'MYSTERY', 'DISCOVER', 'IMAGINE', 'EXPLORE', 'WONDERFUL'],
        hints: {
            'ADVENTURE': 'Exciting journey',
            'CHOCOLATE': 'Yummy brown sweet',
            'BIRTHDAY': 'Special day each year',
            'FRIENDSHIP': 'Being good friends',
            'TREASURE': 'Hidden valuable items',
            'MYSTERY': 'Something to solve',
            'DISCOVER': 'Find something new',
            'IMAGINE': 'Think creatively',
            'EXPLORE': 'Travel and discover',
            'WONDERFUL': 'Amazing and great'
        }
    }
};

// Candy colors
const candyColors = [
    'linear-gradient(135deg, #FF6B9D, #FF8E53)',
    'linear-gradient(135deg, #574B90, #764ba2)',
    'linear-gradient(135deg, #F8B500, #FA8231)',
    'linear-gradient(135deg, #78E08F, #0ABDE3)',
    'linear-gradient(135deg, #EB3B5A, #FC5C65)',
    'linear-gradient(135deg, #45AAF2, #2D98DA)',
    'linear-gradient(135deg, #A55EEA, #8854D0)',
    'linear-gradient(135deg, #2BCDAD, #20B98A)'
];

// Candy emojis
const candyEmojis = ['🍬', '🍭', '🍩', '🍪', '🧁', '🎂', '🍮', '🍫', '🍡', '🎁', '⭐', '🌈', '💎', '🎈', '🎀', '🌟'];

// DOM Elements
const candyBoard = document.getElementById('candyBoard');
const currentWordDisplay = document.getElementById('currentWord');
const targetWordDisplay = document.getElementById('targetWord');
const hintDisplay = document.getElementById('hint');
const wordsList = document.getElementById('wordsList');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const wordsFoundDisplay = document.getElementById('wordsFound');
const clearBtn = document.getElementById('clearBtn');
const submitBtn = document.getElementById('submitBtn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalReward = document.getElementById('modalReward');
const modalBtn = document.getElementById('modalBtn');
const particlesContainer = document.getElementById('particles');

// Initialize game
function initGame() {
    gameState.score = 0;
    gameState.level = 1;
    gameState.wordsFound = 0;
    gameState.foundWords = [];
    updateScoreBoard();
    loadLevel();
}

// Load level
function loadLevel() {
    const level = Math.min(gameState.level, 5);
    const wordList = wordLists[level];
    const availableWords = wordList.words.filter(w => !gameState.foundWords.includes(w));
    
    if (availableWords.length === 0) {
        if (gameState.level < gameState.maxLevel) {
            gameState.level++;
            loadLevel();
            return;
        } else {
            showModal('🎉 Congratulations!', 'You completed all levels!', '🏆');
            return;
        }
    }
    
    // Pick random target word
    gameState.targetWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    gameState.hint = wordList.hints[gameState.targetWord];
    
    // Generate candy letters (include target word letters + some extras)
    generateCandyLetters();
    
    // Render
    renderTargetWord();
    renderCandyBoard();
    clearCurrentWord();
    hintDisplay.textContent = `Hint: ${gameState.hint}`;
    levelDisplay.textContent = gameState.level;
}

// Generate candy letters
function generateCandyLetters() {
    const targetLetters = gameState.targetWord.split('');
    const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const totalCandies = 12 + gameState.level * 2;
    
    gameState.candyLetters = [...targetLetters];
    
    // Add extra random letters
    while (gameState.candyLetters.length < totalCandies) {
        gameState.candyLetters.push(extraLetters[Math.floor(Math.random() * extraLetters.length)]);
    }
    
    // Shuffle
    gameState.candyLetters.sort(() => Math.random() - 0.5);
}

// Render target word
function renderTargetWord() {
    targetWordDisplay.innerHTML = '';
    gameState.targetWord.split('').forEach((letter, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'target-letter';
        letterDiv.id = `target-${index}`;
        letterDiv.textContent = '?';
        targetWordDisplay.appendChild(letterDiv);
    });
}

// Render candy board
function renderCandyBoard() {
    candyBoard.innerHTML = '';
    gameState.candyLetters.forEach((letter, index) => {
        const candy = document.createElement('div');
        candy.className = 'candy-piece';
        candy.dataset.index = index;
        candy.dataset.letter = letter;
        candy.style.background = candyColors[index % candyColors.length];
        candy.innerHTML = `
            <span style="font-size: 1.5rem; font-weight: bold; position: relative; z-index: 1;">${letter}</span>
            <span style="font-size: 1rem; position: absolute; bottom: 5px; opacity: 0.7;">${candyEmojis[index % candyEmojis.length]}</span>
        `;
        candy.addEventListener('click', () => selectCandy(candy));
        candyBoard.appendChild(candy);
    });
}

// Select candy
function selectCandy(candy) {
    const index = candy.dataset.index;
    const letter = candy.dataset.letter;
    
    if (candy.classList.contains('used')) return;
    
    candy.classList.add('used');
    gameState.currentWord.push(letter);
    gameState.selectedCandies.push(index);
    
    updateCurrentWordDisplay();
    playSound('click');
}

// Update current word display
function updateCurrentWordDisplay() {
    currentWordDisplay.innerHTML = '';
    gameState.currentWord.forEach(letter => {
        const tile = document.createElement('div');
        tile.className = 'letter-tile';
        tile.textContent = letter;
        currentWordDisplay.appendChild(tile);
    });
}

// Clear current word
function clearCurrentWord() {
    gameState.currentWord = [];
    gameState.selectedCandies = [];
    currentWordDisplay.innerHTML = '';
    
    // Reset all candies
    document.querySelectorAll('.candy-piece').forEach(candy => {
        candy.classList.remove('used');
    });
}

// Submit word
function submitWord() {
    const word = gameState.currentWord.join('');
    
    if (word.length < 2) {
        showModal('Oops!', 'Select more letters to make a word!', '🤔');
        return;
    }
    
    // Check if it matches target word
    if (word === gameState.targetWord) {
        handleCorrectWord();
    } else {
        // Check if it's a valid word (bonus points)
        if (isValidWord(word) && !gameState.foundWords.includes(word)) {
            handleBonusWord(word);
        } else {
            showModal('Try Again!', 'That\'s not the magic word. Keep trying!', '💪');
        }
    }
    
    clearCurrentWord();
}

// Handle correct word
function handleCorrectWord() {
    gameState.foundWords.push(gameState.targetWord);
    gameState.wordsFound++;
    gameState.score += 100 * gameState.level;
    
    // Reveal target word
    gameState.targetWord.split('').forEach((letter, index) => {
        const targetLetter = document.getElementById(`target-${index}`);
        targetLetter.textContent = letter;
        targetLetter.classList.add('revealed');
    });
    
    createParticles(20);
    playSound('success');
    
    setTimeout(() => {
        showModal(
            '🎉 Amazing!',
            `You found "${gameState.targetWord}"! +${100 * gameState.level} points`,
            '⭐'
        );
        
        updateScoreBoard();
        addFoundWord(gameState.targetWord);
        
        // Level up every 3 words
        if (gameState.wordsFound % 3 === 0 && gameState.level < gameState.maxLevel) {
            gameState.level++;
        }
    }, 500);
}

// Handle bonus word
function handleBonusWord(word) {
    gameState.foundWords.push(word);
    gameState.wordsFound++;
    gameState.score += 50 * gameState.level;
    
    createParticles(10);
    playSound('bonus');
    
    showModal(
        '🌟 Bonus Word!',
        `You found "${word}"! +${50 * gameState.level} bonus points`,
        '💎'
    );
    
    updateScoreBoard();
    addFoundWord(word);
}

// Add found word to list
function addFoundWord(word) {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'found-word';
    wordDiv.textContent = word;
    wordsList.appendChild(wordDiv);
}

// Update score board
function updateScoreBoard() {
    scoreDisplay.textContent = gameState.score;
    wordsFoundDisplay.textContent = gameState.wordsFound;
}

// Show modal
function showModal(title, message, reward) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalReward.textContent = reward;
    modal.classList.add('show');
}

// Hide modal
function hideModal() {
    modal.classList.remove('show');
    loadLevel();
}

// Create particles
function createParticles(count) {
    const emojis = ['⭐', '🌟', '💫', '✨', '🎉', '🎊', '🍬', '🍭'];
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '-50px';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            particlesContainer.appendChild(particle);
            
            setTimeout(() => particle.remove(), 4000);
        }, i * 100);
    }
}

// Simple word validation (common English words)
function isValidWord(word) {
    const commonWords = [
        'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'ANY', 'CAN',
        'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM',
        'HIS', 'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO',
        'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'CAT',
        'DOG', 'SUN', 'FUN', 'HAT', 'BAT', 'MAT', 'RUN', 'CUP', 'BUS',
        'FISH', 'BIRD', 'CAKE', 'PLAY', 'TREE', 'BOOK', 'FROG', 'STAR', 'RAIN', 'JUMP',
        'CANDY', 'HAPPY', 'WATER', 'PIZZA', 'MUSIC', 'DANCE', 'SMILE', 'CLOUD', 'DREAM', 'MAGIC'
    ];
    return commonWords.includes(word);
}

// Sound effects (placeholder - can be enhanced with actual audio)
function playSound(type) {
    // In a full implementation, you'd add actual sound files
    // For now, we'll just provide visual feedback
}

// Event Listeners
clearBtn.addEventListener('click', clearCurrentWord);
submitBtn.addEventListener('click', submitWord);
modalBtn.addEventListener('click', hideModal);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        submitWord();
    } else if (e.key === 'Escape') {
        clearCurrentWord();
    }
});

// Initialize game on load
window.addEventListener('load', initGame);
