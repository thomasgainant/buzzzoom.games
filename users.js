var ObjectId = require('mongodb').ObjectID;

var User = function(db, id, email, name, pwd, addrFirstName, addrLastName, addrLine1, addrLine2, addrPostalCode, addrCity, addrCountry, phone, credits, dateJoined, status){
	this.db = db; 

	this.id = id;
	this.email = email;
	this.name = name;
	this.pwd = pwd;
	this.addrFirstName = addrFirstName;
	this.addrLastName = addrLastName;
	this.addrLine1 = addrLine1;
	this.addrLine2 = addrLine2;
	this.addrPostalCode = addrPostalCode;
	this.addrCity = addrCity;
	this.addrCountry = addrCountry;
	this.phone = phone;
	this.credits = credits;//0 if no credits but last score not submitted, -1 if submitted
	this.dateJoined = dateJoined;
	this.status = status;
};

User.prototype.save = function(callback){
	var that = this;

	var collection = that.db.collection('users');
	var o_id;
	if(that.id != ""){
		o_id = new ObjectId(that.id);
		collection.updateOne({
			"_id": o_id
		},
		{ $set: {
			email: that.email,
			name: that.name,
			pwd: that.pwd,
			addrFirstName: that.addrFirstName,
			addrLastName: that.addrLastName,
			addrLine1: that.addrLine1,
			addrLine2: that.addrLine2,
			addrPostalCode: that.addrPostalCode,
			addrCity: that.addrCity,
			addrCountry: that.addrCountry,
			phone: that.phone,
			credits: that.credits,
			dateJoined: that.dateJoined,
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
			email: that.email,
			name: that.name,
			pwd: that.pwd,
			addrFirstName: that.addrFirstName,
			addrLastName: that.addrLastName,
			addrLine1: that.addrLine1,
			addrLine2: that.addrLine2,
			addrPostalCode: that.addrPostalCode,
			addrCity: that.addrCity,
			addrCountry: that.addrCountry,
			phone: that.phone,
			credits: that.credits,
			dateJoined: that.dateJoined,
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

var Users = function(db){
	this.db = db
	console.log("Users management ready");
};

Users.prototype.getUserByEmail = function(email, callback){
	var that = this;

	that.db.collection("users").find({
		email: email
	}).toArray(function (error, results) {
        if (error) throw error;
		if(results.length > 0){
			var user = new User(
				that.db,
				results[0]._id.toString(),
				results[0].email,
				results[0].name,
				results[0].pwd,
				results[0].addrFirstName,
				results[0].addrLastName,
				results[0].addrLine1,
				results[0].addrLine2,
				results[0].addrPostalCode,
				results[0].addrCity,
				results[0].addrCountry,
				results[0].phone,
				results[0].credits,
				results[0].dateJoined,
				results[0].status
			);
			callback(user);
		}
		else{
			callback(null);
		}
	});
}

Users.prototype.getUserByName = function(name, callback){
	var that = this;

	that.db.collection("users").find({
		name: name
	}).toArray(function (error, results) {
        if (error) throw error;
		if(results.length > 0){
			var user = new User(
				that.db,
				results[0]._id.toString(),
				results[0].email,
				results[0].name,
				results[0].pwd,
				results[0].addrFirstName,
				results[0].addrLastName,
				results[0].addrLine1,
				results[0].addrLine2,
				results[0].addrPostalCode,
				results[0].addrCity,
				results[0].addrCountry,
				results[0].phone,
				results[0].credits,
				results[0].dateJoined,
				results[0].status
			);
			callback(user);
		}
		else{
			callback(null);
		}
	});
}

exports.User = User;
exports.Users = Users;