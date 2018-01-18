var ObjectId = require('mongodb').ObjectID;

var Log = function(db, id, type, ip, time, data){
	this.db = db;

	this.id = id;
	this.type = type;
	this.ip = ip;
	this.time = time;
	if(data != null){
		for(var key in data){
			this[key] = data[key];
		}
	}
}

Log.prototype.save = function(callback){
	var that = this;

	var data = {};
	for(var key in that){
		if(key != "db" && key != "save" && key != "dataToString"){
			data[key] = that[key];
		}
	}
	//console.log(data);

	var collection = that.db.collection('logs');
	var o_id;
	if(that.id != ""){
		o_id = new ObjectId(that.id);
		collection.updateOne({
			"_id": o_id
		},
		{ $set: data }, function(err, result) {
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
		collection.insert(data, function(err, result) {
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

Log.prototype.dataToString = function(){
	var that = this;

	var data = {};
	for(var key in that){
		if(key != "db" && key != "save" && key != "dataToString" && key != "id" && key != "type" && key != "ip" && key != "time"){
			data[key] = that[key];
		}
	}
	var dataAsString = "";
	var i = 0;
	for(var key in data){
		if(i != 0){
			dataAsString += ", ";
		}
		dataAsString += data[key];
		i++;
	}

	return ""+that.time+": "+that.type+" - "+dataAsString+" @"+that.ip;
}

var Logs = function(db){
	this.db = db;
	console.log("Logs management ready");
};

Logs.prototype.log = function(log, callback){
	var that = this;

	log.save(function(res){
		if(res != null){
			console.log(log.dataToString());
		}
		else{
			console.log("Couldn't log.");
		}
	});
}

Logs.prototype.canUserHas24HourBonus = function(userName, callback){
	var that = this;
	
	//Check 24h bonus TODO: progressive bonus (the more consecutive days, the more bonus you get)
	var twentyFourHoursAgo = new Date();
	twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
	//console.log(twentyFourHoursAgo);
	that.getLatestLogsByTypeAndData("bonus24hlogin", { userName: userName, time: {$gte: twentyFourHoursAgo}}, function(loginLogs){
		//console.log(loginLogs);
		if(loginLogs.length == 0){
			callback(true);
		}
		else{
			callback(false);
		}
	}, 2000);//TODO limit is 2000 for memory optimisation but what if player stays on site all day long? (more than 200 login logs in such case)
}

Logs.prototype.getLatestLogsByTypeAndData = function(type, data, callback, limit){
	var that = this;

	var limitLocal = limit;
	if(limitLocal == null){
		limitLocal = 0;
	}

	var conditions = {};
	conditions["type"] = type;
	for(var key in data){
		conditions[key] = data[key];
	}
	//console.log(conditions);

	var logsResult = [];

	that.db.collection("logs").find(conditions).sort({ time : -1 }).limit(limitLocal).toArray(function (error, results) {
        if (error) throw error;
		for(var i = 0; i < results.length; i++){
			var dataContent = {};
			for(var key in results[i]){
				if(key != "_id" && key != "type" && key != "ip" && key != "time"){
					dataContent[key] = results[i][key];
				}
			}

			logsResult[i] = new Log(
				that.db,
				results[i]._id.toString(),
				results[i].type,
				results[i].ip,
				results[i].time,
				dataContent
			);
		}
		callback(logsResult);
	});
}

exports.Log = Log;
exports.Logs = Logs;