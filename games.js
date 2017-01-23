'use strict';

let util = require('util');
let judge = require('./judge');

let games = {};

// Icons used in message composition. See below.
//
let emoji = {
	rock: ':trollface:',
	paper: ':page_facing_up:',
	scissors: ':scissors:',
	tie : ':bowtie:'
};

module.exports = bot => {

	return {
	
		// When we get rock|paper|scissors, check if there is a game
		// in play, and if so send the result.
		//
		finish(opponent, choice) {

			let g;
			let chaChoice;
			let result;
			let msgParams;

			// Is there an active game w/ this challenger & opponent?
			//
			for(g in games) {
				if(games[g] && games[g].opponent === opponent) {

					chaChoice = games[g].choice;
					result = judge(chaChoice, choice);

					// -1 = tie
					// 1 = challenger won
					// 0 = opponent won
					//
					let finalResult = result === -1
						? 'tie'
						: result === 1
							? util.format("@%s's %s defeats @%s's %s",
								g,
								emoji[chaChoice],
								opponent,
								emoji[choice]
							)
							: util.format("@%s's %s defeats @%s's %s",
								opponent,
								emoji[choice],
								g,
								emoji[chaChoice]
							);

					// Clear game. Might want to store games here.
					//
					games[g] = false;

					msgParams = {
						icon_emoji:	emoji[result === 1 ? chaChoice : result === 0 ? choice : 'tie']
					};

					// Tell challenger, opponent what the result was.
					//
					bot.postMessageToUser(g, finalResult, msgParams);
					bot.postMessageToUser(opponent, finalResult, msgParams);

					return;
				}
			}

			// Opponent sent response but there was no game set up.
			//
			bot.postMessageToUser(opponent, 'You have not been challenged to a game. Maybe create one!');
		},

		// Called whenever a challenger wants to start a game.
		//
		create(challenger, opponent, choice) {

			let gameOn = games[challenger];

			if(gameOn) {

				if(this.hasAlreadyStarted(challenger, opponent)) {
					return bot.postMessageToUser(challenger, util.format("You've already sent a challenge to @%s!", opponent));
				}

				return bot.postMessageToUser(challenger, util.format("You already have a game on with @%s! One game at a time...", gameOn.opponent));
			}

			// Can only challenge one game at a time.
			//
			games[challenger] = {
				opponent: opponent,
				choice: choice
			};

			bot.postMessageToUser(challenger, util.format('Game started...waiting for @%s', opponent), {
				icon_emoji:	emoji[choice]
			});
		},

		hasAlreadyStarted(challenger, opponent) {

			return (games[challenger] || {}).opponent === opponent;
		},

		cancel(game) {
		}
	}
};