console.log("---------");
console.log(new Date().toString()+" launching");
console.log("buzzzoom.games v1.0");
console.log("---------");

var http = require('http');
var url = require('url');
var fs = require('fs');
var nodemailer = require('nodemailer');

var serverAbsoluteUrl = "http://www.buzzzoom.games";
var serverSocketUrl = "http://live.buzzzoom.games";
var globalLocalVars = {
	serverUrl: serverAbsoluteUrl,
	serverSocketUrl: serverSocketUrl
};

var twentyfourHourCreditBonus = 7;
var twentyfourHourCreditBonusAnonymous = 5;

var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '\\"'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
    return str.replace(/[&<>"]/g, replaceTag);
}

//Load Express

var express = require('express');

var app = express();
app.set('views', './templates');
app.set('view engine', 'pug');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Load database

var MongoClient = require("mongodb").MongoClient;
var db;

MongoClient.connect("mongodb://localhost/buzzzoom", function(error, database) {
    if (error) return funcCallback(error);

    db = database;
    users = new usersModule.Users(db);
    games = new gamesModule.Games(db);
    scores = new scoresModule.Scores(db);
    contests = new contestsModule.Contests(db);
    logs = new logsModule.Logs(db);
    console.log("Connected to database 'buzzzoom'");

    /*games.getGameByShortName("amiral-chaton", function(userTmp){
    	var tmp = userTmp;
    	console.log(tmp);
    	tmp.save(function(){});
    });*/

    /*var contest = new contestsModule.Contest(
    	db,
    	"",
    	"Une tablette Samsung à gagner !",
    	"Cette semaine nous vous offrons un lot inédit sur Buzzzoom : une tablette à gagner ! Une chose est sûre, la concurrence va être rude dans les scores !",
    	"<table><tr><td>1er</td><td>Tablette Samsung Galaxy</td></tr><tr><td>2ème</td><td>300 crédits</td></tr><tr><td>3ème</td><td>150 crédits</td></tr></table>",
    	"",
    	"buzzzoom-exemple",
    	new Date(2017, 0, 16, 0, 0, 0, 0),
    	new Date(2017, 0, 22, 23, 59, 59, 999),
    	"Published"
	);
	contest.save(function(){});

	var contest = new contestsModule.Contest(
    	db,
    	"",
    	"Une autre tablette Samsung à gagner !",
    	"Notre stock de tablettes était plus gros que prévu ! Cette semaine nous vous offrons une nouvelle tablette ! Une chose est sûre, la concurrence va être rude dans les scores !",
    	"<table><tr><td>1er</td><td>Tablette Samsung Galaxy</td></tr><tr><td>2ème</td><td>300 crédits</td></tr><tr><td>3ème</td><td>150 crédits</td></tr></table>",
    	"",
    	"buzzzoom-exemple",
    	new Date(2017, 0, 23, 0, 0, 0, 0),
    	new Date(2017, 0, 29, 23, 59, 59, 999),
    	"Published"
	);
	contest.save(function(){});

	var contest = new contestsModule.Contest(
    	db,
    	"",
    	"Encore une autre tablette Samsung à gagner !",
    	"Notre stock de tablettes était plus gros que prévu ! Cette semaine nous vous offrons une nouvelle tablette ! Une chose est sûre, la concurrence va être rude dans les scores !",
    	"<table><tr><td>1er</td><td>Tablette Samsung Galaxy</td></tr><tr><td>2ème</td><td>300 crédits</td></tr><tr><td>3ème</td><td>150 crédits</td></tr></table>",
    	"",
    	"buzzzoom-exemple",
    	new Date(2017, 0, 30, 0, 0, 0, 0),
    	new Date(2017, 1, 05, 23, 59, 59, 999),
    	"Draft"
	);
	contest.save(function(){});*/

	/*var contestsList;
	contests.findLatestCurrentAndPastPublishedContests(5, function(r){
		contestsList = r;
		console.log(contestsList);
	});*/

	/*var log = new logsModule.Log(db, "", "test", "localhost", new Date(), {testData: "data in test"});
	logs.log(log);*/
	
	/*var contest = new contestsModule.Contest(
    	db,
    	"",
    	"Un autre bon d'achat Cultura de 40€ à gagner !",
    	"bon-achat-cultura-2",
    	"Un bon d'achat Cultura est encore une fois à gagner ce mois-ci ! Ce bon d'achat d'une valeur de 40€ est valable pendant 12 mois dans tous les magasins Cultura de France Métropolitaine. Devenez le meilleur pianiste sur notre premier jeu, \"Piano fou\", et remportez le gros lot ! Une chose est sûre, la concurrence va être rude dans les scores !",
    	"<table><tr><td>1er</td><td>Bon d'achat Cultura</td></tr><tr><td>2ème</td><td>100 crédits</td></tr><tr><td>3ème</td><td>50 crédits</td></tr></table>",
    	"",
    	"piano-fou",
    	new Date(2017, 2, 1, 0, 0, 0, 0),
    	new Date(2017, 2, 31, 23, 59, 59, 999),
    	"Published"
	);
	contest.save(function(){});*/

	console.log("buzzzoom.games ready to roll!");
	console.log("---------");
});

//Load emails
var transporter = nodemailer.createTransport({
    host: 'ssl0.ovh.net',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'xxxxx@xxxxx',
        pass: 'xxxxx'
    }
});

//Load users
var usersModule = require('./users.js');
var users;

//Load games
var gamesModule = require('./games.js');
var games;

//Load scores
var scoresModule = require('./scores.js');
var scores;

//Load contests
var contestsModule = require('./contests.js');
var contests;

//Load logs
var logsModule = require('./logs.js');
var logs;

//Load crypto
var crypto = require('crypto');//0be23835c70a2431c403499d0013224a
function getCryptedString(text){
  var cipher = crypto.createCipher('aes192', 'xxxxxx');
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}
 
function getDecryptedString(text){
  var decipher = crypto.createDecipher('aes192', 'xxxxxx');
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}
/*var encrypted = '';
cipher.on('readable', () => {
  var data = cipher.read();
  if (data)
    encrypted += data.toString('hex');
});
cipher.on('end', () => {
  //console.log(encrypted);
});
function getCryptedString(input){
	console.log("getCryptedString: "+input);
	encrypted = '';
	cipher.write(""+input);
	cipher.end();
	return ""+encrypted;
}*/

//Load custom template system
function getHtml(rawHtml, data){
	var result = rawHtml;

	for(var key in data){
		//console.log(key);
		//console.log(data[key]);
		var reg = new RegExp("\{\{"+key+"\}\}", "g");
		result = result.replace(reg, data[key]);
	}

	return result;
}

//Load paypal
/*var paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'client_secret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});*/

//Launch

var server = http.createServer(app);
var io = require('socket.io').listen(server);

console.log("Launching server...");
server.listen(process.env.PORT);
console.log("Server launched on port: "+process.env.PORT);

//Config

