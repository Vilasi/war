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

// Call API to get deck code
async function initialAPICall() {
  try {
    const response = await axios.get(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );
    // console.log(response);
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
    this.losingCard = `${losingCardSuit} of ${losingCardValue}`;
    this.war = war;
  }
}

// Sets both players hands and prerequisite values for game start.
const playerHand = [],
  computerHand = [];
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

    for (let i = 0; i < loopLength; i++) {
      //   console.log(humanHand[i].image);
      if (!humanHand[i] || !pcHand[i]) {
        console.log('OUT OF VALUES', roundNumber);
        // break;
      }

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

      if (playerCard > computerCard) {
        // Player Hand Win
        computerScore--;
        playerScore++;

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

        if (warStorage.length > 0) {
          humanHand.push(...warStorage);
        }

        humanHand.push(pcHand[i]);
        humanHand.push(humanHand[i]);
        humanHand.splice(i, 1);
        pcHand.splice(i, 1);

        roundNumber++;

        break;
      } else if (computerCard > playerCard) {
        // Computer Hand Win

        computerScore++;
        playerScore--;

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

        if (warStorage.length > 0) {
          pcHand.push(...warStorage);
        }

        //
        pcHand.push(humanHand[i]);
        humanHand.splice(i, 1);
        pcHand.push(pcHand[i]);
        pcHand.splice(i, 1);

        roundNumber++;

        break;
      }

      // War - Player runs out of cards
      if (
        playerCard === computerCard &&
        humanHand.length < 5 &&
        pcHand.length > humanHand.length
      ) {
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
        computerScore = 0;

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

      //   Final Tie at War
      if (
        playerCard === computerCard &&
        pcHand.length === 1 &&
        humanHand === 1
      ) {
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
        for (let j = 0; j < 4; j++) {
          warStorage.push(humanHand[j]);
          warStorage.push(pcHand[j]);

          computerScore--;
          playerScore--;

          gameRecord.push({
            round: roundNumber,
            winner: 'War',
            playerScore: playerScore,
            computerScore: computerScore,
            playerCardPicture: humanHand[i].image,
            computerCardPicture: pcHand[i].image,
            war: true,
          });

          humanHand.shift();
          pcHand.shift();
        }
        break;
      }

      pcHand.length = 0;
      humanHand.length = 0;
      // console.log(pcHand.length, humanHand.length);

      //     pcHand.length > humanHand.length) {
    }

    console.log(
      `playerScore: ${playerScore}`,
      `computerScore: ${computerScore}`,
      gameRecord[gameRecord.length - 1]
    );
  }

  // console.log(playerHand, computerHand);
  // console.log(humanHand, pcHand);

  document.querySelector('#play-one-round-button').classList.remove('d-none');
}

// START GAME BUTTON
const startButton = document.querySelector('#new-game-button');
startButton.addEventListener('click', startGame); //////////////////////// UNCOMMENT

// Play Round Button Event Listener
const playOneRoundButton = document.querySelector('#play-one-round-button');
playOneRoundButton.addEventListener('click', () => {});

// (async function () {
//   try {
//     // const test = await
//     return await getFullDeck();
//   } catch (error) {
//     console.log(error);
//   }
// })();
