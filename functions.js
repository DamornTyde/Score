var players = [];
var gameList = [];
var win;
var draw;
var lose;
var p1;
var p2;
var game = false;
var foolsday = false;

const now = new Date();

if (now.getDay() == 1 && now.getMonth() == 3) {
	foolsday = true;
}

newMatch();

function newMatch() {
	document.body.innerHTML = "";
	const form = document.createElement("div");
	form.setAttribute("id", "form");
	form.appendChild(createInput("name", "New player name" ,"text"));
	form.appendChild(document.createElement("br"));
	form.appendChild(createButton("Add player", () => newPlayer()));
	const table = document.createElement("div");
	table.setAttribute("id", "table");
	document.body.appendChild(form);
	document.body.appendChild(table);
}

function createInput(id, placeholder ,type) {
	const input = document.createElement("input");
	input.setAttribute("id", id);
	input.setAttribute("placeholder", placeholder);
	input.setAttribute("type", type);
	return input;
}

function createButton(text, onClicked) {
    const button = document.createElement("button");
    button.appendChild(document.createTextNode(text));
    button.addEventListener("click", onClicked);
    return button;
}

function newPlayer() {
	const name = document.getElementById("name").value;
	if (name.length == 0) {
		alert("We can't add a player without a name or number");
	} else if (players.length == 0 && Number(name) > 1 && Number.isInteger(Number(name))) {
		const count = Number(name);
		while (players.length < count) {
			addPlayer(`${players.length + 1}`);
		}
		setRules();
	} else if (players.findIndex(x => x.name == name) > -1) {
		alert(`"${name}" already exist`);
	} else {
		addPlayer(name);
		createPlayerList();
		document.getElementById("name").value = "";
	}
}

function addPlayer(name) {
	players.push({
		name:name,
		points:0,
		games:0
	});
	if (players.length == 2) {
		document.getElementById("form").appendChild(createButton("Set rules", () => setRules()));
	}
}

function createPlayerList() {
	const table = document.createElement("table");
	players.forEach(function (item, i) {
		const row = document.createElement("tr");
		row.appendChild(createTableCell(item.name));
		row.appendChild(createTableCellButton("Edit Name", () => editName(i)));
		row.appendChild(createTableCellButton("Delete", () => deletePlayer(i)));
		table.appendChild(row);
	});
	const view = document.getElementById("table");
	view.innerHTML = "";
	view.appendChild(table);
}

function createTableCell(item, button) {
	const cell = document.createElement("td");
	cell.appendChild(document.createTextNode(item));
	return cell;
}

function createTableCellButton(text, onClicked) {
	const cell = document.createElement("td");
	cell.appendChild(createButton(text, onClicked));
	return cell;
}

function editName(i) {
	const newName = prompt("Edit the name here", players[i].name);
	if (players.findIndex(x => x.name == newName) == -1 && newName != null && newName != "") {
		players[i].name = newName;
		createPlayerList();
	}
}

function deletePlayer(i) {
	if (confirm(`Do you really want to delete "${players[i].name}"?`)) {
		players.splice(i, 1);
		createPlayerList();
		if (players.length == 1) {
			const form = document.getElementById("form");
			form.removeChild(form.lastChild);
		}
	}
}

function setRules() {
	document.body.innerHTML = "";
	document.body.appendChild(createInput("win", "Points for winning", "number"));
	document.body.appendChild(document.createElement("br"));
	document.body.appendChild(createInput("draw", "Points for draw", "number"));
	document.body.appendChild(document.createElement("br"));
	document.body.appendChild(createInput("lose", "Points for losing", "number"));
	document.body.appendChild(document.createElement("br"));
	document.body.appendChild(createInput("base", "Points Everyone starts with", "number"));
	document.body.appendChild(document.createElement("br"));
	document.body.appendChild(createButton("Start Games", () => startGames()));
}

function startGames() {
	var base;
	const winValue = document.getElementById("win").value;
	const drawValue = document.getElementById("draw").value;
	const loseValue = document.getElementById("lose").value;
	const baseValue = document.getElementById("base").value;
	if (winValue.length == 0 || drawValue.length == 0 || loseValue.length == 0 || baseValue.length == 0) {
		alert("Please fill in the points you want to give in any situation");
	} else {
		if (foolsday) {
			win = -Number(winValue);
			draw = -Number(drawValue);
			lose = -Number(loseValue);
			base = -Number(baseValue);
		} else {
			win = Number(winValue);
			draw = Number(drawValue);
			lose = Number(loseValue);
			base = Number(baseValue);
		}	
		if (base != 0) {
			players.forEach(function(item) {
				item.points += base;
			});
		}
		loadGameList();
	}
}

