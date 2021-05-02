/*! Project: Visha_Aarogyam. Created by: ganeshkondalkar@gmail.com. Version: 1.0.0.
This project is valid for the duration: March 01st, 2016 - Feb 28th, 2022. */
(function($, window, undefined) {

	// To compile the JS templates
	// Handlebars -m templates/> js/templates/templates.js

	var SiteRenewal = {
		// Feb 28th, 2022 - is the date to renew.
		expiryDate: new Date(2022, 1, 28),
		isRenewalRequired: function(){
			return SiteRenewal.expiryDate < new Date() ? true : false;
		}
	};
	
	// All Cached DOM Selectors
	var DOM = {
		$body: $("body"),
		$window: $(window),
		$navLis: $("#menubar").find("li"),
		$activeTab: null,
		$heroBanner: $("#heroBanner"),
		$offeringSlides: $("#offeringSlides"),
		$mainContent: $("#mainContent"),
		$gMapBox: document.getElementById("gMapBox"),
		$allContainers: null,
		$homeContainer: null,
		$aboutUsContainer: null,
		$therapyContainer: null,
		$offeringContainer: null,
		$contactUsContainer: null,
		RegExpr: {
			name: new RegExp(/^[\w\s*]{3,25}$/),
			email: new RegExp(/^\S+@\S+\.\S+/),
			mobile: new RegExp(/^\d{7,10}$/),
			subject: new RegExp(/^[\w\s0-9_\.]{3,150}$/)
		},
		apiKey: "AIzaSyCA-avgeDiogYXIH55nZRVQl0PnbkwMWn8"
	};

	// site utilities functions
	var site = {
		initGMaps: function(){
			site.initGenericGoogleMaps();
		},
		initGenericGoogleMaps: function(){
			console.log("Google Maps initialized!");
			var map,
				bounds = new google.maps.LatLngBounds(),
				mapOptions = { mapTypeId: "roadmap" },
				mapContainer = DOM.$gMapBox;

			// display map on page
			map = new google.maps.Map( mapContainer, mapOptions );

			// set height of the container
			mapContainer.style.height = "500px";

			// multiple markers
			var markers = [
				['Vishwa Arogyam', 19.0556666,72.8332373]
			];

			// info window content
			var infoWindowContent = [
		        ['<div class="info_content">' +
		        '<h3>Vishwa Arogyam,</h3>' +
		        '<p>Kairali Ayurveda Panchakarma Clinic</p>' + '</div>']
		    ];

		    // Display multiple markers on a map
		    var infoWindow = new google.maps.InfoWindow(),
		    	marker,
		    	i;
		    
		    // Loop through our array of markers & place each one on the map  
		    for( i = 0; i < markers.length; i++ ) {
		        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
		        bounds.extend(position);
		        marker = new google.maps.Marker({
		            position: position,
		            map: map,
		            title: markers[i][0]
		        });
        
		        // Allow each marker to have an info window    
		        google.maps.event.addListener(marker, 'click', (function(marker, i) {
		            return function() {
		                infoWindow.setContent(infoWindowContent[i][0]);
		                infoWindow.open(map, marker);
		            }
		        })(marker, i));

		        // Automatically center the map fitting all markers on the screen
		        map.fitBounds(bounds);
		    }

		    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
		    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
		        this.setZoom(14);
		        google.maps.event.removeListener(boundsListener);
		    });
		},

		validateInputField: function(inputElement, inputText, inputRegExp){
			var $enquiryForm = $("#enquiryForm");

			if( inputText === "" || !inputRegExp.test(inputText) ){
				inputElement.next().show();
				$enquiryForm.addClass("invalid");
			} else {
				inputElement.next().hide();
				$enquiryForm.removeClass("invalid");
			}
		},

		initEquiryFormValidation: function(){

			$("#enquiryForm").on("blur", "input", function(e){

				var $this = $(this);

				switch($(this).attr("name")) {
					case "name" :
						site.validateInputField( $this, $this.val(), DOM.RegExpr["name"] );
						break;
					case "email" :
						site.validateInputField( $this, $this.val(), DOM.RegExpr["email"] );
						break;
					case "mobile" :
						site.validateInputField( $this, $this.val(), DOM.RegExpr["mobile"] );
						break;
					case "subject" :
						site.validateInputField( $this, $this.val(), DOM.RegExpr["subject"] );
						break;
				}
			});

			$("#enquiryForm").on("submit", function(e){
				e.preventDefault();
				console.log("Form SUbmit clicked");
				var $this = $(this),
					$nameInput = $this.find("#name"),
					$emailInput = $this.find("#email"),
					$mobileInput = $this.find("#mobile"),
					$subjectInput = $this.find("#subject");

				site.validateInputField( $nameInput, $nameInput.val(), DOM.RegExpr["name"] );
				site.validateInputField( $emailInput, $emailInput.val(), DOM.RegExpr["email"] );
				site.validateInputField( $mobileInput, $mobileInput.val(), DOM.RegExpr["mobile"] );
				site.validateInputField( $subjectInput, $subjectInput.val(), DOM.RegExpr["subject"] );

				if( $this.hasClass("invalid") ){
					return;
				} else {
					var enquiryFormData = $this.serialize();
					console.log(enquiryFormData);
					// to load the data throught PHP file from server based on the query parameters using POST method
					$.post("js/send_mail.php", { data: enquiryFormData }, function(responseHTML){
						DOM.$contactUsContainer.find(".form-response").html(responseHTML).fadeIn("fast");
					});
				}
			});
		},

		heroImages: ["img/about-us/hero-banner.jpg", "img/therapy/hero-banner.jpg", "img/offerings/hero-banner.jpg", "img/contact-us/hero-banner.jpg"],

		offeringsImages: ["img/offerings/offer-05.jpg", "img/offerings/offer-03.jpg", "img/offerings/offer-04.jpg"],

		initOfferings: function(){
			DOM.$offeringSlides.responsiveSlides({
				timeout: 4000,
				speed: 1300,
				pause: 1
			});
		},

		onOfferingsImgLoad: function(event){
			var imgObj = (event.target) ? event.target : event.path[0];
			setTimeout(function(){

				var template = "<div class='item'><img src='" + imgObj.src + "' alt='" + imgObj.alt + "'></div>";

				DOM.$offeringSlides.append(template);

				if(imgObj.alt == site.offeringsImages[site.offeringsImages.length-1]){
					site.initOfferings();
				}
			}, 0);
		},
		
		loadOfferingsImage: function(imgSrc){
			var img = new Image();
			img.onload = site.onOfferingsImgLoad;
			img.src = imgSrc;
			img.alt = imgSrc;
		},

		loadAllOfferingsImages: function(imgArr){
			$.each(imgArr, function(imgIndex, imgSrc){
				site.loadOfferingsImage(imgSrc);
			});
		},

		initHeroBanner: function(){
			DOM.$heroBanner.responsiveSlides({
				timeout: 3000,
				speed: 1000
			});
		},

		onHeroImgLoad: function(event){
			var imgObj = (event.target) ? event.target : event.path[0];
			setTimeout(function(){

				var template = "<div class='item'><img src='" + imgObj.src + "' alt='" + imgObj.alt + "'></div>";

				DOM.$heroBanner.append(template);

				if(imgObj.alt == site.heroImages[site.heroImages.length-1]){
					site.initHeroBanner();
				}
			}, 0);
		},
		
		loadHeroImage: function(imgSrc){
			var img = new Image();
			img.onload = site.onHeroImgLoad;
			img.src = imgSrc;
			img.alt = imgSrc;
		},

		loadAllHeroImages: function(imgArr){
			$.each(imgArr, function(imgIndex, imgSrc){
				site.loadHeroImage(imgSrc);
			});
		},

		showPageContent: function($elem){
			DOM.$allContainers.fadeOut("slow");
			$elem.fadeIn("slow");
		},

		whenHashCallback: function($elem, tmpl, imgSrc){
				// if($elem.children().length){
					site.showPageContent($elem);
				// }
		},

		// Do Something Specific for Page Specific
		whenHashIs: {
			"home": function(){
				DOM.$homeContainer = DOM.$mainContent.find(".home-container");
				DOM.$allContainers = DOM.$mainContent.find(".container");
				console.log("Home Page Loaded.");
				var tmpl = "";
				// var heroBannerSrc = "img/home/hero-banner.jpg";
				site.whenHashCallback(DOM.$homeContainer, tmpl);
			},
			"about-us": function(){
				console.log("About Page Loaded.");
				DOM.$aboutUsContainer = DOM.$mainContent.find(".about-us-container");
				var tmpl = "About Us";
				// var heroBannerSrc = "img/about-us/hero-banner.jpg";
				site.whenHashCallback(DOM.$aboutUsContainer, tmpl);
			},
			"therapy": function(){
				console.log("Therapy Loaded.");
				DOM.$therapyContainer = DOM.$mainContent.find(".therapy-container");
				var tmpl = "Therapy";
				// var heroBannerSrc = "img/therapy/hero-banner.jpg";
				site.whenHashCallback(DOM.$therapyContainer, tmpl);
			},
			"offerings": function(){
				console.log("Offerings Loaded.");
				DOM.$offeringsContainer = DOM.$mainContent.find(".offerings-container");
				var tmpl = "offerings";
				// var heroBannerSrc = "img/offerings/hero-banner.jpg";
				site.whenHashCallback(DOM.$offeringsContainer, tmpl);
			},
			"contact-us": function(){
				console.log("Contact Us Page Loaded.");
				DOM.$contactUsContainer = DOM.$mainContent.find(".contact-us-container");
				var tmpl = "contact-us";
				// var heroBannerSrc = "img/contact-us/hero-banner.jpg";
				site.whenHashCallback(DOM.$contactUsContainer, tmpl);
				site.initEquiryFormValidation();
			}
		},

		setClassToBodyTag: function(hash){
			DOM.$body.removeClass().addClass(hash);
			site.whenHashIs[hash]();
		},

		setActiveTab: function(hash){
			console.log("setActiveTab");
			(DOM.$activeTab) ? DOM.$activeTab.removeClass("active") : DOM.$navLis.removeClass("active");
			DOM.$activeTab = $( DOM.$navLis.children("[href='" + hash + "']").parent("li")[0] ).addClass("active");
			
			try {
				site.setClassToBodyTag(hash.replace("#", ""));
			} catch(err) {
				console.info("No Such Page Exists!");
				// If such page does not exist then redirect to the homepage.
				location.hash = "#home";
			}
		},

		onHashChangeHandler: function(e){
			console.log("onHashChangeHandler");
			site.setActiveTab(location.hash);
		},

		initEventListeners: function(){
			console.log("initEventListeners");

			// init menubar toggle
			$(".menubar").dropdown();

			// set Default hash for Homepage, if there is no hash available.
			(location.hash === "") ? site.setActiveTab("#home") : site.setActiveTab(location.hash);
			
			DOM.$window.on("hashchange", site.onHashChangeHandler);

			DOM.$window.on("load", function(){
				site.loadAllHeroImages(site.heroImages);
				site.loadAllOfferingsImages(site.offeringsImages);
			});
		},

		// NOTE: This is much better approach than adding script tag in the HTML Page.
		loadGoogleMapScript: function(){
			window.initGMaps = site.initGMaps;

			var keyParam = "key=" + DOM.apiKey,
				callbackParam = "&callback=initGMaps",
				url = "//maps.googleapis.com/maps/api/js?" + keyParam + callbackParam,
				scriptTag = "<script async defer type=\"text/javascript\" src=\"" + url + "\"></script>";
			
			DOM.$body.append(scriptTag);
		},

		init: function(){
			site.initEventListeners();
			site.loadGoogleMapScript();
		}
	};

	// initialize Application
	$(function () {
		if( SiteRenewal.isRenewalRequired() ){
			DOM.$body.addClass("site-renewal").html("");
			console.warn("Hosting renewal is required!\nYour Website Hosting plan was only for the period of March-27-2019 to March-26-2022.\nPlease contact \"ganeshkondalkar@gmail.com\" - your host provider for re-activation!");
		} else {
			site.init();
		}
	});

})(jQuery, window, undefined);