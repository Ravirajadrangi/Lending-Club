/* 
Fix dates 
*/
db.loans.find({    
	issue_d: {
		$type: 2
	}
}).forEach( function( elem ) {
	var newDate = elem.issue_d.replace( '-', ' 1 ' );
	elem.issue_d = new Date( newDate );
	db.loans.save( elem );
});

db.loans.find({    
	earliest_cr_line: {
		$type: 2
	}
}).forEach( function( elem ) {
	var newDate = elem.earliest_cr_line.replace( '-', ' 1 ' );

	elem.earliest_cr_line = new Date( newDate );

	db.loans.save( elem );
});

db.loans.find({    
	last_pymnt_d: {
		$type: 2
	}
}).forEach( function( elem ) {
	var newDate = elem.last_pymnt_d.replace( '-', ' 1 ' );

	elem.last_pymnt_d = new Date( newDate );

	db.loans.save( elem );
});

db.loans.find({    
	last_credit_pull_d: {
		$type: 2
	}
}).forEach( function( elem ) {
	var newDate = elem.last_credit_pull_d.replace( '-', ' 1 ' );

	elem.last_credit_pull_d = new Date( newDate );

	db.loans.save( elem );
});

/*
Parse percentages as floats
*/
db.loans.find({    
	int_rate: /%/
}).forEach( function( elem ) {
	elem.int_rate = parseFloat( elem.int_rate.replace( '%', '' ) );
	db.loans.save( elem );

});
db.loans.find({    
	revol_util: /%/
}).forEach( function( elem ) {
	elem.revol_util = parseFloat( elem.revol_util.replace( '%', '' ) );
	db.loans.save( elem );

});

/*
Remove url field
*/
db.loans.update( 
	{}, 
	{
		$unset: {url: "", policy_code: "", funded_amnt:"", funded_amnt_inv:"" }
	},
	{
		multi: true
	}
	);

