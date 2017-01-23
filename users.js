'use strict';

let UsersById = {};
let UsersByName = {};

module.exports = bot => {

	return {
	
		// Get user object by either id or real name, or null
		//
		get(user) {
			
			let uObj = UsersByName[user];
			
			if(uObj) {
				return uObj;
			}
			
			uObj = UsersById[user];
			
			if(uObj) {
				return uObj;
			}
			
			return false;
		},
		
		// Get all users and store in local map by both id and real name.
		// Note: don't store bots
		//
		update() {

			bot.getUsers()
			.then(users => users.members.forEach(uObj => {
				if(!uObj.is_bot && uObj.name !== 'slackbot') {
					UsersById[uObj.id] = uObj;
					UsersByName[uObj.name] = uObj;
				}
			}));
		}
	};
};