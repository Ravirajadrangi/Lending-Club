var casper = require('casper').create({
	clientScripts: [
		//'includes/jquery.js'
	],
    pageSettings: {
        loadImages: true,//The script is much faster when this field is set to false
        loadPlugins: true,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    },
    viewportSize: {
    	width: 1920,
    	height: 1080
    }
});
var x = require("casper").selectXPath;

casper.start().thenOpen("https://www.lendingclub.com/account/gotoLogin.action", function() {
    console.log("Login page opened");
    //this.capture('login.png');
});

casper.waitForSelector( '#email', function() { 
	console.log ("Found email field, filling in values");

	casper.sendKeys( '#email', '' );
	casper.sendKeys( '#password', '' );
	casper.click( '#master_accountSubmit' );
});

casper.waitForText( "Trading Account", function() {
	console.log( "In account page!" );
    casper.capture('LC account page.png');
} );


casper.thenClick( ".leavingForFolioFnWarning" );


casper.waitForText( "Lending Club Account", function() {
    console.log( "In Folio Account" );
    casper.capture('folio account.png');
});

casper.thenOpen("https://www.lendingclub.com/foliofn/tradingInventory.action", function() {
    console.log("In browse tradeable notes");
    
});

casper.wait( 1000, function() {
    this.capture('browse notes.png');
    console.log( "In browse notes" );
} );

casper.thenClick( '#open-slide-toggle' );


casper.wait( 1000, function() {
    console.log( "Filling in filters" );
    casper.fillSelectors( 'form#search-form', {
        '#askp_min' : '4',
        '#askp_max': '28',
        '#ytm_min': '3',
        '#to_remp': '14'
        }
    );

    casper.click( '#exclude_invested_loans' );
});

casper.then( function() {
    this.capture( 'filled filters.png' );
});

casper.thenClick( "#filter-body input[value=Apply]" );

casper.wait( 2000, function() {
    this.capture( 'filtered results.png' );
    console.log( "Downloading notes" );
    casper.download( casper.getElementInfo( '#notesDownloadSearchResultsLink' )['attributes']['href'], 'browseNotes.csv' );
})

casper.run();