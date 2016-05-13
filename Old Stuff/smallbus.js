/*
purpose = small_business
loan_amnt = 1k steps = 0-50k
*/
var result = [];

for( var min_loan_amnt = 0; min_loan_amnt <= 50000; min_loan_amnt += 1000 )
{
    var max_loan_amnt = min_loan_amnt + 1000; // 1k steps

    var numerator = db.getCollection('loans').count({
        purpose: "small_business",
        loan_amnt: {
            $gt: min_loan_amnt,
            $lt: max_loan_amnt,
        },
        loan_status: {
            $in: ['Default', 'Charged Off']
        },
        issue_d: {
            $not: {
                $in: ['Dec-2014', 'Nov-2014', 'Oct-2014', 'Sep-2014', 'Aug-2014', 'Jul-2014', 'Jun-2014', 'May-2014']
            }
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
    }); 

    var denominator = db.getCollection('loans').count({
        purpose: "small_business",
        loan_amnt: {
            $gt: min_loan_amnt,
            $lt: max_loan_amnt,
        },
        loan_status: {
            $in: ['Current', 'Fully Paid', 'Default', 'Charged Off']
        },
        issue_d: {
            $not: {
                $in: ['Dec-2014', 'Nov-2014', 'Oct-2014', 'Sep-2014', 'Aug-2014', 'Jul-2014', 'Jun-2014', 'May-2014']
            }
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
    }); 


    result.push({
        'min_loan_amnt': min_loan_amnt,
        '% default or charge off': (numerator / denominator * 100),
        'Totals': numerator + '/' + denominator  

    });

}


print( result );