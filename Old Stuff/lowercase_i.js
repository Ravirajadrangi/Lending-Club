var descriptionsToTry = [
/.*/i ,
// /.\s+[A-Z]/, // Capital letter after a period...actually worse in a lot of cases
// /improve/i,
// /credit/i,
// /smart/i,
// /late/i,
// /history/i
// /soon/i
// 
];



for( var key in descriptionsToTry )

{

    var description = descriptionsToTry[key];    

    var numerator = db.loans.count({ 
        desc: description,
        loan_status: {
            $in: ['Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
    })

    var denominator = db.loans.count({ 
        desc: description,
        loan_status: {
            $in: ['Current', 'Fully Paid', 'Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
    });



print( description + "          " + numerator/denominator + "           " + numerator + " / " + denominator );



}