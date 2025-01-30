const deck = [];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let playerHand = [];
let dealerHand = [];

function createDeck() {
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === 'A').length;
    while (value > 21 && aces) {
        value -= 10;
        aces -= 1;
    }
    return value;
}

function startGame() {
    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateGameState();
}

function updateGameState() {
    document.getElementById('player-hand').innerHTML = playerHand.map(card => `<div class="card">${card.value}</div>`).join('');
    document.getElementById('dealer-hand').innerHTML = dealerHand.map(card => `<div class="card">${card.value}</div>`).join('');
    document.getElementById('player-score').innerText = `Score: ${calculateHandValue(playerHand)}`;
    document.getElementById('dealer-score').innerText = `Score: ${calculateHandValue(dealerHand)}`;
}

document.getElementById('hit-button').addEventListener('click', () => {
    playerHand.push(deck.pop());
    updateGameState();
    checkWinConditions();
});

document.getElementById('stand-button').addEventListener('click', () => {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    updateGameState();
    checkWinConditions();
});

document.getElementById('restart-button').addEventListener('click', startGame);

document.getElementById('bet-50').addEventListener('click', () => placeBet(50));
document.getElementById('bet-100').addEventListener('click', () => placeBet(100));
document.getElementById('bet-1000').addEventListener('click', () => placeBet(1000));
document.getElementById('bet-all-in').addEventListener('click', () => placeBet('all'));

function placeBet(amount) {
    console.log(`Placed a bet of ${amount}`);
}

function checkWinConditions() {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);
    let result = '';

    if (playerScore > 21) {
        result = 'You lose!';
    } else if (dealerScore > 21) {
        result = 'Dealer busts, you win!';
    } else if (playerScore === 21 && playerHand.length === 2) {
        result = 'Blackjack! You win!';
    } else if (dealerScore === 21 && dealerHand.length === 2) {
        result = 'Blackjack! Dealer wins!';
    } else if (dealerScore >= 17 && playerScore > dealerScore) {
        result = 'You win!';
    } else if (dealerScore >= 17 && playerScore < dealerScore) {
        result = 'Dealer wins!';
    } else if (dealerScore >= 17 && playerScore === dealerScore) {
        result = 'It\'s a tie!';
    }

    if (result) {
        document.getElementById('result').innerText = result;
        document.getElementById('hit-button').disabled = true;
        document.getElementById('stand-button').disabled = true;
    }
}

startGame();
