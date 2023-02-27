//////////////////////////////////////////////////////////////////////////////////////////////////////
// GET A deck of cards
// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
//// {
////     "success": true,
////     "deck_id": "3p40paa87x90",
////     "shuffled": true,
////     "remaining": 52
//// }
//////////////////////////////////////////////////////////////////////////////////////////////////////
// GET Draw n number of cards
// https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2
//// {
////     "success": true,
////     "deck_id": "kxozasf3edqu",
////     "cards": [
////         {
////             "code": "6H",
////             "image": "https://deckofcardsapi.com/static/img/6H.png",
////             "images": {
////                           "svg": "https://deckofcardsapi.com/static/img/6H.svg",
////                           "png": "https://deckofcardsapi.com/static/img/6H.png"
////                       },
////             "value": "6",
////             "suit": "HEARTS"
////         },
////         {
////             "code": "5S",
////             "image": "https://deckofcardsapi.com/static/img/5S.png",
////             "images": {
////                           "svg": "https://deckofcardsapi.com/static/img/5S.svg",
////                           "png": "https://deckofcardsapi.com/static/img/5S.png"
////                       },
////             "value": "5",
////             "suit": "SPADES"
////         }
////     ],
////     "remaining": 50
//// }

// class Game {
//   constructor() {
//     this.deckOfCards = this.getFullDeck();
//   }
// }

const playerCardImage = document.querySelector('#player-card-img');
const pcCardImage = document.querySelector('#computer-card-img');

const figure = document.querySelector('.stack');

const introCardToBeAnimated = document.querySelectorAll('.card');
const shuffleAudio = new Audio('./audio/card-shuffle.wav');

const cardImg = `<img
              class="w-100 img-fluid round card-img"
              id="player-card-img"
              src="./images/playing-card-back.jpg"
              alt="card"
            />`;

// https://codepen.io/richardramsay/pen/ZRLzPg
// ^Check this out for card animation

// window.addEventListener('load', () => {
//   const audio = new Audio('./audio/card-shuffle.wav');
//   audio.play();
// });

// Call API to get deck code
async function initialAPICall() {
  try {
    const response = await axios.get(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );

    return response.data.deck_id;
  } catch (error) {
    console.log(error);
  }
}

