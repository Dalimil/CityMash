"use strict";

const COOKIE_SEEN_KEY = "seen-cities";
const COOKIE_FAV_KEY = "fav-cities";

function getFav(cookies) {
	let x = cookies.get(COOKIE_FAV_KEY);
	if(x == undefined) return null;
	return JSON.parse(x);
}

function getSeen(cookies) {
	let x = cookies.get(COOKIE_SEEN_KEY);
	if(x == undefined) return null;
	return JSON.parse(x);
}

function clearSeen(cookies) {
	cookies.set(COOKIE_SEEN_KEY, JSON.stringify([]));
}

module.exports = {
	init: (cookies) => {
		if(getFav(cookies) == null) {
			cookies.set(COOKIE_FAV_KEY, JSON.stringify({}), { httpOnly: false });
		}
		if(getSeen(cookies) == null) {
			clearSeen(cookies);
		}
	},
	clear: clearSeen,
	getSeen: getSeen,
	getFav: getFav,
	addSeen: (cookies, value) => {
		let newList = getSeen(cookies);
		newList.push(value);
		cookies.set(COOKIE_SEEN_KEY, JSON.stringify(newList));
	},
	updateFav: (cookies, data) => {
		let newList = getFav(cookies);
		console.log(newList);
		newList[data.name] = data.add;
		cookies.set(COOKIE_FAV_KEY, JSON.stringify(newList), { httpOnly: false });
	}

};
