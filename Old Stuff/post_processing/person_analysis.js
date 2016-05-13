var earliest_issue_d = '4/1/2014';


db.loans.mapReduce(
		function() {
				// Map function
				function roundDown(value, roundFactor) {
						return Math.floor(value / roundFactor) * roundFactor;
				}
				var key = {
						emp_length: this.emp_length,
						verification_status: this.verification_status,
						purpose: this.purpose,
						annual_inc: roundDown(this.annual_inc, 20000),
						home_ownership: this.home_ownership,
						fico_range_low: roundDown(this.fico_range_low, 50),
						total_acc: roundDown(this.total_acc, 10),
						revol_util: roundDown(this.revol_util, 10),
						loan_amnt: roundDown(this.loan_amnt, 3000)

				};

				var bad = 0;
				if (this.loan_status == "Default" || this.loan_status == "Charged Off") {
						bad = 1;
				}

				emit(key, {
						count_bad: bad,
						count_total: 1
				});
		},
		function(key, array_values) {
				// Reduce function
				reducedVal = {
						count_bad: 0,
						count_total: 0
				};

				for (var idx = 0; idx < array_values.length; idx++) {
						reducedVal.count_bad += array_values[idx].count_bad;
						reducedVal.count_total += array_values[idx].count_total;
				}

				return reducedVal;

		}, {
				query: {
						loan_status: {
								$in: ['Default', 'Charged Off', 'Fully Paid', 'Current']
						},
						issue_d: {
								$lt: new Date(earliest_issue_d)
						}
				},
				out: "person_analysis",
				finalize: function(key, reducedValue) {
						return {
								bad: reducedValue.count_bad,
								total: reducedValue.count_total,
								ratio: reducedValue.count_bad / reducedValue.count_total
						};
				}

		}

)