/*
purpose = vacation
loan_amnt = 1k steps = 0-50k
annual_inc = 5k steps = 5k - 150k
*/


var result = [];


for( var min_loan_amnt = 0; min_loan_amnt <= 50000; min_loan_amnt += 1000 )
{
    var max_loan_amnt = min_loan_amnt + 1000; // 1k steps


    for( var min_annual_inc = 5000; min_annual_inc <= 150000; min_annual_inc += 5000 )
    {
        var max_annual_inc = min_annual_inc+5000; // 5k steps



        var numerator = db.getCollection('loans').count({
            purpose: "vacation",
            loan_amnt: {
                $gt: min_loan_amnt,
                $lt: max_loan_amnt,
            },
            annual_inc: {
                $gt: min_annual_inc,
                $lt:max_annual_inc
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
            purpose: "vacation",
            loan_amnt: {
                $gt: min_loan_amnt,
                $lt: max_loan_amnt,
            },
            annual_inc: {
                $gt: min_annual_inc,
                $lt:max_annual_inc
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
            'max_loan_amnt': max_loan_amnt,
            'min_annual_inc': min_annual_inc,
            'max_annual_inc': max_annual_inc,
            '% default or charge off': (numerator / denominator * 100),
            'Totals': numerator + '/' + denominator  

        });

    }
}





print( result );