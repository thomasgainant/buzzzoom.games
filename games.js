var Game = function(db, id, shortName, name, code, description, scoreType, dateCreated, status){
	this.db = db;

	this.id = id;
	this.shortName = shortName;
	this.name = name;
	this.code = code;
	this.description = description;
	this.scoreType = scoreType;
	this.dateCreated = dateCreated;
	this.status = status;
}

var Games = function(db){
	this.db = db;
    console.log("Games management ready");
};

Games.prototype.getGameByShortName = function(shortName, callback){
	var that = this;

	that.db.collection("games").find({
    	shortName:shortName
    }).toArray(function (error, results) {
        //if (error) throw error;
        if(results.length > 0){
        	var game = new Game(that.db, results[0]._id.toString(), results[0].shortName, results[0].name, results[0].code, results[0].description, results[0].scoreType, results[0].dateCreated, results[0].status);
        	callback(game);
        }
        else{
        	callback(null);
        }
	});
};

Games.prototype.getLatestPublishedGames = function(callback){
	var that = this;

	var games = [];

	that.db.collection("games").find({
    	status: "Published"
    }).sort({ dateCreated : -1 }).toArray(function (error, results) {
        //if (error) throw error;
        for(var i = 0; i < results.length; i++){
        	var game = new Game(that.db, results[i]._id.toString(), results[i].shortName, results[i].name, results[i].code, results[i].description, results[i].scoreType, results[i].dateCreated, results[i].status);
        	games[i] = game;
        }

        if(results.length > 0){
        	callback(games);
        }
        else{
        	callback(null);
        }
	});
};

Games.prototype.getGames = function(callback){
	var that = this;

	var games = [];

	that.db.collection("games").find({
    	
    }).sort({ dateCreated : -1 }).toArray(function (error, results) {
        //if (error) throw error;
        for(var i = 0; i < results.length; i++){
        	var game = new Game(that.db, results[i]._id.toString(), results[i].shortName, results[i].name, results[i].code, results[i].description, results[i].scoreType, results[i].dateCreated, results[i].status);
        	games[i] = game;
        }

        if(results.length > 0){
        	callback(games);
        }
        else{
        	callback(null);
        }
	});
};

exports.Game = Game;
exports.Games = Games;