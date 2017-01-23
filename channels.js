'use strict';

let ChannelsById = {};
let ChannelsByName = {};

module.exports = bot => {

	return {
	
		// Get channel by either id or real name, or null
		//
		get(channel) {
			
			let uObj = ChannelsByName[channel];
			
			if(uObj) {
				return uObj;
			}
			
			uObj = ChannelsById[channel];
			
			if(uObj) {
				return uObj;
			}
			
			return false;
		},

		// Get all channels and store in local map by both id and real name.
		//
		update() {
			
			bot.getChannels()
			.then(channels => {

				channels.channels.forEach(uObj => {
					ChannelsById[uObj.id] = uObj;
					ChannelsByName[uObj.name] = uObj;
				});
			});
		}
	};
};