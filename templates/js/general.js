var connexionButton;
var connexionPopup;

var deconnexionButton;

var creditsOverlay;
var creditsInterval;

var socket = io.connect(""+"#{{serverSocketUrl}}");

socket.on('connexion', function(message) {
	var data = JSON.parse(message);
	//socket.userId = data.userId;
	socket.userEmail = data.email;
	socket.userName = data.userName;
	socket.userPwd = data.pwd;
	socket.userFName = data.fName;
	socket.userLName = data.lName;
	socket.userAddr = data.addr;
	socket.userAddr2 = data.addr2;
	socket.userPCode = data.pCode;
	socket.userCity = data.city;
	socket.userCountry = data.country;
	socket.userPhone = data.phone;
	socket.userCredits = data.credits;
	socket.userStatus = data.status;
	//console.log(socket.userId+"/"+socket.userPwd);

	Cookies.set('userName', data.userName);
	Cookies.set('userPwd', data.pwd);
	
	if(connexionPopup != null){
		closePopup(connexionPopup);
	}

	var profileName = document.querySelector(".profileName");
	if(profileName != null){
		displayProfileLink(profileName);
	}

	checkCredits();

	postConnect();
});

function checkCredits(){
	if(socket.userName != null && socket.userName != ""){
		socket.emit('get-credits', JSON.stringify({ playerName: socket.userName }));
	}
	else{
		socket.emit('get-credits', JSON.stringify({ playerName: "" }));
	}
}

function getPlayerName(){
	if(socket.userName != null && socket.userName != ""){
		return socket.userName;
	}
	else{
		return "anonymous";
	}
}

socket.on('get-credits', function(credits){
	socket.userCredits = parseInt(credits);

	if(socket.userName != null && socket.userName != ""){
		if(creditsOverlay != null){
			creditsOverlay.parentElement.removeChild(creditsOverlay);
		}

		displayOverlay(document.querySelector("#menu nav a:nth-child(5)"), "<div class=\"credits-round\">"+socket.userCredits+"</div>", false, false, function(overlay){
			creditsOverlay = overlay;
		});
	}
	else{
		console.log("Anonymous user credits: "+credits);
	}
});

socket.on('Information', function(message) {
	//alert('Le serveur a un message pour vous : ' + message);
	popup(message, function(){});
});

socket.on('Error', function(message) {
	//alert('Le serveur a un message pour vous : ' + message);
	popup(message, function(){});
});

window.onload = function(){
	CSSpostLoad();

	connexionButton = document.querySelector(".connexion");

	var userNameCookie = Cookies.get('userName');
	var userPwdCookie = Cookies.get('userPwd');
	if(userNameCookie != null && userNameCookie != "" && userPwdCookie != null && userPwdCookie != ""){
		socket.emit('connexionU', JSON.stringify({login: ""+userNameCookie, pwd: ""+userPwdCookie}));
	}

	checkCredits();
	creditsInterval = setInterval(function(){
		checkCredits();
	}, 15000);

	connexionButton.onclick = function(e){
		e.preventDefault();
		connexionPopup = popup(
			"<form class=\"connexion\"><p><label>Nom d'utilisateur :</label><br/><input class=\"connexion-login\" type=\"text\"/></p><p><label>Mot de passe :</label><br/><input class=\"connexion-pwd\" type=\"password\"/></p><input class=\"connexion-submit\" type=\"submit\" value=\"Connexion\"/></form><a href=\"inscription\">Je n'ai pas de compte</a>",
			function(popupElement){
				//Connexion
				var loginInput;
				var pwdInput;
				var submitInput;

				loginInput = popupElement.querySelector(".connexion-login");
				pwdInput = popupElement.querySelector(".connexion-pwd");
				submitInput = popupElement.querySelector(".connexion-submit");

				submitInput.onclick = function(e){
					e.preventDefault();
					socket.emit('connexion', JSON.stringify({login: ""+loginInput.value, pwd: ""+pwdInput.value}));
				};
			},
			"<h3>Connexion à votre compte</h3>"
		);
	};

	deconnexionButton = document.querySelector(".disconnect");
	if(deconnexionButton != null){
		deconnexionButton.onclick = function(e){
			e.preventDefault();

			Cookies.remove('userName');
			Cookies.remove('userPwd');

			window.location = "/";
		};
	}

	postLoad();
};

function popup(html, callback, header){
	var newPopup = document.createElement("div");

	var finalHeader = "";
	if(header != null && header != "undefined" && header != ""){
		finalHeader = header;
	}

	newPopup.className = "popup";
	newPopup.innerHTML = "<div class=\"popup-content\"><div class=\"popup-header\">"+finalHeader+"<div class=\"popup-close\">X</div></div><div class=\"popup-html\">"+html+"</div></div><div class=\"popup-fake\"></div>";

	document.body.appendChild(newPopup);

	var closeButton = newPopup.querySelector(".popup-close");
	closeButton.onclick = function(e){
		e.preventDefault();
		closePopup(this.parentElement.parentElement.parentElement);
	}

	callback(newPopup);
	return newPopup;
}

function closePopup(popupElement){
	popupElement.parentElement.removeChild(popupElement);
}

function displayOverlay(parentElement, html, top, left, callback){
	//console.log(parentElement);
	var newOverlay = document.createElement("div");

	newOverlay.className = "overlay";
	newOverlay.innerHTML = html;

	document.body.appendChild(newOverlay);

	var finalY = parseFloat(parentElement.offsetTop);
	var finalX = parseFloat(parentElement.offsetLeft);

	if(top){
		finalY -= parseFloat(newOverlay.offsetHeight)/2.0;
	}
	else{
		finalY += parseFloat(parentElement.offsetHeight) - parseFloat(newOverlay.offsetHeight)/2.0;
	}

	if(left){
		finalX -= parseFloat(newOverlay.offsetWidth)/2.0;
	}
	else{
		finalX += parseFloat(parentElement.offsetWidth) - parseFloat(newOverlay.offsetWidth)/2.0;
	}

	newOverlay.style.top = finalY+"px";
	newOverlay.style.left = finalX+"px";

	callback(newOverlay);
}

function displayProfileLink(element){
	element.innerHTML = "@"+socket.userName;
	element.setAttribute("href", "profil");
	element.onclick = function(e){
		e.preventDefault();
		window.location="/profil";
	};
}