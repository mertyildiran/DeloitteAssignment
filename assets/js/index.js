"use strict";

var toggleButton = document.getElementById('toggleButton'),
selectedContainer = document.querySelector(".category-list"),
removeButton = document.querySelector(".search-bar .remove"),
autocomplete = document.getElementById("automcomplete"),
searchInput = document.getElementById("searchInput");


/* Open The Category Menu */
toggleButton.addEventListener('click', function() {
	toggleButton.classList.toggle('open');
	selectedContainer.classList.toggle('active');
});

var minWordLength = 2,
maxShowItem = 3;

var delay = ( function() {
	var timer = 0;
	return function(callback, ms) {
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

searchInput.onkeyup = function() {
	if ( this.value.length > minWordLength ) {
		var term = this.value;
		delay( function() {
			searchFunction(term); // search
		}, 200 );
	}
	else resetAutocomplete();
}

/* Reset Search Input */
removeButton.addEventListener('click', function() {
	resetAutocomplete();
	searchInput.value = "";
});

/* Search Form */
document.getElementById("searchForm").addEventListener('submit', function(e) {
	e.preventDefault();
	searchFunction(searchInput.value);
});

/* Result */
function resultFunction(result) {
	var categoryList = "",
	brandsList = "",
	productList = "";
	removeButton.classList.add("active");
	autocomplete.classList.add("active");
	document.querySelector(".search-loader").classList.remove("active");

	if ( result.totalResults > 0 ) {
		var preloadedImagesCounter = 0;
		var categories = [];
		result.items.forEach( function(item, index) {
			if ( (item.categoryNode != null) && (item.categoryPath != null) ) {
				var category = {};
				category.id = item.categoryNode.split('_').slice(-1)[0];
				category.name = item.categoryPath.split('/').slice(-1)[0];
				categories.push(category);
			}

			if ( index < maxShowItem ) {
				var image = "<img src='" + item.thumbnailImage + "' alt='Product Name'>";
				var	name = "<span class='name'>" + item.name + "</span>";

				productList += "<li><a href='" + item.productUrl + "'>" + image + " " + name + "</a></li>";
				var img = new Image();
    		img.src = item.thumbnailImage;
				img.onload = function() {
					preloadedImagesCounter += 1;
					if (preloadedImagesCounter >= maxShowItem) {
						document.querySelector(".autocomplete-product-list .product-list").innerHTML = productList;
					}
				}
			}
		});

		categories = removeDuplicates(categories, 'name');
		categories.forEach( function(category, index) {
			if ( index < (maxShowItem + 2) ) {
				categoryList += "<li><a href='https://www.walmart.com/cp/" + category.id + "' title=''>" + category.name + "</a></li>";
			}
		});

		var brands = [];
		result.facets.forEach( function(facet, index) {
			if (facet.name == "brand") {
				brands = facet.facetValues;
			}
		});
		brands = brands.sort(compareFacets).reverse();
		if ( brands === undefined || brands.length == 0 ) {
			document.querySelector(".brands-list").style.visibility = 'hidden';
		} else {
			document.querySelector(".brands-list").style.visibility = 'visible';
		}
		brands.forEach( function(brand, index) {
			if ( index < maxShowItem ) {
				brandsList += "<li class='brand-suggestion'>" + brand.name + "</li>";
			}
		});

		document.querySelector(".search-word").textContent = result.query;
		document.querySelector(".result-text em").textContent = '"' + result.query + '"';
		document.querySelector(".category-link-list").innerHTML = categoryList;
		document.querySelector(".brands-list").innerHTML = brandsList;
		[...document.querySelectorAll('.brand-suggestion')].forEach( function(el) {
			el.addEventListener("click", function(event) {
				var targetElement = event.target || event.srcElement;
				searchInput.value = targetElement.innerHTML;
				searchFunction(searchInput.value);
			});
		});

		/* Reset */
		document.querySelector(".autocomplete-container").classList.remove("hidden");
		document.querySelector(".message").classList.add("hidden");

	} else {
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
function resetAutocomplete(){
	removeButton.classList.remove("active");
	autocomplete.classList.remove("active");
}

function removeElementsByClass(className) {
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

function compareFacets(a,b) {
	if (a.count < b.count)
	return -1;
	if (a.count > b.count)
	return 1;
	return 0;
}
