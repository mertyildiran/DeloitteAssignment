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
		var categories = [];
		result.items.forEach( function(item, index) {
			var category = {};
			category.id = item.categoryNode.split('_').slice(-1)[0];
			category.name = item.categoryPath.split('/').slice(-1)[0];
			categories.push(category);

			if ( index < maxShowItem ) {
				var image = "<img src='" + item.thumbnailImage + "' alt='Product Name'>";
				var	name = "<span class='name'>" + item.name + "</span>";

				containsList += "<li><a href='#' title=''>" + item.offerType + "</a></li>";
				productList += "<li><a href='" + item.productUrl + "'>" + image + " " + name + "</a></li>";
			}
		});
		categories = removeDuplicates(categories, 'name');
		categories.forEach( function(category, index) {
			if ( index < (maxShowItem + 2) ) {
				categoryList += "<li><a href='https://www.walmart.com/cp/" + category.id + "' title=''>" + category.name + "</a></li>";
			}
		});

		document.querySelector(".search-word").textContent = result.query;
		document.querySelector(".result-text em").textContent = result.query;
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
	removeElementsByClass("wallmart-api")
  var walmartInject = document.createElement("script");
	walmartInject.classList.add("wallmart-api");
  walmartInject.src = "http://api.walmartlabs.com/v1/search?query="+term+"&format=json&apiKey=9qphwp7ghaka94guhvvxgxy3&callback=resultFunction&facet=on";
  document.body.appendChild(walmartInject);
}

/* Reset Autcomplete Info */
function resetAutcomplete(){
	removeButton.classList.remove("active");
	autocomplete.classList.remove("active");
}

function removeElementsByClass(className){
  var elements = document.getElementsByClassName(className);
  while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
