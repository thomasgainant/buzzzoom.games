function CSSpostLoad(){
	var content = document.querySelector("#content");
	if(content != null){
		var body = document.querySelector("body");
		var header = document.querySelector("#header");
		var menu = document.querySelector("#menu");
		var footer = document.querySelector("#footer");

		var minHeight = parseFloat(body.offsetHeight) - (parseFloat(header.offsetHeight) + parseFloat(menu.offsetHeight) + parseFloat(footer.offsetHeight));
		content.style.minHeight = minHeight+"px";
	}
}