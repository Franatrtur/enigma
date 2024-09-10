//Enigma.js v1.2 by FranaTrtur
//Enigma machine real-time emulator

/*MIT LICENSE

Copyright (c) 2019 František Artur Čech
Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var Enigma = {};

Enigma.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
Enigma.rotors = [];
Enigma.rotors[0] = {
	wiring: [],
	position: 0,
	tick: function(){
		Enigma.rotors[0].position = (Enigma.rotors[0].position + 1) % 26;
		Enigma.rotors[0].wiring = Enigma.rotors[0].wiring.slice(1).concat(Enigma.rotors[0].wiring.slice(0, 1));
		if(Enigma.rotors[0].position == 0)
			Enigma.rotors[1].tick();
	},
	setRotor: function(wiring, position){
		wiring = Array.isArray(wiring) && wiring.length == 26 ? wiring : Enigma.wirings[0];
		position = typeof position != "number" ? 0 : Math.abs(position) % 26;
		Enigma.rotors[0].wiring = wiring.slice(position).concat(wiring.slice(0, position));
		Enigma.rotors[0].position = position;
	}
};
Enigma.rotors[1] = {
	wiring: [],
	position: 0,
	tick: function(){
		Enigma.rotors[1].position = (Enigma.rotors[1].position + 1) % 26;
		Enigma.rotors[1].wiring = Enigma.rotors[1].wiring.slice(1).concat(Enigma.rotors[1].wiring.slice(0, 1));
		if(Enigma.rotors[1].position == 0)
			Enigma.rotors[2].tick();
	},
	setRotor: function(wiring, position){
		wiring = Array.isArray(wiring) && wiring.length == 26 ? wiring : Enigma.wirings[1];
		position = typeof position != "number" ? 0 : Math.abs(position) % 26;
		Enigma.rotors[1].wiring = wiring.slice(position).concat(wiring.slice(0, position));
		Enigma.rotors[1].position = position;
	}
};
Enigma.rotors[2] = {
	wiring: [],
	position: 0,
	tick: function(){
		Enigma.rotors[2].position = (Enigma.rotors[2].position + 1) % 26;
		Enigma.rotors[2].wiring = Enigma.rotors[2].wiring.slice(1).concat(Enigma.rotors[2].wiring.slice(0, 1));
	},
	setRotor: function(wiring, position){
		wiring = Array.isArray(wiring) && wiring.length == 26 ? wiring : Enigma.wirings[2];
		position = typeof position != "number" ? 0 : Math.abs(position) % 26;
		Enigma.rotors[2].wiring = wiring.slice(position).concat(wiring.slice(0, position));
		Enigma.rotors[2].position = position;
	}
};

Enigma.wirings = [
	[9, 22, 5, 12, 7, 13, 1, 15, 20, 18, 3, 24, 19, 8, 23, 21, 25, 6, 17, 16, 11, 0, 14, 4, 10, 2],
	[4, 10, 12, 5, 11, 6, 3, 16, 21, 25, 13, 19, 14, 22, 24, 7, 23, 20, 18, 15, 0, 8, 1, 17, 2, 9],
	[4, 18, 14, 21, 15, 25, 9, 0, 24, 16, 20, 8, 17, 7, 23, 11, 13, 5, 19, 6, 10, 3, 2, 12, 22, 1],
	[22, 19, 14, 10, 0, 18, 20, 24, 21, 17, 1, 23, 9, 7, 16, 2, 15, 25, 4, 5, 12, 3, 8, 13, 11, 6],
	[21, 25, 1, 17, 6, 8, 19, 24, 20, 15, 18, 3, 7, 13, 11, 23, 0, 22, 12, 9, 16, 14, 5, 4, 2, 10]
];

Enigma.reflectors = [
	[5, 21, 15, 9, 8, 0, 14, 24, 4, 3, 17, 25, 23, 22, 6, 2, 19, 10, 20, 16, 18, 1, 13, 12, 7, 11],
	[24, 17, 20, 7, 16, 18, 11, 3, 15, 23, 13, 6, 14, 10, 12, 8, 4, 1, 5, 25, 2, 22, 21, 9, 0, 19],
	[4, 9, 12, 25, 0, 11, 24, 23, 21, 1, 22, 5, 2, 17, 16, 20, 14, 13, 19, 18, 15, 8, 10, 7, 6, 3]
];

Enigma.reflect = {
	reflector: [],
	setReflector: function(refl){
		if(!Array.isArray(refl) || Math.max.apply(Math, refl) > 25 || Math.min.apply(Math, refl) < 0 || (refl.length != 26 && refl.length != 13))
			return false;
		if(refl.length == 13){
			var arr = [];
			for(var idx = 0; idx < 26; idx++)
				arr.push(refl.indexOf(idx) < 0 ? refl.indexOf(idx - 13) : refl[idx] + 13);
			Enigma.reflect.reflector = arr;
			return arr;
		}
		else
			Enigma.reflect.reflector = refl;
	},
};

Enigma.plugboard = {
	board: [],
	setBoard: function(board){
		if(!Array.isArray(board) || Math.max.apply(Math, board) > 25 || Math.min.apply(Math, board) < 0 || board.length != 26){
			Enigma.plugboard.board = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
			return false;
		}
		Enigma.plugboard.board = board;
	},
	generate: function(lettArray){
		if(!Array.isArray(lettArray) || lettArray.length > 13 || typeof lettArray[0] != "string" || lettArray[0].length != 2 || lettArray.length < 1)
			return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
		var idxs = [];
		var arr = [];
		for(var itm = 0; itm < 26; itm++)
			idxs.push(itm);
		for(var item = 0; item < lettArray.length; item++)
			arr.push([Enigma.alphabet.indexOf(lettArray[item].charAt(0).toUpperCase()), Enigma.alphabet.indexOf(lettArray[item].charAt(1).toUpperCase())]);
		for(var lett = 0; lett < arr.length; lett++){
			var pair = arr[lett];
			idxs[pair[0]] = pair[1];
			idxs[pair[1]] = pair[0];
		}
		return idxs;
	},
	textBoard: function(text){
		var str = "";
		for(var char = 0; char < text.length; char++)
			str += Enigma.alphabet.indexOf(text.charAt(char).toUpperCase()) < 0 ? text.charAt(char) : Enigma.alphabet.charAt(Enigma.plugboard.board[Enigma.alphabet.indexOf(text.charAt(char).toUpperCase())]);
		return str;
	}
};

Enigma.encodeIdx = function(idx){
	idx = Enigma.plugboard.board.indexOf(
		Enigma.rotors[0].wiring.indexOf(
			Enigma.rotors[1].wiring.indexOf(
				Enigma.rotors[2].wiring.indexOf(
					Enigma.reflect.reflector[
				Enigma.rotors[2].wiring[
			Enigma.rotors[1].wiring[
		Enigma.rotors[0].wiring[
	Enigma.plugboard.board[idx]
	]]]]))));
	Enigma.rotors[0].tick();
	return idx;
};

Enigma.setSettings = function(roto1, rotor2, rotor3, plugboard, reflector){
	if(typeof roto1 == "object" && !Array.isArray(roto1) && typeof rotor2 == "undefined" && typeof roto1.rotor1 != "undefined"){
		rotor2 = roto1.rotor2;
		rotor3 = roto1.rotor3;
		plugboard = roto1.plugboard;
		reflector = roto1.reflector;
		var rotor1 = roto1.rotor1;
	}
	else
		var rotor1 = roto1;
	Enigma.rotors[0].setRotor(Array.isArray(rotor1[0]) ? rotor1[0] : Enigma.wirings[rotor1[0]], rotor1[1]);
	Enigma.rotors[1].setRotor(Array.isArray(rotor2[0]) ? rotor2[0] : Enigma.wirings[rotor2[0]], rotor2[1]);
	Enigma.rotors[2].setRotor(Array.isArray(rotor3[0]) ? rotor3[0] : Enigma.wirings[rotor3[0]], rotor3[1]);
	Enigma.reflect.setReflector(Array.isArray(reflector) ? reflector : Enigma.reflectors[reflector]);
	Enigma.plugboard.setBoard(typeof plugboard[0] == "string" ? Enigma.plugboard.generate(plugboard) : plugboard);
};

Enigma.getSettings = function(){
	return {
		rotor1: [Enigma.rotors[0].wiring, Enigma.rotors[0].position],
		rotor2: [Enigma.rotors[1].wiring, Enigma.rotors[1].position],
		rotor3: [Enigma.rotors[2].wiring, Enigma.rotors[2].position],
		plugboard: Enigma.plugboard.board,
		relfector: Enigma.reflect.reflector
	};
};

Enigma.toSettings = function(rot1, rot2, rot3, plugb, refl){
	return {
		rotor1: [Array.isArray(rot1[0]) ? rot1[0] : Enigma.wirings[rot1[0]], rot1[1]],
		rotor2: [Array.isArray(rot2[0]) ? rot2[0] : Enigma.wirings[rot2[0]], rot2[1]],
		rotor3: [Array.isArray(rot3[0]) ? rot3[0] : Enigma.wirings[rot3[0]], rot3[1]],
		plugboard: typeof plugb[0] == "string" ? Enigma.plugboard.generate(plugb) : plugb,
		reflector: Array.isArray(refl) ? refl : Enigma.reflectors[refl]
	};
};

Enigma.encodeChar = function(char, allow){
	allow = typeof allow == "boolean" ? allow : true;
	if(char.length != 1)
		return "";
	if(Enigma.alphabet.indexOf(char.toUpperCase()) < 0 || (Enigma.alphabet.indexOf(char) < 0 && !allow))
		return !!allow ? char : "";
	if(char.toUpperCase() == char)
		return Enigma.alphabet.charAt(Enigma.encodeIdx(Enigma.alphabet.indexOf(char)));
	else
		return Enigma.alphabet.charAt(Enigma.encodeIdx(Enigma.alphabet.indexOf(char.toUpperCase()))).toLowerCase();
};

Enigma.encodeString = function(str, format){
	var done = "";
	for(var char = 0; char < str.length; char++)
		done += Enigma.encodeChar(!!format ? str.charAt(char).toUpperCase() : str.charAt(char), !format);
	return done.length == 0 ? "" : !!format ? done.match(/.{1,4}/g).join(" ") : done;
};