function getPage(pageName, req, callback, additionalLocalVars){
	var result;

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	logs.log(new logsModule.Log(db, "", "visit", ""+ip, new Date(), {
		userName: ip,
		content: "User "+ip+" (user from IP) asked for page '"+pageName+"'",
		pageName: ""+pageName
	}));

	//res.send('Hello World!');
  	//res.render('index', { title: 'Hey', message: 'Hello there!', serverUrl: "http://localhost:3000" })
  	//res.sendFile(__dirname+"/templates/index.html");
  	var localVars = {};
  	localVars.userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  	for(var key in globalLocalVars){
  		localVars[key] = globalLocalVars[key];
  	}
  	if(additionalLocalVars != null){
	  	for(var key in additionalLocalVars){
	  		localVars[key] = additionalLocalVars[key];
	  	}
  	}

	fs.readFile(__dirname+"/templates/header.html", 'utf8', function (err, headerData) {
	  if (err) {
	    return console.log(err);
	  }

	  var finalHeader = getHtml(headerData, localVars);

	  fs.readFile(__dirname+"/templates/"+pageName+".html", 'utf8', function (err, data) {
		  if (err) {
		    return console.log(err);
		  }

		  var finalHtml = getHtml(data, localVars);

		  fs.readFile(__dirname+"/templates/footer.html", 'utf8', function (err, footerData) {
			  if (err) {
			    return console.log(err);
			  }
			  //console.log(data);
			  /*data = data+"<script type=\"text/javascript\">var serverUrl = \"http://localhost:3000\"</script>";
			  res.send(data);*/

			  var finalFooter = getHtml(footerData, localVars);
			  result = finalHeader+finalHtml+finalFooter;
			  callback(result);
			});
		});
	});
};

app.get('/', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

	getAccueil(req, res);
});

app.get('/accueil', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

	getAccueil(req, res);
});

function getAccueil(req, res){
	var latestPublishedGames = games.getLatestPublishedGames(function(latestGamesRes){
		var latestPublishedGamesStr = "var latestGames = [";
		for(var i = 0; i < latestGamesRes.length; i++){
			latestPublishedGamesStr += "{shortName : \""+latestGamesRes[i].shortName+"\", name : \""+latestGamesRes[i].name+"\", description : \""+latestGamesRes[i].description+"\", dateCreated : \""+latestGamesRes[i].dateCreated+"\"},";
		}
		latestPublishedGamesStr += "];";

		var nextContests = contests.findNextPublishedContests(5, function(nextContestsRes){
			var nextContestsStr = "var nextContests = [";
			for(var i = 0; i < nextContestsRes.length; i++){
				nextContestsStr += "{title : \""+nextContestsRes[i].title+"\", shortName : \""+nextContestsRes[i].shortName+"\", prizeDescription : \""+nextContestsRes[i].prizeDescription+"\", description : \""+nextContestsRes[i].description+"\", medias : \""+nextContestsRes[i].medias+"\", gameShortName : \""+nextContestsRes[i].gameShortName+"\", start : \""+nextContestsRes[i].start+"\", end : \""+nextContestsRes[i].end+"\"},";
			}
			nextContestsStr += "];";

			var lastContest = contests.findLatestCurrentPublishedContests(1, function(lastContestRes){
				if(lastContestRes != null && lastContestRes.length > 0){
					var lastContestStr = "var lastContest = {title: \""+lastContestRes[0].title+"\", description: \""+lastContestRes[0].description+"\", shortName: \""+lastContestRes[0].shortName+"\",	img: \""+lastContestRes[0].medias+"\",	gameTitle: \""+lastContestRes[0].gameShortName+"\", gameShortName: \""+lastContestRes[0].gameShortName+"\", gameImg: \""+lastContestRes[0].gameShortName+"\", start: \""+lastContestRes[0].start+"\", end: \""+lastContestRes[0].end+"\"}";

					getPage("index", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {games: ""+latestPublishedGamesStr, nextContests: ""+nextContestsStr, lastContest: ""+lastContestStr});
				}
				else{
					getPage("index", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {games: ""+latestPublishedGamesStr, nextContests: ""+nextContestsStr, lastContest: ""});
				}
			});
		});
	});
}

app.get('/concours', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

	contests.findLatestPublishedContests(100, function(contestsRes){
		if(contestsRes != null && contestsRes.length > 0){
			var currentContests = [];
			var futureContests = [];
			var pastContests = [];

			for(var i = 0; i < contestsRes.length; i++){
				if(contestsRes[i].start <= new Date() && contestsRes[i].end >= new Date()){
					currentContests[currentContests.length] = contestsRes[i];
				}
				else if(contestsRes[i].start > new Date()){
					futureContests[futureContests.length] = contestsRes[i];
				}
				else{
					pastContests[pastContests.length] = contestsRes[i];
				}
			}

			var currentContestStr = "var currentContests = [";
			for(var i = 0; i < currentContests.length; i++){
				currentContestStr += "{title:\""+currentContests[i].title+"\", shortName:\""+currentContests[i].shortName+"\", description:\""+currentContests[i].description+"\", prizeDescription:\""+currentContests[i].prizeDescription+"\", medias:\""+currentContests[i].medias+"\", gameShortName:\""+currentContests[i].gameShortName+"\", start:\""+currentContests[i].start+"\", end:\""+currentContests[i].end+"\"}";
			}
			currentContestStr += "];";

			var futureContestsStr = "var futureContests = [";
			for(var i = 0; i < futureContests.length; i++){
				futureContestsStr += "{title:\""+futureContests[i].title+"\", shortName:\""+futureContests[i].shortName+"\", description:\""+futureContests[i].description+"\", prizeDescription:\""+futureContests[i].prizeDescription+"\", medias:\""+futureContests[i].medias+"\", gameShortName:\""+futureContests[i].gameShortName+"\", start:\""+futureContests[i].start+"\", end:\""+futureContests[i].end+"\"}";
			}
			futureContestsStr += "];";

			var pastContestsStr = "var pastContests = [";
			for(var i = 0; i < pastContests.length; i++){
				pastContestsStr += "{title:\""+pastContests[i].title+"\", shortName:\""+pastContests[i].shortName+"\", description:\""+pastContests[i].description+"\", prizeDescription:\""+pastContests[i].prizeDescription+"\", medias:\""+pastContests[i].medias+"\", gameShortName:\""+pastContests[i].gameShortName+"\", start:\""+pastContests[i].start+"\", end:\""+pastContests[i].end+"\"}";
			}
			pastContestsStr += "];";

			getPage("concours", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {currentContests: currentContestStr, futureContests: futureContestsStr, pastContests: pastContestsStr});
		}
		else{
			getPage("index", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
		}
	}, 0);
});

app.get('/concours/:shortName', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

	//get game from short name
	contests.getContestByShortName(req.params.shortName, function(contestRes){
		if(contestRes != null){
			var contestStr = "var contest = {title: \""+contestRes.title+"\", description: \""+contestRes.description+"\", prizeDescription: \""+contestRes.prizeDescription+"\", shortName: \""+contestRes.shortName+"\",	img: \""+contestRes.medias+"\",	gameTitle: \""+contestRes.gameShortName+"\", gameShortName: \""+contestRes.gameShortName+"\", gameImg: \""+contestRes.gameShortName+"\", start: \""+contestRes.start+"\", end: \""+contestRes.end+"\"}";

			games.getGameByShortName(contestRes.gameShortName, function(gameRes){
				//console.log(gameRes);
				var gameStr = "var game = {shortName: \""+gameRes.shortName+"\", name:\""+gameRes.name+"\", description: \""+gameRes.description+"\", scoreType:\""+gameRes.scoreType+"\"}";

				scores.getLatestScoresByContestId(contestRes.id, function(scoresRes){
					var scoresStr = "";
					var sortedScores = scores.sortScores(scoresRes, gameRes.scoreType);
					for(var i = 0; i < sortedScores.length; i++){
						var userNameWithoutIP = sortedScores[i].userName;
						if(userNameWithoutIP.indexOf('.') > -1 || userNameWithoutIP.indexOf(':') > -1){
							userNameWithoutIP = "Anonyme";
						}
						scoresStr += "{playerName:\""+userNameWithoutIP+"\", value:\""+sortedScores[i].score+"\", dateCreated:\""+sortedScores[i].dateCreated+"\"},";
					}
					//console.log("final:");
					//console.log(sortedScores);

					getPage("concours-single", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {contest: contestStr, game: gameStr, scores: scoresStr});
				});
			});
		}
		else{
			getPage("index", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
		}
	});
});

