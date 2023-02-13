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

    const firstHalfOfDeck = 26;
    if (i < firstHalfOfDeck) {
      playerHand.push(deckOfCards[i]);
    } else {
      computerHand.push(deckOfCards[i]);
    }
  }

  let loopLength = 26;
  let roundNumber = 0;
  const humanHand = [...playerHand];
  const pcHand = [...computerHand];
  let warStorage = [];

  let playerScore = humanHand.length;
  let computerScore = pcHand.length;

  while (playerScore > 0 && computerScore > 0) {
    // Determines how long the below for loop will run
    if (humanHand.length < pcHand.length) {
      loopLength = humanHand.length;
    } else if (pcHand.length < humanHand.length) {
      loopLength = pcHand.length;
    }

    /////////////////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    for (let i = 0; i < loopLength; i++) {
      // console.log(loopLength);
      // if (!humanHand[i] || !pcHand[i]) {
      //   console.log(
      //     'OUT OF VALUES',
      //     roundNumber,
      //     humanHand,
      //     pcHand,
      //     gameRecord
      //   );
      //   // break;
      // }

      if (playerScore === 0) {
        break;
      }

      if (computerScore === 0) {
        break;
      }

      //Assign Comparing Card Values to Variables
      const playerCard = humanHand[i].comparisonValue;
      const computerCard = pcHand[i].comparisonValue;

      //   humanHand.length === 0;

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

        //
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
        humanHand.length < 5 &&
        pcHand.length > humanHand.length
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
        pcHand.length = 0;
        humanHand.length = 0;

        break;
      }

      // War - Computer runs out of cards
      if (
        playerCard === computerCard &&
        pcHand.length < 5 &&
        humanHand.length > pcHand.length
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

        pcHand.length = 0;
        humanHand.length = 0;
        break;
      }

      //   Final Tie at War
      if (
        playerCard === computerCard &&
        pcHand.length === 1 &&
        humanHand.length === 1
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

        pcHand.length = 0;
        humanHand.length = 0;

        break;
      }

      //   War
      if (
        playerCard === computerCard &&
        pcHand.length >= 5 &&
        humanHand.length >= 5
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

        // });
        break;
      }
    }

    // console.log(
    //   `playerScore: ${playerScore}`,
    //   `computerScore: ${computerScore}`,
    //   gameRecord[gameRecord.length - 1]
    //   // humanHand,
    //   // pcHand
    // );
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

// START GAME BUTTON
const startButton = document.querySelector('#new-game-button');
startButton.addEventListener('click', startGame);

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
