var types = {
    "base" : ".*",
    "0": "debt_consolidation",
    "1" : "home_improvement",
    "2" : "other",
    "3" : "credit_card", 
    "4" : "small_business",
    "5" : "major_purchase", 
    "6" : "house",  
    "7" : "moving", 
    "8" : "medical", 
    "9" : "car", 
    "10" : "vacation",
    "11" : "renewable_energy", 
    "12" : "wedding", 
};

var result = [];
for (var key in types) {
    var purpose = types[key];
    purpose = new RegExp(purpose);
    var numerator = db.getCollection('loans').count({
        purpose: purpose,
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
        purpose: purpose,
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
        'key': key,
        'purpose': types[key],
        'Percent that default or charge off': (numerator / denominator * 100),
        'Totals': numerator + '/' + denominator  
    });
}
print( result );