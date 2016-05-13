var emp_length_steps = [
[ "n/a" ],
[ "< 1 year" ],
[ "1 year", "2 years", "3 years" ],
[ "4 years", "5 years", "6 years", "7 years" ],
[ "8 years", "9 years", "10+ years" ]
];

var annual_inc_step_size = 20000;
var annual_inc_start = 0;
var annual_inc_end = 200000;


var verification_status_steps = 
{
    "0" : "not verified",
    "1" : "VERIFIED - income",
    "2" : "VERIFIED - income source"
};

var purpose_steps = 
{
	"0" : "debt_consolidation",
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
	"12" : "wedding"
};

var home_ownership_steps = 
{
	"0" : "RENT",
	"1" : "MORTGAGE",
	"2" : "OWN",
	"3" : "NONE",
    //"4" : "OTHER",
    //"5" : "ANY"
};


for( var emp_length_key in emp_length_steps )
{
	for( var verification_status_key in verification_status_steps )
	{
		for( var purpose_key in purpose_steps )
		{
			for( var home_ownership_key in home_ownership_steps )
			{
				for( var income_min = annual_inc_start; income_min <= annual_inc_end; income_min += annual_inc_step_size )
				{
					var emp_length_value = emp_length_steps[ emp_length_key ];
					var verification_status_value = verification_status_steps[ verification_status_key ];
					var purpose_value = purpose_steps[ purpose_key ];
					var home_ownership_value = home_ownership_steps[ home_ownership_key ];
					var income_max = income_min + annual_inc_step_size;

					var numerator = db.loans.count({
						emp_length: {
							$in: emp_length_value
						},
						verification_status: verification_status_value,
						purpose: purpose_value,
						home_ownership: home_ownership_value,
						annual_inc: {
							$gt: income_min,
							$lt:income_max
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
							$in: ['A', 'B', 'C', 'D', 'E']
						}
					}); 
					var denominator = db.loans.count({
						emp_length: {
							$in: emp_length_value
						},
						verification_status: verification_status_value,
						purpose: purpose_value,
						home_ownership: home_ownership_value,
						annual_inc: {
							$gt: income_min,
							$lt:income_max
						},
						loan_status: {
							$in: ['Default', 'Charged Off']
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
							$in: ['A', 'B', 'C', 'D', 'E']
						}
					});

					var ratio = numerator / denominator;

					db.person_analysis.save({
						emp_length: emp_length_value.toString(),
						verification_status: verification_status_value,
						purpose: purpose_value,
						home_ownership: home_ownership_value,
						annual_inc_min: income_min,
						"numerator": numerator,
						"denominator": denominator,
						"ratio": ratio
					});
				}
			}
		}
	}
}

