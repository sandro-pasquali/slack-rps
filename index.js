'use strict';

let util = require('util');
let Bot = require('slackbots');

let settings = {
    token: process.env.TOKEN,
    name: 'rps'
};

let bot = new Bot(settings);

let Games = require('./games')(bot);
let Users = require('./users')(bot);
let Channels = require('./channels')(bot);

Users.update();
Channels.update();

function normalizeChoice(cho) {

	cho = cho.toLowerCase();

	return cho === 'scissor' ? 'scissors' : cho;
}

bot.on('start', () => {
	console.log('bot started');
});

bot.on('open', () => {
	console.log('socket open');
});

bot.on('close', () => {
	console.log('socket closed');
});

bot.on('message', mess => {
	
	//console.log(mess);

	let response;
	
	switch(mess.type) {
	
		// Whenever a user enters, update user list
		//
		case 'presence_change':
		
			if(mess.presence === 'active') {
				Users.update(mess.user);
			}
		
		break;
		
		// Either a game request or a game response
		//
		case 'message':
				
			let choice;
			let opponent;
			
			// The real name of the user who sent the message
			//
			let senderName = Users.get(mess.user).name;
			
			// Did we get something like rock@sandro?
			//
			let gameRequest = mess.text.match(/(rock|paper|scissors|scissor)@([a-z]+)/i);

			if(gameRequest) {
			
				opponent = gameRequest[2];
				choice = normalizeChoice(gameRequest[1]);
				
				if(!Users.get(opponent)) {
					return bot.postMessageToUser(senderName, util.format("@%s is not available.", opponent));
				}
								
				return Games.create(senderName, opponent, choice);
			}
			
			// Response to a challenge?
			//
			response = mess.text.match(/\s?(rock|paper|scissors|scissor)\s?/i);
			
			if(response) {
				Games.finish(senderName, normalizeChoice(response[1]));
			}
			
		break;
		
		default:
		break;
	}
});