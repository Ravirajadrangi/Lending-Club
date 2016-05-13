/*
Employee title

software:
law: 

capital letter:  
lowercase letter: 

medical:

+super: 
+sales: 
+director: 
+engineer: 
+special: 
++manage : 
++ist$: 
*/
db.getCollection('loans').count({ 
        emp_title: /medical/i,
	loan_status: {
            $in: ['Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
})



db.getCollection('loans').count({ 
        emp_title: /medical/i,
	loan_status: {
            $in: ['Current', 'Fully Paid', 'Default', 'Charged Off']
        },
        grade: {
            $in: ['B', 'C', 'D', 'E']
        }
})

