var ObjectId = require('mongodb').ObjectID;

var Score = function(db, id, userName, gameShortName, contestId, score, dateCreated){
	this.db = db;

	this.id = id;
	this.userName = userName;
	this.gameShortName = gameShortName;
	this.contestId = contestId;
	this.score = score;
	this.dateCreated = dateCreated;
}

Score.prototype.save = function(callback){
	var that = this;

	var collection = that.db.collection('scores');
	var o_id;
	if(that.id != ""){
		o_id = new ObjectId(that.id);
		collection.updateOne({
			"_id": o_id
		},
		{ $set: {
			userName: that.userName,
			gameShortName: that.gameShortName,
			contestId: that.contestId,
			score: that.score,
			dateCreated: that.dateCreated
		} }, function(err, result) {
		if(err == null){
			callback(that);
		}
		else{
			console.log(err);
			callback(null);
		}
		});
	}
	else{
		collection.insert({
			userName: that.userName,
			gameShortName: that.gameShortName,
			contestId: that.contestId,
			score: that.score,
			dateCreated: that.dateCreated
		}, function(err, result) {
		if(err == null){
			callback(that);
		}
		else{
			console.log(err);
			callback(null);
		}
		});
	}
};

var Scores = function(db){
	this.db = db;
	console.log("Scores management ready");
};

Scores.prototype.sortScores = function(scoresRaw, scoreType){
	var sortedScores = [];

	if(scoreType == "ASC"){
		for(var i = 0; i < scoresRaw.length; i++){
			//console.log("value: "+scoresRaw[i].score);
			var sortedScoresLength = sortedScores.length;
			for(var j = 0; j <= sortedScoresLength; j++){
				//console.log(sortedScores);
				//console.log("sorted value: "+sortedScores[j].score);
				if(j == sortedScoresLength){
					//console.log("#"+j+" "+scoresRaw[i].score+" put on end at "+j);
					sortedScores[j] = scoresRaw[i];
					break;
				}
				else if(parseFloat(scoresRaw[i].score) > parseFloat(sortedScores[j].score)){
					//console.log("#"+j+" "+scoresRaw[i].score+" gt "+sortedScores[j].score+" will put at "+j);
					for(var k = sortedScores.length; k >= j; k--){
						sortedScores[k] = sortedScores[k - 1];
					}
					sortedScores[j] = scoresRaw[i];
					break;
				}
				else{
					//console.log("#"+j+" continue because "+scoresRaw[i].score+" <= "+sortedScores[j].score);
					continue;
				}
			}
		}
	}
	else{
		//TODO
	}

	return sortedScores;
};

Scores.prototype.getScoreByUserNameAndContestId = function(userName, contestId, callback){
	var that = this;

	that.db.collection("scores").find({
		userName:userName,
    	contestId:contestId
    }).toArray(function (error, results) {
        //if (error) throw error;
        if(results.length > 0){
        	var score = new Score(that.db, results[0]._id.toString(), results[0].userName, results[0].gameShortName, results[0].contestId, results[0].score, results[0].dateCreated);
        	callback(score);
        }
        else{
        	callback(null);
        }
	});
};

Scores.prototype.getLatestScoresByContestId = function(contestId, callback){
	var that = this;

	var scores = [];

	that.db.collection("scores").find({
    	contestId:contestId
    }).sort({ dateCreated : -1 }).toArray(function (error, results) {
        //if (error) throw error;
        for( var i = 0; i < results.length; i++){
        	var score = new Score(that.db, results[i]._id.toString(), results[i].userName, results[i].gameShortName, results[i].contestId, results[i].score, results[i].dateCreated);
  			scores[i] = score;      	
        }

        callback(scores);
	});
};

Scores.prototype.getLatestScoresByGameShortName = function(gameShortName, callback){
	var that = this;

	var scores = [];

	that.db.collection("scores").find({
		gameShortName:gameShortName
    }).sort({ dateCreated : -1 }).toArray(function (error, results) {
        //if (error) throw error;
        for( var i = 0; i < results.length; i++){
        	var score = new Score(that.db, results[i]._id.toString(), results[i].userName, results[i].gameShortName, results[i].contestId, results[i].score, results[i].dateCreated);
  			scores[i] = score;      	
        }

        callback(scores);
	});
};

Scores.prototype.getLatestScoresByGameShortNameWithoutContestId = function(gameShortName, callback){
	var that = this;

	var scores = [];

	that.db.collection("scores").find({
		$or: [{gameShortName:gameShortName,
    	contestId: {$exists: false}},
		{gameShortName:gameShortName,
    	contestId: ""}]
    }).sort({ dateCreated : -1 }).toArray(function (error, results) {
        //if (error) throw error;
        for( var i = 0; i < results.length; i++){
        	var score = new Score(that.db, results[i]._id.toString(), results[i].userName, results[i].gameShortName, results[i].contestId, results[i].score, results[i].dateCreated);
  			scores[i] = score;      	
        }

        callback(scores);
	});
};

Scores.prototype.getLatestScoreByUserNameWithAContestId = function(userName, callback){
	var that = this;

	that.db.collection("scores").find({
		userName:userName,
    	contestId:{$exists:true}
    }).sort({ dateCreated : -1 }).toArray(function (error, results) {
        //if (error) throw error;
        if(results.length > 0){
        	var score = new Score(that.db, results[0]._id.toString(), results[0].userName, results[0].gameShortName, results[0].contestId, results[0].score, results[0].dateCreated);
        	callback(score);
        }
        else{
        	callback(null);
        }
	});
};

exports.Score = Score;
exports.Scores = Scores;