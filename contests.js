var ObjectId = require('mongodb').ObjectID;

var Contest = function(db, id, title, shortName, description, prizeDescription, medias, gameShortName, start, end, status){
	this.db = db;

	this.id = id;
	this.title = title;
	this.shortName = shortName;
	this.description = description;
	this.prizeDescription = prizeDescription;
	this.medias = medias;
	this.gameShortName = gameShortName;
	this.start = start;
	this.end = end;
	this.status = status;
}

Contest.prototype.save = function(callback){
	var that = this;

	var collection = that.db.collection('contests');
	var o_id;
	if(that.id != ""){
		o_id = new ObjectId(that.id);
		collection.updateOne({
			"_id": o_id
		},
		{ $set: {
			title: that.title,
			shortName: that.shortName,
			description: that.description,
			prizeDescription: that.prizeDescription,
			medias: that.medias,
			gameShortName: that.gameShortName,
			start: that.start,
			end: that.end,
			status: that.status
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
			title: that.title,
			shortName: that.shortName,
			description: that.description,
			prizeDescription: that.prizeDescription,
			medias: that.medias,
			gameShortName: that.gameShortName,
			start: that.start,
			end: that.end,
			status: that.status
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

var Contests = function(db){
	this.db = db;
	console.log("Contests management ready");
};

Contests.prototype.getContestByShortName = function(shortName, callback){
	var that = this;

	that.db.collection("contests").find({
    	shortName:shortName
    }).toArray(function (error, results) {
        //if (error) throw error;
        if(results.length > 0){
        	var contest = new Contest(
				that.db,
				results[0]._id.toString(),
				results[0].title,
				results[0].shortName,
				results[0].description,
				results[0].prizeDescription,
				results[0].medias,
				results[0].gameShortName,
				results[0].start,
				results[0].end,
				results[0].status
			);
        	callback(contest);
        }
        else{
        	callback(null);
        }
	});
};

Contests.prototype.isGameAContest = function(game, callback){
	var that = this;

	that.findLatestCurrentPublishedContests(0, function(contests){
		var contestOnThisGame = null;
		for(var i = 0; i < contests.length; i++){
			if(contests[i].gameShortName == game.shortName){
				contestOnThisGame = contests[i];
				break;
			}
		}
		callback(contestOnThisGame);
	});
}

/*
	Find contests which are:
	- published
	- current
	- ordered by start date
*/
Contests.prototype.findLatestCurrentPublishedContests = function(contestsLimit, callback, start){
	var that = this;

	if(start == null){
		start = 0;
	}

	var contests = [];

	that.db.collection("contests").find({
		status: "Published",
		start: { $lte: new Date() },
		end: { $gte: new Date() }
	 }).sort({ start : -1 }).skip(start).limit(contestsLimit).toArray(function (error, results) {
        if (error) throw error;
		for(var i = 0; i < results.length; i++){
			contests[i] = new Contest(
				that.db,
				results[i]._id.toString(),
				results[i].title,
				results[i].shortName,
				results[i].description,
				results[i].prizeDescription,
				results[i].medias,
				results[i].gameShortName,
				results[i].start,
				results[i].end,
				results[i].status
			);
		}
		callback(contests);
	});
};

/*
	Find contests which are:
	- published
	- current or past
	- ordered by start date
*/
Contests.prototype.findLatestCurrentAndPastPublishedContests = function(contestsLimit, callback, start){
	var that = this;

	if(start == null){
		start = 0;
	}

	var contests = [];

	that.db.collection("contests").find({
		status: "Published",
		start: { $lte: new Date() }
	 }).sort({ start : -1 }).skip(start).limit(contestsLimit).toArray(function (error, results) {
        if (error) throw error;
		for(var i = 0; i < results.length; i++){
			contests[i] = new Contest(
				that.db,
				results[i]._id.toString(),
				results[i].title,
				results[i].shortName,
				results[i].description,
				results[i].prizeDescription,
				results[i].medias,
				results[i].gameShortName,
				results[i].start,
				results[i].end,
				results[i].status
			);
		}
		callback(contests);
	});
};

/*
	Find contests which are:
	- published
	- ordered by start date
*/
Contests.prototype.findLatestPublishedContests = function(contestsLimit, callback, start){
	var that = this;

	if(start == null){
		start = 0;
	}

	var contests = [];

	that.db.collection("contests").find({ status: "Published" }).sort({ start : -1 }).skip(start).limit(contestsLimit).toArray(function (error, results) {
        if (error) throw error;
		for(var i = 0; i < results.length; i++){
			contests[i] = new Contest(
				that.db,
				results[i]._id.toString(),
				results[i].title,
				results[i].shortName,
				results[i].description,
				results[i].prizeDescription,
				results[i].medias,
				results[i].gameShortName,
				results[i].start,
				results[i].end,
				results[i].status
			);
		}
		callback(contests);
	});
};

Contests.prototype.findNextPublishedContests = function(contestsLimit, callback, start){
	var that = this;

	if(start == null){
		start = 0;
	}

	var contests = [];

	that.db.collection("contests").find({ start: {$gt: new Date()}, status: "Published" }).sort({ start : -1 }).skip(start).limit(contestsLimit).toArray(function (error, results) {
        if (error) throw error;
		for(var i = 0; i < results.length; i++){
			contests[i] = new Contest(
				that.db,
				results[i]._id.toString(),
				results[i].title,
				results[i].shortName,
				results[i].description,
				results[i].prizeDescription,
				results[i].medias,
				results[i].gameShortName,
				results[i].start,
				results[i].end,
				results[i].status
			);
		}
		callback(contests);
	});
};

Contests.prototype.findContests = function(contestsLimit, callback, start){
	var that = this;

	if(start == null){
		start = 0;
	}

	var contests = [];

	that.db.collection("contests").find({}).sort({ start : -1 }).skip(start).limit(contestsLimit).toArray(function (error, results) {
        if (error) throw error;
		for(var i = 0; i < results.length; i++){
			contests[i] = new Contest(
				that.db,
				results[i]._id.toString(),
				results[i].title,
				results[i].shortName,
				results[i].description,
				results[i].prizeDescription,
				results[i].medias,
				results[i].gameShortName,
				results[i].start,
				results[i].end,
				results[i].status
			);
		}
		callback(contests);
	});
};

exports.Contest = Contest;
exports.Contests = Contests;