app.get('/jeux', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

	games.getLatestPublishedGames(function(gamesRes){
		if(gamesRes != null && gamesRes.length > 0){
			var gamesStr = "var games = [";
			for(var i = 0; i < gamesRes.length; i++){
				gamesStr += "{shortName: \""+gamesRes[i].shortName+"\", name: \""+gamesRes[i].name+"\", description: \""+gamesRes[i].description+"\", scoreType: \""+gamesRes[i].scoreType+"\", dateCreated: \""+gamesRes[i].dateCreated+"\"},";
			}
			gamesStr += "];";

			getPage("jeux", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {games: gamesStr});
		}
		else{
			getPage("accueil", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
		}
	});  	
});

app.get('/jeu/:shortName', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

	//get game from short name
	games.getGameByShortName(req.params.shortName, function(game){
		if(game != null){
			contests.isGameAContest(game, function(contestOnThisGame){
				scores.getLatestScoresByGameShortName(game.shortName, function(scoresRes){
					var scoresStr = "";
					var sortedScores = scores.sortScores(scoresRes, game.scoreType);
					for(var i = 0; i < sortedScores.length; i++){
						var contestName = "";
						if(sortedScores[i].contestId != null && sortedScores[i].contestId != ""){
							contestName = "YES";//TODO get contest shortName for linking
						}
						var userNameWithoutIP = sortedScores[i].userName;
						if(userNameWithoutIP.indexOf('.') > -1 || userNameWithoutIP.indexOf(':') > -1){
							userNameWithoutIP = "Anonyme";
						}
						scoresStr += "{playerName:\""+userNameWithoutIP+"\", value:\""+sortedScores[i].score+"\", dateCreated:\""+sortedScores[i].dateCreated+"\", contestShortName: \""+contestName+"\"},";
					}

					if(contestOnThisGame != null){
						scores.getLatestScoresByContestId(contestOnThisGame.id, function(scoresResContest){
							var scoresContestStr = "";
							var sortedContestScores = scores.sortScores(scoresResContest, game.scoreType);
							for(var i = 0; i < sortedContestScores.length; i++){
								var userNameWithoutIP = sortedContestScores[i].userName;
								if(userNameWithoutIP.indexOf('.') > -1 || userNameWithoutIP.indexOf(':') > -1){
									userNameWithoutIP = "Anonyme";
								}
								scoresContestStr += "{playerName:\""+userNameWithoutIP+"\", value:\""+sortedContestScores[i].score+"\", dateCreated:\""+sortedContestScores[i].dateCreated+"\"},";
							}

							getPage("jeu", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {gameDescription: game.description, code: game.code, contest: "var contest = \""+contestOnThisGame.shortName+"\";", scores: scoresStr, scoresContest: scoresContestStr});
						});
					}
					else{
						getPage("jeu", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {gameDescription: game.description, code: game.code, contest: "var contest = null;", scores: scoresStr, scoresContest: ""});
					}
				});
			});
		}
		else{
			getPage("index", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
		}
	});
});

app.get('/forum', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

  	getPage("forum", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
});

app.get('/faq', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

  	getPage("faq", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
});

app.get('/reglement', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

  	getPage("reglement", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
});

app.get('/profil', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

  	getPage("profile", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
});

app.get('/inscription', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

  	getPage("register", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {postContest : false});
});

//Register after anonymous score
app.get('/inscription-concours', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

  	getPage("register", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {postContest : true});
});

app.get('/confirmation/:key/:mdp', function (req, res){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

	if(req.params.key.length < 10 || req.params.mdp.length < 10){
		getAccueil(req, res);
		//socket.emit('Error', 'Erreur 1044 : le compte n\'a pas pu être confirmé.');
		console.log('Erreur 1044 : le compte n\'a pas pu être confirmé.');
	}
	else{
		var uncryptedEmail = getDecryptedString(req.params.key);
		var uncryptedDate = getDecryptedString(req.params.mdp);

		users.getUserByEmail(uncryptedEmail, function(user){
			if(user != null){
				var finalDate = new Date(uncryptedDate);
				console.log(finalDate);
				console.log(user.dateJoined);
				if(finalDate.toString() == user.dateJoined.toString()){
					user.status = "Confirmed";
					user.save(function(userSaved){
						if(userSaved != null){
							//getAccueil(req, res);
							//socket.emit('Information', 'Votre compte a bien été confirmé.');
							res.status(200).send("<script type=\"text/javascript\">window.location = \""+serverAbsoluteUrl+"\";</script>");
						}
						else{
							//getAccueil(req, res);
							//socket.emit('Error', 'Erreur 1043 : le compte n\'a pas pu être confirmé.');
							res.status(200).send("<script type=\"text/javascript\">window.location = \""+serverAbsoluteUrl+"\";</script>");
							console.log('Erreur 1043 : le compte n\'a pas pu être confirmé.');
						}
					});
				}
				else{
					//getAccueil(req, res);
					//socket.emit('Error', 'Erreur 1042 : le compte n\'a pas pu être confirmé.');
					res.status(200).send("<script type=\"text/javascript\">window.location = \""+serverAbsoluteUrl+"\";</script>");
					console.log('Erreur 1042 : le compte n\'a pas pu être confirmé.');
				}
			}
			else{
				//getAccueil(req, res);
				//socket.emit('Error', 'Erreur 1041 : le compte n\'a pas pu être confirmé.');
				res.status(200).send("<script type=\"text/javascript\">window.location = \""+serverAbsoluteUrl+"\";</script>");
				console.log('Erreur 1041 : le compte n\'a pas pu être confirmé.');
			}
		});
	}
});

app.get('/adm/:key/:mdp', function (req, res){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var pageUrl = url.parse(req.url).pathname;
	console.log("Asked pageUrl "+pageUrl+" from "+ip);

	var authed = false;

	if(req.params.key == "xxxxxxxxxx" && req.params.mdp == "yyyyyyyyyy"){
		authed = true;
	}

	if(authed){
		contests.findContests(0, function(contestsRes){
			var contestsStr = "var contests = [";
			for(var i = 0; i < contestsRes.length; i++){
				contestsStr += "{id: \""+contestsRes[i].id+"\", title: \""+contestsRes[i].title+"\", shortName: \""+contestsRes[i].shortName+"\", description: \""+contestsRes[i].description+"\",	prizeDescription: \""+contestsRes[i].prizeDescription+"\", medias: \""+contestsRes[i].medias+"\", gameShortName: \""+contestsRes[i].gameShortName+"\", start: \""+contestsRes[i].start+"\",	end: \""+contestsRes[i].end+"\", status: \""+contestsRes[i].status+"\"},";
			}
			contestsStr += "];";

			games.getGames(function(gamesRes){
				var gamesStr = "var games = [";
				for(var i = 0; i < gamesRes.length; i++){
					gamesStr += "{id: \""+gamesRes[i].id+"\", shortName: \""+gamesRes[i].shortName+"\", name: \""+gamesRes[i].name+"\", code: \""+safe_tags_replace(gamesRes[i].code)+"\",	description: \""+gamesRes[i].description+"\", scoreType: \""+gamesRes[i].scoreType+"\", dateCreated: \""+gamesRes[i].dateCreated+"\", status: \""+gamesRes[i].status+"\"},";
				}
				gamesStr += "];";

				getPage("admin", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);}, {contests: contestsStr, games: gamesStr});
			});
		});
	}
	else{
  		getPage("index", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
  	}
});

