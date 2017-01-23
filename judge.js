'use strict';

// Bitmasks used to determine if challenger won.
// little-endian (scissors paper rock)
// Array format [bitmask, winning bitwise OR]
//
// eg. challenger plays 'rock'; opponent plays scissors.
//
// rock = map.rock[0] = 1 (001)
// scissors = map.scissors[0] = 4 (100)
// 
// First: is this a tie (XOR)? 
// (1 ^ 4) !== (000) ∴ not a tie 
// (rock ^ rock (001 ^ 001) === (000) ∴ a tie [return -1])
//
// Did challenger win? 
// (1 | 4) = (101) = 5 === map.rock[1] ∴ challenger wins [return 1]
//
// Did opponent win?
// If the above test fails opponent must be winner [return 0]
//

let map = {
	rock:		[1, 5],
	paper:		[2, 3],
	scissors:	[4, 6]
};

module.exports = function judge(cha, opp) {

	let _cha = map[cha][0];
	let	_opp = map[opp][0];

	return !(_cha ^ _opp)
		? -1
		: map[cha][1] === (_cha | _opp)
			? 1
			: 0;
};