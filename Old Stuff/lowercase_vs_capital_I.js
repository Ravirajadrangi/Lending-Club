/*

Need to redo this because of "borrower added"

*/

db.getCollection('loans').count({ 
        desc: /^\s*i /,
	loan_status: {
            $in: ['Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
})

/

db.getCollection('loans').count({ 
        desc: /^\s*i /i,
	loan_status: {
            $in: ['Current', 'Fully Paid', 'Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
}) * 100




db.getCollection('loans').count({ 
        desc: /^\s*I /,
	loan_status: {
            $in: ['Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
})

/

db.getCollection('loans').count({ 
        desc: /^\s*i /i,
	loan_status: {
            $in: ['Current', 'Fully Paid', 'Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
}) * 100