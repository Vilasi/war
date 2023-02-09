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

// function war(playerHand, computerHand) {}

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
  const playerComparisonHand = [...playerHand];
  const computerComparisonHand = [...computerHand];
  let warStorage = [];

  let roundCounterPlayer = playerComparisonHand.length;
  let roundCounterComputer = computerComparisonHand.length;
  //   console.log(computerComparisonHand);

  while (roundCounterPlayer > 0 && roundCounterComputer > 0) {
    // Determines how long the below for loop will run
    if (playerComparisonHand.length < computerComparisonHand.length) {
      loopLength = playerComparisonHand.length;
    } else if (computerComparisonHand.length < playerComparisonHand.length) {
      loopLength = computerComparisonHand.length;
    }

    // console.log(warStorage);
    // console.log(
    //   { playerHand: playerComparisonHand.length },
    //   { computerHand: computerComparisonHand.length }
    //   //   gameRecord
    // );

    // console.log(warStorage);
    // console.log(playerComparisonHand.length, computerComparisonHand.length);

    for (let i = 0; i < loopLength; i++) {
      //   console.log(playerComparisonHand[i].image);
      if (!playerComparisonHand[i] || !computerComparisonHand[i]) {
        console.log('OUT OF VALUES', roundNumber);
        // break;
      }

      const playerCard = playerComparisonHand[i].comparisonValue;
      const computerCard = computerComparisonHand[i].comparisonValue;

      console.log(
        roundCounterPlayer,
        roundCounterComputer,
        gameRecord[gameRecord.length - 1]
      );

      //   playerComparisonHand.length === 0;

      if (
        playerComparisonHand[i].comparisonValue >
        computerComparisonHand[i].comparisonValue
      ) {
        // Player Hand Win
        roundCounterComputer--;
        roundCounterPlayer++;

        gameRecord.push({
          round: roundNumber,
          winner: 'Player',
          playerCardPicture: playerComparisonHand[i].image,
          computerCardPicture: computerComparisonHand[i].image,
          winningCard: `${playerComparisonHand[i].value} of ${playerComparisonHand[i].suit}`,
          losingCard: `${computerComparisonHand[i].value} of ${computerComparisonHand[i].suit}`,
          war: false,
        });

        if (warStorage.length > 0) {
          playerComparisonHand.push(...warStorage);
        }

        playerComparisonHand.push(computerComparisonHand[i]);
        playerComparisonHand.push(playerComparisonHand[i]);
        playerComparisonHand.splice(i, 1);
        computerComparisonHand.splice(i, 1);

        roundNumber++;

        break;
      } else if (
        computerComparisonHand[i].comparisonValue >
        playerComparisonHand[i].comparisonValue
      ) {
        // Computer Hand Win

        roundCounterComputer++;
        roundCounterPlayer--;
        gameRecord.push({
          round: roundNumber,
          winner: 'Computer',
          playerCardPicture: playerComparisonHand[i].image,
          computerCardPicture: computerComparisonHand[i].image,
          winningCard: `${computerComparisonHand[i].value} of ${computerComparisonHand[i].suit}`,
          losingCard: `${playerComparisonHand[i].value} of ${playerComparisonHand[i].suit}`,
          war: false,
        });

        if (warStorage.length > 0) {
          computerComparisonHand.push(...warStorage);
        }

        //
        computerComparisonHand.push(playerComparisonHand[i]);
        playerComparisonHand.splice(i, 1);
        computerComparisonHand.push(computerComparisonHand[i]);
        computerComparisonHand.splice(i, 1);

        roundNumber++;

        break;
      }

      // War - Player runs out of cards
      if (
        playerCard === computerCard &&
        playerComparisonHand.length < 5 &&
        computerComparisonHand.length > playerComparisonHand.length
      ) {
        roundCounterPlayer = 0;
        gameRecord.push({
          round: roundNumber,
          winner: 'Computer',
          playerCardPicture: playerComparisonHand[i].image,
          computerCardPicture: computerComparisonHand[i].image,
          winningCard: `${computerComparisonHand[i].value} of ${computerComparisonHand[i].suit}`,
          losingCard: `${playerComparisonHand[i].value} of ${playerComparisonHand[i].suit}`,
          war: true,
        });
        computerComparisonHand.length = 0;
        playerComparisonHand.length = 0;

        break;
      }

      // War - Computer runs out of cards
      if (
        playerCard === computerCard &&
        computerComparisonHand.length < 5 &&
        playerComparisonHand.length > computerComparisonHand.length
      ) {
        roundCounterComputer = 0;
        gameRecord.push({
          round: roundNumber,
          winner: 'Computer',
          playerCardPicture: playerComparisonHand[i].image,
          computerCardPicture: computerComparisonHand[i].image,
          winningCard: `${computerComparisonHand[i].value} of ${computerComparisonHand[i].suit}`,
          losingCard: `${playerComparisonHand[i].value} of ${playerComparisonHand[i].suit}`,
          war: true,
        });
        computerComparisonHand.length = 0;
        playerComparisonHand.length = 0;
        break;
      }

      //   Final Tie at War
      if (
        playerCard === computerCard &&
        computerComparisonHand.length === 1 &&
        playerComparisonHand === 1
      ) {
        roundCounterComputer = 0;
        roundCounterPlayer = 0;
        gameRecord.push({
          round: roundNumber,
          winner: 'Tie',
          playerCardPicture: playerComparisonHand[i].image,
          computerCardPicture: computerComparisonHand[i].image,
          war: true,
        });

        computerComparisonHand.length = 0;
        playerComparisonHand.length = 0;

        break;
      }

      //   War
      if (
        playerCard === computerCard &&
        computerComparisonHand.length >= 5 &&
        playerComparisonHand.length >= 5
      ) {
        for (let j = 0; j < 4; j++) {
          warStorage.push(playerComparisonHand[j]);
          warStorage.push(computerComparisonHand[j]);

          roundCounterComputer--;
          roundCounterPlayer--;

          gameRecord.push({
            round: roundNumber,
            winner: 'War',
            playerCardPicture: playerComparisonHand[i].image,
            computerCardPicture: computerComparisonHand[i].image,
            war: true,
          });

          playerComparisonHand.shift();
          computerComparisonHand.shift();
        }
        break;
      }

      computerComparisonHand.length = 0;
      playerComparisonHand.length = 0;
      // console.log(computerComparisonHand.length, playerComparisonHand.length);

      //     computerComparisonHand.length > playerComparisonHand.length) {
    }

    // Determine if one player has insufficient cards - Ie, Lose by default
    //   if (
    //     playerComparisonHand.length < 4 &&
    //     computerComparisonHand.length > playerComparisonHand.length
    //   ) {
    //     gameRecord.push({
    //       round: roundNumber,
    //       winner: 'Computer',
    //       playerCardPicture: playerComparisonHand[i].image,
    //       computerCardPicture: computerComparisonHand[i].image,
    //       winningCard: `${computerComparisonHand[i].value} of ${computerComparisonHand[i].suit}`,
    //       losingCard: `${playerComparisonHand[i].value} of ${playerComparisonHand[i].suit}`,
    //       war: true,
    //     });

    //     computerComparisonHand.length = 0;
    //     playerComparisonHand.length = 0;
    //     break;
    //   } else if (
    //     playerComparisonHand.length > computerComparisonHand.length &&
    //     computerComparisonHand.length < 4
    //   ) {
    //     gameRecord.push({
    //       round: roundNumber,
    //       winner: 'Player',
    //       playerCardPicture: playerComparisonHand[i].image,
    //       computerCardPicture: computerComparisonHand[i].image,
    //       winningCard: `${playerComparisonHand[i].value} of ${playerComparisonHand[i].suit}`,
    //       losingCard: `${computerComparisonHand[i].value} of ${computerComparisonHand[i].suit}`,
    //       war: true,
    //     });

    //     computerComparisonHand.length = 0;
    //     playerComparisonHand.length = 0;
    //     break;
    //   }

    //   const playerWarStorage = [];
    //   const computerWarStorage = [];
    //   for (let j = 0; j < 4; j++) {

    //   }
  }

  // console.log(playerHand, computerHand);
  // console.log(playerComparisonHand, computerComparisonHand);

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