function loadGameList() {
	for (var x = 0; x < players.length - 1; x++) {
		for (var y = x + 1; y < players.length; y++) {
			gameList.push({
				p1:players[x].name,
				p2:players[y].name
			});
		}
	}
	game = true;
	newGame(true);
}

function newGame(r) {
	document.body.innerHTML = "";
	const game = Math.floor(Math.random() * gameList.length);
	const coinFlip = Math.floor(Math.random() * 2);
	if (coinFlip == 0) {
		p1 = gameList[game].p1;
		p2 = gameList[game].p2;
	} else {
		p1 = gameList[game].p2;
		p2 = gameList[game].p1;
	}
	if (r) {
		document.body.appendChild(createButton("Random score", () => randomClick()));
	}
	const head = document.createElement("h1");
	head.appendChild(document.createTextNode(`${p1} VS ${p2}`));
	document.body.appendChild(head);
	document.body.appendChild(createButton(`${p1} wins`, () => endGame(win, lose)));
	document.body.appendChild(createButton("draw", () => endGame(draw, draw)));
	document.body.appendChild(createButton(`${p2} wins`, () => endGame(lose, win)));
	document.body.appendChild(createRankTable());
	gameList.splice(game, 1);
}

function createTableHeader(text) {
	const cell = document.createElement("th");
	cell.appendChild(document.createTextNode(text));
	return cell;
}

function createRankTable() {
	var rank = 1;
	const table = document.createElement("table");
	table.setAttribute("id", "rank");
	const tableHeader = document.createElement("tr");
	tableHeader.appendChild(createTableHeader("Rank"));
	tableHeader.appendChild(createTableHeader("Name"));
	tableHeader.appendChild(createTableHeader("Games"));
	tableHeader.appendChild(createTableHeader("Points"));
	table.appendChild(tableHeader);
	players.forEach(function (item, i, arr) {
		const cell = document.createElement("tr");
		if (i > 0 && item.points != arr[i - 1].points) {
			rank = i + 1;
		}
		cell.appendChild(createTableCell(`${rank}.`));
		cell.appendChild(createTableCell(item.name));
		cell.appendChild(createTableCell(item.games));
		cell.appendChild(createTableCell(item.points));
		table.appendChild(cell);
	});
	return table;
}

function endGame(price1, price2) {
	givePrice(p1, price1);
	givePrice(p2, price2);
	settle();
}

function givePrice(player, price) {
	const p = players.findIndex(x => x.name == player);
	players[p].points += price;
	players[p].games++;
	if (price != 0) {
		const item = players.splice(p, 1)[0];
		const newPlace = players.findIndex(x => x.points < item.points);
		if (newPlace == -1) {
			players.push(item);
		} else {
			players.splice(newPlace, 0, item);
		}
	}
}

function settle() {
	if (gameList.length > 0) {
		newGame(false);
	} else {
		game = false;
		const max = players[0].points;
		document.body.innerHTML = "";
		const head = document.createElement("h1");
		const winners = players.filter(x => x.points == max);
		var headerText = "";
		winners.forEach(function (item, i, arr) {
			headerText += item.name;
			if (i < arr.length - 2) {
				headerText += ", ";
			} else if (i == arr.length - 2) {
				headerText += " & ";
			}
		});
		headerText += " won the game";
		head.appendChild(document.createTextNode(headerText));
		document.body.appendChild(head);
		document.body.appendChild(createButton("Continue", () => loadGameList()));
		document.body.appendChild(createButton("Reset", () => resetGame()));
		document.body.appendChild(createButton("Reload", () => reloadGame()));
		document.body.appendChild(createRankTable());
	}
}

function resetGame() {
	players.forEach(function (item) {
		item.points = 0;
		item.games = 0;
	});
	loadGameList();
}

function reloadGame() {
	players.splice(0, players.length);
	newMatch();
}

function randomClick() {
	const score = Math.floor(Math.random() * 3);
	switch (score) {
		case 0:
			endGame(win, lose);
			break;
		case 1:
			endGame(draw, draw);
			break;
		case 2:
			endGame(lose, win);
	}
	if (game) {
		setTimeout(randomClick, 20);
	}
}