app.get('/css/style.css', function (req, res) {
	fs.readFile(__dirname+"/templates/css/style.css", 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }

	  res.set('Content-Type', 'text/css');
	  res.status(200).send(data);
	});
});

app.use("/data", express.static(__dirname + '/games'));
app.use("/img", express.static(__dirname + '/templates/img'));
app.use("/js", express.static(__dirname + '/templates/js'));

//Communication

io.on('connection', function(socket){
  console.log('A user connected on the site');
  //socket.emit('message', 'Vous êtes bien connecté !');

  	//CONNEXION
	socket.on('connexion', function (dataRaw){
		var clientIP = socket.request.connection.remoteAddress;
		if(clientIP == "127.0.0.1" || clientIP == "::1" || clientIP == ""){
			clientIP = socket.request.headers['x-forwarded-for'];
		}

        //console.log(data);
        /*var data = JSON.parse(dataRaw);
        data.pwd = getCryptedString(data.pwd);
        console.log("User "+data.login+" tried to connect with password: "+data.pwd+"...");

        db.collection("users").find({
        	name:""+data.login,
        	pwd:""+data.pwd
        }).toArray(function (error, results) {
	        if (error) throw error;
	        if(results.length > 0){
	        	logs.log(new logsModule.Log(db, "", "connexion", ""+socket.request.connection._peername.address+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "User "+data.login+" connected."}));
	        	socket.emit('connexion', JSON.stringify({
	        		/*userId: ""+results[0]._id.toString(),*/
	        		/*email: ""+results[0].email,
	        		userName: ""+results[0].name,
	        		pwd: ""+results[0].pwd,
	        		fName: results[0].addrFirstName,
					lName: results[0].addrLastName,
					addr: results[0].addrLine1,
					addr2: results[0].addrLine2,
					pCode: results[0].addrPostalCode,
					city: results[0].addrCity,
					country: results[0].addrCountry,
					phone: results[0].phone,
	        		credits: ""+results[0].credits,
	        		dateJoined: results[0].dateJoined,
	        		status: ""+results[0].status
	        	}));
	        }
	        else{
	        	socket.emit('Error', 'Mauvaise combinaison pseudonyme/mot de passe !');
	        }
    	});*/

    	var data = JSON.parse(dataRaw);
        data.pwd = getCryptedString(data.pwd);
        console.log("User "+data.login+" tried to connect with password: "+data.pwd+"...");

        db.collection("users").find({
        	name:""+data.login,
        	pwd:""+data.pwd
        }).toArray(function (error, results) {
	        if (error) throw error;
	        if(results.length > 0){
	        	logs.log(new logsModule.Log(db, "", "connexion", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "Starting session for user "+data.login+"."}));

	        	logs.canUserHas24HourBonus(data.login, function(canHaveBonus){
	        		if(canHaveBonus){
	        			users.getUserByName(data.login, function(resUser){
	        				if(resUser != null){
	        					resUser.credits += twentyfourHourCreditBonus;
	        					resUser.save(function(res){
	        						if(res != null){
	        							logs.log(new logsModule.Log(db, "", "bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "Gave 24h login bonus for user "+data.login+"."}));
	        							socket.emit('Information', "Merci d'être revenu ! Pour votre fidélité, nous vous offrons "+twentyfourHourCreditBonus+" crédits gratuits.");
	        							sendConnexionInfo(resUser);
	        						}
	        						else{
	        							logs.log(new logsModule.Log(db, "", "error-bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "24h login bonus: Couldn't save user "+data.login+" with new credits"}));
	        							sendConnexionInfo(results[0]);
	        						}
	        					});
	        				}
	        				else{
	        					logs.log(new logsModule.Log(db, "", "error-bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "24h login bonus: Couldn't find user "+data.login}));
	        					sendConnexionInfo(results[0]);
	        				}
	        			});
	        		}
	        		else{
	        			logs.log(new logsModule.Log(db, "", "info-bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "Already had 24h login bonus"}));
	        			sendConnexionInfo(results[0]);
	        		}
	        	});

	        	function sendConnexionInfo(resultsUser){
	        		socket.emit('connexion', JSON.stringify({
		        		/*userId: ""+results[0]._id.toString(),*/
		        		email: ""+resultsUser.email,
		        		userName: ""+resultsUser.name,
		        		pwd: ""+resultsUser.pwd,
		        		fName: resultsUser.addrFirstName,
						lName: resultsUser.addrLastName,
						addr: resultsUser.addrLine1,
						addr2: resultsUser.addrLine2,
						pCode: resultsUser.addrPostalCode,
						city: resultsUser.addrCity,
						country: resultsUser.addrCountry,
						phone: resultsUser.phone,
		        		credits: ""+resultsUser.credits,
		        		dateJoined: resultsUser.dateJoined,
		        		status: ""+resultsUser.status
		        	}));
	        	}
	        }
	        else{
	        	socket.emit('Error', 'Mauvaise combinaison pseudonyme/mot de passe !');
	        }
    	});
	});
	//Password is already crypted
	socket.on('connexionU', function (dataRaw){
		var clientIP = socket.request.connection.remoteAddress;
		if(clientIP == "127.0.0.1" || clientIP == "::1" || clientIP == ""){
			clientIP = socket.request.headers['x-forwarded-for'];
		}

        //console.log(data);
        var data = JSON.parse(dataRaw);
        console.log("User "+data.login+" tried to continue session with password: "+data.pwd+"...");

        db.collection("users").find({
        	name:""+data.login,
        	pwd:""+data.pwd
        }).toArray(function (error, results) {
	        if (error) throw error;
	        if(results.length > 0){
	        	logs.log(new logsModule.Log(db, "", "connexionU", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "Continuing session for user "+data.login+"."}));

	        	logs.canUserHas24HourBonus(data.login, function(canHaveBonus){
	        		if(canHaveBonus){
	        			users.getUserByName(data.login, function(resUser){
	        				if(resUser != null){
	        					resUser.credits += twentyfourHourCreditBonus;
	        					resUser.save(function(res){
	        						if(res != null){
	        							logs.log(new logsModule.Log(db, "", "bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "Gave 24h login bonus for user "+data.login+"."}));
	        							socket.emit('Information', "Merci d'être revenu ! Pour votre fidélité, nous vous offrons "+twentyfourHourCreditBonus+" crédits gratuits.");
	        							sendConnexionInfo(resUser);
	        						}
	        						else{
	        							logs.log(new logsModule.Log(db, "", "error-bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "24h login bonus: Couldn't save user "+data.login+" with new credits"}));
	        							sendConnexionInfo(results[0]);
	        						}
	        					});
	        				}
	        				else{
	        					logs.log(new logsModule.Log(db, "", "error-bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "24h login bonus: Couldn't find user "+data.login}));
	        					sendConnexionInfo(results[0]);
	        				}
	        			});
	        		}
	        		else{
	        			logs.log(new logsModule.Log(db, "", "info-bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: data.login, content: "Already had 24h login bonus"}));
	        			sendConnexionInfo(results[0]);
	        		}
	        	});

	        	function sendConnexionInfo(resultsUser){
	        		socket.emit('connexion', JSON.stringify({
		        		/*userId: ""+results[0]._id.toString(),*/
		        		email: ""+resultsUser.email,
		        		userName: ""+resultsUser.name,
		        		pwd: ""+resultsUser.pwd,
		        		fName: resultsUser.addrFirstName,
						lName: resultsUser.addrLastName,
						addr: resultsUser.addrLine1,
						addr2: resultsUser.addrLine2,
						pCode: resultsUser.addrPostalCode,
						city: resultsUser.addrCity,
						country: resultsUser.addrCountry,
						phone: resultsUser.phone,
		        		credits: ""+resultsUser.credits,
		        		dateJoined: resultsUser.dateJoined,
		        		status: ""+resultsUser.status
		        	}));
	        	}
	        }
	        else{
	        	socket.emit('Error', 'Mauvaise combinaison pseudonyme/mot de passe !');
	        }
    	});
	});

	//INSCRIPTION
	socket.on('inscription', function (dataRaw) {
		var clientIP = socket.request.connection.remoteAddress;
		if(clientIP == "127.0.0.1" || clientIP == "::1" || clientIP == ""){
			clientIP = socket.request.headers['x-forwarded-for'];
		}

		console.log("User tried to register: "+dataRaw);
		var data = JSON.parse(dataRaw);

		var emailReg = /^[a-z0-9\_\-\.]{2,50}[@]{1}[a-z0-9\-\.]{2,50}[\.]{1}[a-zA-Z]{2,10}$/;
		var isEmailCorrect = emailReg.test(data.email);
		if(isEmailCorrect){
			db.collection("users").find({
				email: data.email
			}).toArray(function (error, results) {
		        if (error) throw error;
		        //Check email availability
				if(results.length > 0){
		        	socket.emit('Error', 'Cette adresse email est déjà utilisée !');
		        }
		        else{
		        	db.collection("users").find({
						name: data.name
					}).toArray(function (error, results) {
				        if (error) throw error;
				        //Check name availability
						if(data.name.toLowerCase() == "admin" || data.name.toLowerCase() == "caporaltito" || data.name.toLowerCase() == "anonymous" || results.length > 0){
				        	socket.emit('Error', 'Ce pseudonyme est déjà utilisé !');
				        }
				        else{
				        	var nameReg = /^[A-Za-z][A-Za-z0-9]{2,}$/;
				        	var isNameCorrect = nameReg.test(data.name);
				        	if(isNameCorrect){
				        		//Check password
					        	//var reg = /[A-Za-z0-9]+/;
					        	var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,})$/;
					        	var hasChar = reg.test(data.pwd);
					        	if(hasChar && data.pwd.length >= 6){
					        		//Check password confirmation
					        		if(data.pwdConf == data.pwd){
					        			var cryptedPwd = getCryptedString(data.pwd);
					        			var theDate = new Date();
					        			db.collection("users").insertOne(
										{
											email: data.email,
											name: data.name,
											pwd: cryptedPwd,
											addrFirstName: data.fName,
											addrLastName: data.lName,
											addrLine1: data.addr,
											addrLine2: data.addr2,
											addrPostalCode: data.pCode,
											addrCity: data.city,
											addrCountry: "France",
											phone: data.phone,
											credits: 15,
											dateJoined: theDate,
											status: "Unconfirmed"
										}
										);

										console.log("User "+data.name+" registered.");

										var emailLink = getCryptedString(data.email)+"/"+getCryptedString(theDate.toISOString());
										console.log("emailLink: "+emailLink);

										var mailOptions = {
										    from: '"buzzzoom.games" <info@buzzzoom.games>', // sender address
										    to: data.email, // list of receivers
										    subject: "Inscription à Buzzzoom", // Subject line
										    text: "Bienvenue sur Buzzzoom ! Vous recevez cet email parce que votre adresse email a été utilisée pour s'inscrire sur notre site http://buzzzoom.games. Il est nécessaire de confirmer votre inscription pour pouvoir utiliser votre compte Buzzzoom. Veuillez rentrer le lien dans votre navigateur pour confirmer votre inscription : http://buzzzoom.games/confirmation/"+emailLink+" . Si vous ne désirez pas confirmer cette inscription, ignorez ce message.", // plaintext body
										    html: "<h1>Bienvenue sur Buzzzoom !</h1><p>Vous recevez cet email parce que votre adresse email a été utilisée pour s'inscrire sur notre site <a href=\"http://buzzzoom.games\">buzzzoom.games</a></p><p>Il est nécessaire de confirmer votre inscription pour pouvoir utiliser votre compte Buzzzoom. Veuillez cliquer sur le lien suivant ou le rentrer dans votre navigateur pour confirmer votre inscription :<br><a href=\"http://buzzzoom.games/confirmation/"+emailLink+"\">http://buzzzoom.games/confirmation/"+emailLink+"</a></p><p>Si vous ne désirez pas confirmer cette inscription, ignorez ce message.</p>" // html body
										};

										// send mail with defined transport object
										transporter.sendMail(mailOptions, function(error, info){
										    if(error){
										        return console.log(error);
										    }
										    console.log("User "+data.name+" registration: message sent: " + info.response);
										});

										//User is registered, checking if it was from anonymous score in contest
										if(data.postContest){
											scores.getLatestScoreByUserNameWithAContestId(clientIP, function(score){
												if(score != null){
													users.getUserByName(data.name, function(newUser){
														if(newUser != null){
															score.userName = newUser.name;
															score.save(function(scoreSaved){
																if(scoreSaved != null){
																	//OK
																}
																else{
																	console.log("Couldn't get anonymous score to put under new user ownership, couldn't save score for new user "+data.name);
																	socket.emit('Error', 'Votre score n\'a pas pu être sauvegardé comme appartenant à votre compte ! Contactez l\'équipe de Buzzzoom pour en savoir plus.');
																}
															});
														}
														else{
															console.log("Couldn't get anonymous score to put under new user ownership, couldn't find new user "+data.name);
															socket.emit('Error', 'Votre score n\'a pas pu être sauvegardé comme appartenant à votre compte ! Contactez l\'équipe de Buzzzoom pour en savoir plus.');
														}
													});
												}
												else{
													console.log("Couldn't get anonymous score to put under new user ownership, with user from IP "+clientIP);
													socket.emit('Error', 'Votre score n\'a pas pu être sauvegardé comme appartenant à votre compte ! Contactez l\'équipe de Buzzzoom pour en savoir plus.');
												}
											});
										}

										socket.emit('Information', '<p>Votre inscription a été prise en compte, veuillez vérifier votre boite email.</p><p>Nous vous avons envoyé un email dans lequel se trouve un lien. Ce lien permettra de confirmer que vous n\'êtes pas un robot et confirmera votre inscription dès que vous le cliquerez.</p>');
					        		}
					        		else{
						        		socket.emit('Error', 'Votre mot de passe et votre confirmation de mot de passe ne correspondent pas !');
						        	}
					        	}
					        	else{
					        		socket.emit('Error', 'Votre mot de passe n\'est pas assez compliqué ! Il doit utilisé au moins 6 lettres avec des chiffres et des lettres !');
					        	}
				        	}
				        	else{
				        		socket.emit('Error', 'Votre nom est incorrect ! Il doit ne comporter que des lettres minuscules et des chiffres, faire plus de deux lettres et ne pas dépasser 25 caractères, ainsi que ne pas commencer par un chiffre.');
				        	}
				        }
			        });
		        }
	        });
		}
		else{
			socket.emit('Error', 'Cette adresse email n\'est pas valide !');
		}
	});

	//PAIEMENT
	//Stripe
	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here: https://dashboard.stripe.com/account/apikeys
	var stripe = require("stripe")("dddddddddsssssssseeeeeeeeeeeeee");

	app.post('/paiement', function (req, res) {
		console.log("A user is paying");
		//console.log(req);
		// Token is created using Stripe.js or Checkout!
		// Get the payment token submitted by the form:
		var token = req.body.stripeToken; // Using Express

		var packPrice = 499;
		var packDescription = "buzzzoom - Achat de 10 crédits";
		var creditsAmount = 10;
		var username = req.body.userName;
		if(req.body.packId == "1"){
			packPrice = 499;
			packDescription = "buzzzoom - Achat de 10 crédits";
			creditsAmount = 10;
		}
		else if(req.body.packId == "2"){
			packPrice = 1999;
			packDescription = "buzzzoom - Achat de 50 crédits";
			creditsAmount = 50;
		}
		else if(req.body.packId == "3"){
			packPrice = 4999;
			packDescription = "buzzzoom - Achat de 150 crédits";
			creditsAmount = 150;
		}

		// Charge the user's card:
		var charge = stripe.charges.create({
		  amount: packPrice,
		  currency: "eur",
		  description: packDescription,
		  source: token,
		}, function(err, charge) {
			// asynchronously called
			//console.log(err);
			//console.log(charge);
			if(err == null){
				var currentCredits = 0;
				db.collection("users").find({
					name: username
				}).toArray(function (error, results) {
			        if (error) throw error;
			        //Check name availability
					if(results.length > 0){
						currentCredits = results[0].credits;
						if(parseInt(currentCredits) <= -1){
							currentCredits = 0;
						}

						var newCredits = (parseInt(currentCredits) + parseInt(creditsAmount));

						// Get the documents collection
						var collection = db.collection('users');
							// Update document where a is 2, set b equal to 1
							collection.updateOne({ name : username }, { $set: { credits : newCredits } }, function(err, result) {
							if(err == null){
								console.log("User "+username+" payed "+packPrice+"c€ for pack "+req.body.packId+" and now has "+newCredits+" credits.");
								getPage("profile", req, function(finalHtmlRes){res.status(200).send(finalHtmlRes);});
							}
							else{
								//TODO
							}
						});
					}
				});
			}
			else{
				//TODO
			}
		});
	});

	//Paypal : does not work in France for the moment
	/*socket.on('payment', function (dataRaw) {
		var data = JSON.parse(dataRaw);

		if(data.yearExp.length < 4){
			data.yearExp = "20"+data.yearExp;
		}

		var cardData = {
		  "type": data.cardType,
		  "number": data.cardNumber,
		  "expire_month": data.monthExp,
		  "expire_year": data.yearExp,
		  "cvv2": data.secretCode,
		  "first_name": data.firstName,
		  "last_name": data.lastName
		};

		//console.log(cardData);

		paypal.creditCard.create(cardData, function(error, credit_card){
			if (error) {
				console.log(error);
				console.log(error.response);
				//throw error;
				//TODO invalid card error
			}
			else {
				console.log("Create Credit-Card Response");
				console.log(credit_card);

				var create_payment_json = {
				    "intent": "sale",
				    "payer": {
				        "payment_method": "credit_card",
				        "funding_instruments": [{
				            "credit_card": {
				                "type": cardData.type,
				                "number": cardData.number,
				                "expire_month": cardData.expire_month,
				                "expire_year": cardData.expire_year,
				                "cvv2": cardData.cvv2,
				                "first_name": cardData.first_name,
				                "last_name": cardData.last_name,
				                "billing_address": {
				                    "line1": "TODO",
				                    "city": "TODO",
				                    "state": "TODO",
				                    "postal_code": "TODO",
				                    "country_code": "FR"
				                }
				            }
				        }]
				    },
				    "transactions": [{
				        "amount": {
				            "total": "1",
				            "currency": "EUR",
				            "details": {
				                "subtotal": "0.80",
				                "tax": "0.20",
				                "shipping": "0"
				            }
				        },
				        "description": "This is the payment transaction description."
				    }]
				};

				paypal.payment.create(create_payment_json, function (error, payment) {
				    if (error) {
				    	console.log(error);
				    	console.log(error.response);
				        throw error;
				    } else {
				        console.log("Create Payment Response");
				        console.log(payment);
				        //TODO after payment
				    }
				});
			}
		});
	});*/

	//MODIFICATION ADDRESSE
	socket.on('changementAdresse', function (dataRaw) {
		console.log("User tried to register: "+dataRaw);
		var data = JSON.parse(dataRaw);

		users.getUserByName(data.userName, function(user){
			if(user != null){
				if(user.pwd == data.pwd){
					user.addrFirstName = data.fName;
					user.addrLastName = data.lName;
					user.addrLine1 = data.addr;
					user.addrLine2 = data.addr2;
					user.addrPostalCode = data.pCode;
					user.addrCity = data.city;
					user.addrCountry = "France";
					user.phone = data.phone;

					user.save(function(userRes){
						if(userRes != null){
							//TODO check if address already exists
							socket.emit('Information', 'Vos coordonnées ont bien été mises à jour.');
						}
						else{
							socket.emit('Error', 'Erreur 1033 : nous n\'avons pas pu mettre à jour votre adresse.');
						}
					});
				}
				else{
					socket.emit('Error', 'Erreur 1032 : nous n\'avons pas pu mettre à jour votre adresse.');
				}
			}
			else{
				socket.emit('Error', 'Erreur 1031 : nous n\'avons pas pu mettre à jour votre adresse.');
			}
		});
	});

	//MODIFICATION MOT DE PASSE
	socket.on('changementMotdePasse', function (dataRaw) {
		console.log("User tried to register: "+dataRaw);
		var data = JSON.parse(dataRaw);

		users.getUserByName(data.userName, function(user){
			if(user != null){
				if(user.pwd == data.pwd){
					var decryptedPwd = getDecryptedString(user.pwd);
					
					if(decryptedPwd == data.old){
						if(data.new == data.new2){
							var crypted = getCryptedString(data.new);
							user.pwd = crypted;

							user.save(function(userRes){
								if(userRes != null){
									//TODO check if address already exists
									socket.emit('Information', 'Votre mot de passe a bien été mis à jour.');
								}
								else{
									socket.emit('Error', 'Erreur 1053 : nous n\'avons pas pu mettre à jour votre mot de passe.');
								}
							});
						}
						else{
							socket.emit('Error', 'Votre nouveau mot de passe et sa confirmation ne correspondent pas.');
						}
					}
					else{
						socket.emit('Error', 'Votre ancien mot de passe n\'est pas valide.');
					}
				}
				else{
					socket.emit('Error', 'Erreur 1052 : nous n\'avons pas pu mettre à jour votre mot de passe.');
				}
			}
			else{
				socket.emit('Error', 'Erreur 1051 : nous n\'avons pas pu mettre à jour votre mot de passe.');
			}
		});
	});

	//TODO CONFIRMATION D'INSCRIPTION
	socket.on('confirmation', function (dataRaw) {

	});

	//TODO DECONNEXION
	socket.on('deconnexion', function (dataRaw) {
		console.log(dataRaw+" disconnected.");
	});

	//AFFICHAGE PAGE JEU
	socket.on('afficherJeu', function (dataRaw){
		console.log("User tried to display game: "+dataRaw);
		var data = JSON.parse(dataRaw);

		contests.getContestByShortName(data.contest, function(contest){
			if(contest != null){
				users.getUserByName(data.userName, function(user){
					if(user != null){
						if(user.pwd == data.userPwd){
							if(user.addrFirstName == ""
								|| user.addrLastName == ""
								|| user.addrLine1 == ""
								|| user.addrPostalCode == ""
								|| user.addrCity == ""
								|| user.addrCountry == ""){
								socket.emit('afficherJeu', 'noPostal');
							}
							else{
								scores.getScoreByUserNameAndContestId(user.name, contest.id, function(alreadyContest){
									if(alreadyContest != null){
										socket.emit('afficherJeu', 'already');
									}
									else{
										socket.emit('afficherJeu', 'none');
									}
								});
							}
						}
						else{
							console.log("Error code 1023: Wrong password for this user!");
							socket.emit('Error', 'Erreur code 1023');
						}
					}
					else{
						console.log("Error code 1022: Couldn't find user!");
						socket.emit('Error', 'Erreur code 1022');
					}
				});
			}
			else{
				console.log("Error code 1021: Contest doesn't exist!");
				socket.emit('Error', 'Erreur code 1021');
			}
		});
	});

	//NOMBRE DE CREDITS DU JOUEUR
	//if playerName has . or : in characters, it is an ip address and we are asking for an anonymous account
	socket.on('get-credits', function (dataRaw){
		var clientIP = socket.request.connection.remoteAddress;
		if(clientIP == "127.0.0.1" || clientIP == "::1" || clientIP == ""){
			clientIP = socket.request.headers['x-forwarded-for'];
		}

		var data = JSON.parse(dataRaw);

		if(data.playerName != null && data.playerName != ""){
			users.getUserByName(data.playerName, function(user){
				if(user != null){
					var currentCredits = user.credits;
					console.log((new Date().toString())+"User "+data.playerName+" asked for how much credits he has: "+currentCredits);
					socket.emit('get-credits', currentCredits+"");
				}
				else{
					socket.emit('get-credits', "0");
				}
			});
		}
		//Anonymous (user from IP)
		else{
			users.getUserByName(clientIP, function(userFromIp){
				if(userFromIp != null){
					logs.canUserHas24HourBonus(clientIP, function(canHaveBonus){
						if(canHaveBonus){
							userFromIp.credits += twentyfourHourCreditBonusAnonymous;
							userFromIp.save(function(){
								var currentCredits = userFromIp.credits;
								logs.log(new logsModule.Log(db, "", "bonus24hlogin", ""+clientIP+":"+socket.request.connection._peername.port+":"+socket.request.connection._peername.family, new Date(), {userName: clientIP, content: "Gave 24h login bonus for user "+clientIP+" (user from IP)."}));
								console.log("User "+clientIP+" (user from IP) did not receive his 24h bonus, allocated new credits");
								console.log("User "+socket.clientIP+" (user from IP) asked for how much credits he has: "+currentCredits);
								socket.emit('get-credits', currentCredits+"");
							});
						}
						else{
							var currentCredits = userFromIp.credits;
							console.log("User "+clientIP+" (user from IP) asked for how much credits he has: "+currentCredits);
							socket.emit('get-credits', currentCredits+"");
						}
					});
				}
				else{
					var theDate = new Date();
					db.collection("users").insertOne(
					{
						email: "",
						name: clientIP,
						pwd: "",
						addrFirstName: "",
						addrLastName: "",
						addrLine1: "",
						addrLine2: "",
						addrPostalCode: "",
						addrCity: "",
						addrCountry: "France",
						phone: "",
						credits: twentyfourHourCreditBonusAnonymous,
						dateJoined: theDate,//TODO should carry more useful info
						status: "Anonymous"
					}
					);
					socket.emit('get-credits', "5");
				}
			});
		}
	});

	//app.get('/debug', function(req, res){res.status(200).send(req.body.playerName+":777");});

	app.post('/get-credits', function (req, res){
		if(req.body.playerName != null && req.body.playerName != "anonymous"){
			users.getUserByName(req.body.playerName, function(user){
				if(user != null){
					if(req.body.game != null && req.body.game != ""){
						games.getGameByShortName(req.body.game, function(game){
							if(game != null){
								contests.isGameAContest(game, function(contest){
									if(contest == null){
										var currentCredits = user.credits;
										console.log("User "+req.body.playerName+" asked from POST for how much credits he has: "+currentCredits);
										res.status(200).send(req.body.playerName+":"+currentCredits);
									}
									else{
										//check if already score
										contestId = contest.id;
										scores.getScoreByUserNameAndContestId(user.name, contestId, function(alreadyContest){
											if(alreadyContest != null){
												res.status(200).send(req.body.playerName+":already");
											}
											else{
												//Check if no postal address
												if(user.addrFirstName == ""
													|| user.addrLastName == ""
													|| user.addrLine1 == ""
													|| user.addrPostalCode == ""
													|| user.addrCity == ""
													|| user.addrCountry == ""){
													res.status(200).send(req.body.playerName+":already");
												}
												else{
													res.status(200).send(req.body.playerName+":contest");
												}
											}
										});
									}
								});
							}
							else{
								//TODO
								res.status(200).send("");
							}
						});
					}
					else{
						var currentCredits = user.credits;
						console.log("User "+req.body.playerName+" asked from POST for how much credits he has: "+currentCredits);
						res.status(200).send(req.body.playerName+":"+currentCredits);
					}
				}
				else{
					console.log("User "+req.body.playerName+" asked from POST for how much credits but we couldn't find him in the database.");
					res.status(200).send("");
				}
			});
		}
		else{
			//TODO user from IP (Anonymous accounts) check if 24h hours bonus can be given (for the moment, only async get-credits (with socket.io) handles this)
			var ip = "";
			ip = ip + req.connection.remoteAddress;
			if(ip == "127.0.0.1" || ip == "::1" || ip == ""){
				ip = req.headers['x-forwarded-for'];
			}
			//console.log("IP: "+ip);

			users.getUserByName(ip, function(user){
				if(user != null){
					if(req.body.game != null && req.body.game != ""){
						games.getGameByShortName(req.body.game, function(game){
							if(game != null){
								contests.isGameAContest(game, function(contest){
									if(contest == null){
										var currentCredits = user.credits;
										console.log("User "+ip+" (user from IP) asked from POST for how much credits he has: "+currentCredits);
										res.status(200).send(req.body.playerName+":"+currentCredits);
									}
									else{
										//check if already score
										contestId = contest.id;
										scores.getScoreByUserNameAndContestId(user.name, contestId, function(alreadyContest){
											if(alreadyContest != null){
												res.status(200).send(req.body.playerName+":already");
											}
											else{
												//Check if no postal address
												/*if(user.addrFirstName == ""
													|| user.addrLastName == ""
													|| user.addrLine1 == ""
													|| user.addrPostalCode == ""
													|| user.addrCity == ""
													|| user.addrCountry == ""){
													res.status(200).send(req.body.playerName+":already");
												}
												else{*/
													res.status(200).send(req.body.playerName+":contest");
												//}
											}
										});
									}
								});
							}
							else{
								//TODO
								res.status(200).send("");
							}
						});
					}
					else{
						var currentCredits = user.credits;
						console.log("User "+ip+" (user from IP) asked from POST for how much credits he has: "+currentCredits);
						res.status(200).send(req.body.playerName+":"+currentCredits);
					}
				}
				else{
					var theDate = new Date();
					db.collection("users").insertOne(
					{
						email: "",
						name: ip,
						pwd: "",
						addrFirstName: "",
						addrLastName: "",
						addrLine1: "",
						addrLine2: "",
						addrPostalCode: "",
						addrCity: "",
						addrCountry: "France",
						phone: "",
						credits: twentyfourHourCreditBonusAnonymous,
						dateJoined: theDate,//TODO should carry more useful info
						status: "Anonymous"
					}
					);
					res.status(200).send("anonymous:5");

					//console.log("User "+req.body.playerName+" (user from IP) asked from POST for how much credits but we couldn't find him in the database.");
					//res.status(200).send("");
				}
			});
		}
	});

	//NOUVELLE PARTIE
	app.post('/new-game', function (req, res) {
		//console.log("User "+req.body.playerName+" started a new game on "+req.body.game);
		var playername = "";
		var ip = "";
		if(req.body.playerName != null && req.body.playerName != "anonymous"){
			playername = req.body.playerName;
		}
		else{
			ip = ip + req.connection.remoteAddress;
			if(ip == "127.0.0.1" || ip == "::1" || ip == ""){
				ip = req.headers['x-forwarded-for'];
			}
			playername = ip;
		}

		users.getUserByName(playername, function(user){
			if(user != null){
				games.getGameByShortName(req.body.game, function(game){
					if(game != null){
						contests.isGameAContest(game, function(contest){
							if(contest == null){
								user.credits = (parseInt(user.credits) - 1);
								if(user.credits < -1){
									user.credits = -1;
								}
								user.save(function(result){
									if(result != null){
										logs.log(new logsModule.Log(db, "", "new-game", ip, new Date(), {"content": playername+"(user from IP) started a new game on "+game.shortName}));
										res.status(200).send("");
									}
									else{
										console.log("New game error: Couldn't save user");
										res.status(200).send("");
									}
								});
							}
							else{
								//TODO check if already score in contest, in such case, player is cheating: can only play a contest and submit a score once
								//he won't be able to submit a score anyway but it is better to shadow detect cheaters
								logs.log(new logsModule.Log(db, "", "new-contest", ip, new Date(), {"content": playername+"(user from IP) started a new contest on "+game.shortName}));
								res.status(200).send("");
							}
						});
					}
					else{
						//TODO
						console.log("New game error: Couldn't find game");
						res.status(200).send("");
					}
				});
			}
			else{
				console.log("New game error: Couldn't find user");
				res.status(200).send("");
			}
		});
	});


	//NOUVEAU SCORE (et score à un concours)
	app.post('/set-score', function (req, res){
		var clientIP = req.connection.remoteAddress;
		if(clientIP == "127.0.0.1" || clientIP == "::1" || clientIP == ""){
			clientIP = req.headers['x-forwarded-for'];
		}

		if(req.body.playerName != null && req.body.playerName != "anonymous"){
			console.log("User "+req.body.playerName+" wants to submit a new score: "+req.body.score);
			users.getUserByName(req.body.playerName, function(user){
				if(user != null){
					if(user.credits >= 0){
						//Last game, no credits but can still submit a last score (can launch last game (current credits: 0), play and submit)
						if(users.credits == 0){
							user.credits = -1;
							user.save(function(){});
						}

						games.getGameByShortName(req.body.game, function(game){
							if(game == null){
								console.log("Couldn't submit score of user "+req.body.playerName+": Could not find this game");
								res.status(200).send("");
							}
							else{
								contests.isGameAContest(game, function(contest){
									var contestId = "";

									if(contest != null){
										contestId = contest.id;
										scores.getScoreByUserNameAndContestId(user.name, contestId, function(alreadyContest){
											if(alreadyContest != null){
												console.log("Couldn't submit score of user "+req.body.playerName+": a score from this player already exists on this contest.");
												//res.status(200).send("already");
												//TODO can be used to shadow detect cheaters
												res.status(200).send("");
											}
											else{
												submitScore(db, user.name, game.shortName, contestId, req.body.score);
											}
										});
									}
									else{
										submitScore(db, user.name, game.shortName, contestId, req.body.score);
									}

									function submitScore(db, userName, gameName, cId, scoreValue){
										var score = new scoresModule.Score(db, "", userName, gameName, cId, scoreValue, new Date());
										score.save(function(result){
											if(result != null){
												console.log("Submited score of user "+req.body.playerName+" for game "+req.body.game);
												res.status(200).send("");
											}
											else{
												console.log("Couldn't submit score of user "+req.body.playerName+": score is null after submission");
												res.status(200).send("");
											}
										});
									}
								});
							}
						});
					}
					else{
						console.log("User does not have enough credits to submit score. (CHEATING?)");
						res.status(200).send("");
					}
				}
				else{
					console.log("Couldn't submit score of user "+req.body.playerName+": Could not find this user");
					res.status(200).send("");
				}
			});
		}
		else{
			console.log("User "+clientIP+" (user from IP) wants to submit a new score: "+req.body.score);
			users.getUserByName(clientIP, function(user){
				if(user != null){
					if(user.credits >= 0){
						//Last game, no credits but can still submit a last score (can launch last game (current credits: 0), play and submit)
						if(users.credits == 0){
							user.credits = -1;
							user.save(function(){});
						}

						games.getGameByShortName(req.body.game, function(game){
							if(game == null){
								console.log("Couldn't submit score of user "+clientIP+": Could not find this game");
								res.status(200).send("");
							}
							else{
								contests.isGameAContest(game, function(contest){
									var contestId = "";

									if(contest != null){
										contestId = contest.id;
										scores.getScoreByUserNameAndContestId(user.name, contestId, function(alreadyContest){
											if(alreadyContest != null){
												console.log("Couldn't submit score of user "+clientIP+": a score from this player already exists on this contest.");
												//res.status(200).send("already");
												//TODO can be used to shadow detect cheaters
												res.status(200).send("");
											}
											else{
												submitScore(db, user.name, game.shortName, contestId, req.body.score);
											}
										});
									}
									else{
										submitScore(db, user.name, game.shortName, contestId, req.body.score);
									}

									function submitScore(db, userName, gameName, cId, scoreValue){
										var score = new scoresModule.Score(db, "", userName, gameName, cId, scoreValue, new Date());
										score.save(function(result){
											if(result != null){
												console.log("Submited score of user "+clientIP+" for game "+req.body.game);
												res.status(200).send("");
											}
											else{
												console.log("Couldn't submit score of user "+clientIP+": score is null after submission");
												res.status(200).send("");
											}
										});
									}
								});
							}
						});
					}
					else{
						console.log("User does not have enough credits to submit score. (CHEATING?)");
						res.status(200).send("");
					}
				}
				else{
					console.log("Couldn't submit score of user "+clientIP+": Could not find this user");
					res.status(200).send("");
				}
			});
		}
	});
});

console.log("sync script finished, waiting for async actions to finish...");