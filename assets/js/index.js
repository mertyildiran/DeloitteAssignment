"use strict";

var toggleButton = document.getElementById('toggleButton'),
	selectedContainer = document.querySelector(".category-list"),
	removeButton = document.querySelector(".search-bar .remove"),
	autocomplete = document.getElementById("automcomplete"),
	searchInput = document.getElementById("searchInput");


/* Open The Category Menu */
toggleButton.addEventListener('click', function(){
	toggleButton.classList.toggle('open');
	selectedContainer.classList.toggle('active');
});

var minWordLength = 2,
	maxShowItem = 3;

var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();
searchInput.onkeyup = function(){
	if(this.value.length > minWordLength){
		var term = this.value;
		delay(function(){
	     	searchFunction(term); // search
	    }, 200 );
	}
	else resetAutcomplete();
}

/* Reset Search Input */
removeButton.addEventListener('click', function(){
	resetAutcomplete();
	searchInput.value = "";
});

/* Search Form */
document.getElementById("searchForm").addEventListener('submit',function(e){
	e.preventDefault();
	searchFunction(searchInput.value);
});

/* Result */
function resultFunction(result) {
	var categoryList = "",
		containsList = "",
		productList = "";
	removeButton.classList.add("active");
	autocomplete.classList.add("active");
	document.querySelector(".search-loader").classList.remove("active");

	if(result.totalResults > 0){
		var resultQuery = result.query,
			item = result.items;

		item.forEach(function(value,index) {
			if(index < maxShowItem){
				var image = "<img src='"+value.thumbnailImage+"' alt='Product Name'>",
					name = "<span class='name'>"+value.name+"</span>"

				categoryList += "<li><a href='#' title=''>"+value.categoryPath+"</a></li>";
				containsList += "<li><a href='#' title=''>"+value.offerType+"</a></li>";
				productList += "<li><a href='"+value.productUrl+"'>"+image+" "+name+"</a></li>";
			}
		});

		document.querySelector(".search-word").textContent = resultQuery;
		document.querySelector(".result-text em").textContent = resultQuery;
		document.querySelector(".category-link-list").innerHTML = categoryList;
		document.querySelector(".contains-list").innerHTML = containsList;
		document.querySelector(".autocomplete-product-list .product-list").innerHTML = productList;

		/* Reset */
		document.querySelector(".autocomplete-container").classList.remove("hidden");
		document.querySelector(".message").classList.add("hidden");

	}else {
		/* Reset */
		document.querySelector(".autocomplete-container").classList.add("hidden");
		document.querySelector(".message").classList.remove("hidden");
	}
}

/* Request Function for CORS */
function searchFunction(term) {
	document.querySelector(".search-loader").classList.add("active");
	removeButton.classList.remove("active");
    var s = document.createElement("script");
    s.src = "http://api.walmartlabs.com/v1/search?query="+term+"&format=json&apiKey=9qphwp7ghaka94guhvvxgxy3&callback=resultFunction";
    document.body.appendChild(s);
}

/* Reset Autcomplete Info */
function resetAutcomplete(){
	removeButton.classList.remove("active");
	autocomplete.classList.remove("active");
}