// Use deck code to get 1 full deck of cards
async function getFullDeck() {
  try {
    const deckID = await this.initialAPICall();
    const response = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`
    );

    return response.data.cards;
  } catch (error) {
    console.log(error);
  }
}

class GameResult {
  constructor(
    round,
    winner,
    playerScore,
    computerScore,
    humanCardPic,
    pcCardPic,
    winningCardSuit,
    winningCardValue,
    losingCardSuit,
    losingCardValue,
    war
  ) {
    this.round = round;
    this.winner = winner;
    (this.playerScore = playerScore),
      (this.computerScore = computerScore),
      (this.humanCardPic = humanCardPic);
    this.pcCardPic = pcCardPic;
    this.winningCard = `${winningCardValue} of ${winningCardSuit}`;
    this.losingCard = `${losingCardValue} of ${losingCardSuit}`;
    this.war = war;
  }
}

// Sets both players hands and prerequisite values for game start.
const playerHand = [];
const computerHand = [];
const gameRecord = [];

async function startGame() {
  // Get Full Deck of Cards
  const deckOfCards = await getFullDeck();

  // Divide deck into two halves
  for (let i = 0; i < deckOfCards.length; i++) {
    const value = deckOfCards[i].value;

    // Add property named comparisonValue (typeof === "number") to each card for later comparison
    if (value === 'JACK') {
      deckOfCards[i].comparisonValue = 11;
    } else if (value === 'QUEEN') {
      deckOfCards[i].comparisonValue = 12;
    } else if (value === 'KING') {
      deckOfCards[i].comparisonValue = 13;
    } else if (value === 'ACE') {
      deckOfCards[i].comparisonValue = 14;
    } else {
      deckOfCards[i].comparisonValue = Number(value);
    }

    // Create Player Hand of Cards and Computer Hand of Cards
    const firstHalfOfDeck = 26;
    if (i < firstHalfOfDeck) {
      playerHand.push(deckOfCards[i]);
    } else {
      computerHand.push(deckOfCards[i]);
    }
  }

  //Create copies of player and computer hand to work on during the game.
  //variables (playerHand) and (computerHand) work as a record of the player's hand from before the game begins
  const humanHand = [...playerHand];
  const pcHand = [...computerHand];
  let loopLength = 26;
  let roundNumber = 0;
  let warStorage = [];

  //The player's (or computer's) score will always be determined by the length of the cards held in hand (variables: humanHand, pcHand)
  let playerScore = humanHand.length;
  let computerScore = pcHand.length;

  // The while loop will end whenever either the player's or computer's score reaches 0
  while (playerScore > 0 && computerScore > 0) {
    // Determines how long the below for loop will run
    // At the start of each iteration of the while loop, set the length of the Line 181 For Loop to the lowest score: either playerScore or computer Score
    if (playerScore < computerScore) {
      loopLength = playerScore;
    } else if (computerScore < playerScore) {
      loopLength = computerScore;
    }

    /////////////////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    for (let i = 0; i < loopLength; i++) {
      if (playerScore === 0) {
        break;
      }

      if (computerScore === 0) {
        break;
      }

      //Assign Comparing Card Values to Variables
      const playerCard = humanHand[i].comparisonValue;
      const computerCard = pcHand[i].comparisonValue;

      //   playerScore === 0;

      // PLAYER HAND WIN
      if (playerCard > computerCard) {
        console.log('player win line 204');
        computerScore--;
        playerScore++;

        if (warStorage.length > 0) {
          playerScore += warStorage.length;
          humanHand.push(...warStorage);
          warStorage = [];
        }

        gameRecord.push(
          new GameResult(
            roundNumber,
            'Player',
            playerScore,
            computerScore,
            humanHand[i].image,
            pcHand[i].image,
            humanHand[i].suit,
            humanHand[i].value,
            pcHand[i].suit,
            pcHand[i].value,
            false
          )
        );

        humanHand.push(pcHand[i]);
        humanHand.push(humanHand[i]);
        // humanHand.splice(i, 1);
        // pcHand.splice(i, 1);

        humanHand.shift();
        pcHand.shift();

        roundNumber++;

        break;
      } else if (computerCard > playerCard) {
        console.log('computer win line 243');
        // Computer Hand Win

        computerScore++;
        playerScore--;

        if (warStorage.length > 0) {
          computerScore += warStorage.length;
          pcHand.push(...warStorage);
          warStorage = [];
        }

        gameRecord.push(
          new GameResult(
            roundNumber,
            'Computer',
            playerScore,
            computerScore,
            humanHand[i].image,
            pcHand[i].image,
            pcHand[i].suit,
            pcHand[i].value,
            humanHand[i].suit,
            humanHand[i].value,
            true
          )
        );

        pcHand.push(humanHand[i]);
        pcHand.push(pcHand[i]);

        pcHand.shift();
        humanHand.shift();

        roundNumber++;

        break;
      }

      // War - Player runs out of cards
      if (
        playerCard === computerCard &&
        playerScore < 5 &&
        computerScore > playerScore
      ) {
        console.log('War - Player runs out of cards line 291');
        playerScore = 0;

        gameRecord.push(
          new GameResult(
            roundNumber,
            'Computer',
            playerScore,
            computerScore,
            humanHand[i].image,
            pcHand[i].image,
            pcHand[i].suit,
            pcHand[i].value,
            humanHand[i].suit,
            humanHand[i].value,
            true
          )
        );

        break;
      }

      // War - Computer runs out of cards
      if (
        playerCard === computerCard &&
        computerScore < 5 &&
        playerScore > computerScore
      ) {
        console.log('War - Computer runs out of cards line 321');
        computerScore = 0;

        gameRecord.push(
          new GameResult(
            roundNumber,
            'Player',
            playerScore,
            computerScore,
            humanHand[i].image,
            pcHand[i].image,
            pcHand[i].suit,
            pcHand[i].value,
            humanHand[i].suit,
            humanHand[i].value,
            true
          )
        );

        break;
      }

      //   Final Tie at War
      if (
        playerCard === computerCard &&
        computerScore === 1 &&
        playerScore === 1
      ) {
        console.log('War - Tie  line 351');
        computerScore = 0;
        playerScore = 0;
        gameRecord.push({
          round: roundNumber,
          winner: 'Tie',
          playerScore: playerScore,
          computerScore: computerScore,
          playerCardPicture: humanHand[i].image,
          computerCardPicture: pcHand[i].image,
          war: true,
        });

        break;
      }

      //   War
      if (
        playerCard === computerCard &&
        computerScore >= 5 &&
        playerScore >= 5
      ) {
        console.log('War - line 376');
        const roundResults = {
          playerCardPicture: humanHand[i].image,
          computerCardPicture: pcHand[i].image,
        };

        for (let j = 0; j < 4; j++) {
          warStorage.push(humanHand[j]);
          warStorage.push(pcHand[j]);

          computerScore--;
          playerScore--;
        }
        for (let j = 0; j < 4; j++) {
          humanHand.shift();
          pcHand.shift();
        }

        roundResults.round = roundNumber;
        roundResults.winner = 'War';
        roundResults.playerScore = playerScore;
        roundResults.computerScore = computerScore;
        roundResults.war = true;

        gameRecord.push(roundResults);

        break;
      }
    }

    // Below console log shows the results of the game
    console.log(
      `playerScore: ${playerScore}`,
      `computerScore: ${computerScore}`,
      gameRecord[gameRecord.length - 1]
      // humanHand,
      // pcHand
    );
  }

  document.querySelector('#play-one-round-button').classList.remove('d-none');

  document.querySelector('#player-card-img').src =
    './images/playing-card-back.jpg';

  document.querySelector('#computer-card-img').src =
    './images/playing-card-back.jpg';

  const title = document.querySelectorAll('.title');
  title.forEach((tag) => tag.classList.remove('d-none'));
  console.log(title);
}

// START GAME
const startButton = document.querySelector('#new-game-button');

//----Event listeners to stat game
startButton.addEventListener('click', startGame);

startButton.addEventListener('click', () => {
  const shuffleGif = document.querySelector('#shuffle-gif');
  // for (let card of introCardToBeAnimated) {
  //   card.classList.add('card-animation');
  // }

  shuffleGif.classList.remove('d-none');
  shuffleGif.src = './images/gif/shuffle.gif';
  setTimeout(() => {
    shuffleAudio.play();
  }, 1010);

  setTimeout(() => {
    shuffleGif.classList.add('d-none');
  }, 3650);
  // Delete card, reincorporate a single card :)
  // setTimeout(() => {
  //   // figure.classList.add('d-none');
  //   figure.innerHTML = '';

  //   const cardDiv = document.createElement('div');
  //   const img = document.createElement('img');
  //   cardDiv.classList.add('card');
  //   img.classList.add('w-100', 'img-fluid', 'round', 'card-img');
  //   img.setAttribute('src', './images/playing-card-back.jpg');

  //   cardDiv.append(img);
  //   figure.append(cardDiv);
  // }, 2500);
});

// {
/* <img
  class="w-100 img-fluid round card-img"
  id="player-card-img"
  src="./images/playing-card-back.jpg"
  alt="card"
/>; */
// }

// Card Images
const cardImages = document.querySelectorAll('.card-img');

// Play Round Button Event Listener
const playOneRoundButton = document.querySelector('#play-one-round-button');
let roundCounter = -1;
playOneRoundButton.addEventListener('click', () => {
  // const playerCardImage = document.querySelector('#player-card-img');
  // const pcCardImage = document.querySelector('#computer-card-img');
  const playerTitleText = document.querySelector('#player-title-text');
  const pcTitleText = document.querySelector('#pc-title-text');

  roundCounter++;

  playerCardImage.src = gameRecord[roundCounter].humanCardPic;
  pcCardImage.src = gameRecord[roundCounter].pcCardPic;

  if (gameRecord[roundCounter].winner === 'Player') {
    playerTitleText.textContent = 'You Win!';
    pcTitleText.textContent = 'You Lose!';

    pcTitleText.classList.add('bg-danger');
    playerTitleText.classList.add('bg-success');

    playerTitleText.classList.remove('bg-danger');
    pcTitleText.classList.remove('bg-success');
  } else {
    playerTitleText.textContent = 'You Lose!';
    pcTitleText.textContent = 'You Win!';

    playerTitleText.classList.add('bg-danger');
    pcTitleText.classList.add('bg-success');

    playerTitleText.classList.remove('bg-success');
    pcTitleText.classList.remove('bg-danger');
  }

  console.log(gameRecord[roundCounter]);
});

if (window.innerWidth < 576) {
  cardImages.forEach((image) => {
    image.classList.remove('me-5');
    // image.classList.add('.even-margins');
    image.classList.remove('w-75');
    image.classList.add('w-90');
  });
}
