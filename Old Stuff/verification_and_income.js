/*
verification status

baseline: 9.57%
verified - source: 9.58%
verified - income: 9.9%
not verified: 9.0%

verified - income + 30k = 12.4%
verified - income + 40k = 12.4%
verified - income + 50k = 10.9%
verified - income + 60k = 9.57%
verified - income + 70k = 9.1%
+verified - income + 80k = 8.3%
+verified - income + 90k = 7.62%
++verified - income + 100k = 6.3% (11578)

verified - source + 30k = 
verified - source + 40k = 
verified - source + 50k = 9.2%
verified - source + 60k = 8.7%
+verified - source + 70k = 7.12% (2556)
+verified - source + 80k = 7.68
verified - source + 90k = 8.06%
+verified - source + 100k = 7.48%(6000)

*/
db.getCollection('loans').count({ 
        verification_status: {
        $in: [ 
               // "VERIFIED - income", 
               // "not verified", 
               "VERIFIED - income source" 
            ]
        },
        annual_inc: {
            $gt: 70000,
            $lt: 80000
        },
	loan_status: {
            $in: ['Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
})



db.getCollection('loans').count({ 
        verification_status: {
            $in: [ 
                   // "VERIFIED - income", 
                   // "not verified", 
                    "VERIFIED - income source" 
            ]
        },
        annual_inc: {
            $gt: 70000,
            $lt: 80000
        },
	loan_status: {
            $in: ['Current', 'Fully Paid', 'Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
})