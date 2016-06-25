import pandas as pd
import requests
import argparse
import datetime
from pprint import pprint

parser = argparse.ArgumentParser()
parser.add_argument('InvestorID')
parser.add_argument('APIKey')
args = parser.parse_args()

print('--------------------------------------')
print(str(datetime.datetime.now()))

pd.set_option('display.max_columns', None)

# Get notes for sale
notes_for_sale = pd.read_csv( 'https://resources.lendingclub.com/SecondaryMarketAllNotes.csv')
notes_for_sale.columns = ['LoanId', 'NoteId', 'OrderId', 'OutstandingPrincipal',
       'AccruedInterest', 'Status', 'AskPrice', 'Markup', 'YTM',
       'DaysSinceLastPayment', 'CreditScoreTrend', 'FICO',
       'DateListed', 'NeverLate', 'LoanClass', 'LoanMaturity',
       'OriginalNoteAmount', 'InterestRate', 'RemainingPayments',
       'PrincipalPlusInterest', 'ApplicationType']

notes_for_sale = notes_for_sale[notes_for_sale.AskPrice > 1]
notes_for_sale.DaysSinceLastPayment =  notes_for_sale.DaysSinceLastPayment.convert_objects(convert_numeric=True)
notes_for_sale.DateListed = pd.to_datetime(notes_for_sale.DateListed, errors="coerce", format="%m/%d/%Y")
notes_for_sale.YTM =  notes_for_sale.YTM.convert_objects(convert_numeric=True)

print( 'Notes for sale:', len(notes_for_sale) )

# Find notes to buy
buy_query = 'Status == "Current" & YTM > 3 & CreditScoreTrend == "UP" & NeverLate == True & RemainingPayments < 7 & AskPrice < 25 & DaysSinceLastPayment < 31'
notes_to_buy = notes_for_sale.query( buy_query )
print( 'Notes matching filters:', len(notes_to_buy) )

notes_to_buy = notes_to_buy.sort('FICO', ascending=False).head(5)

# Get list of notes owned
r = requests.get('https://api.lendingclub.com/api/investor/v1/accounts/' + args.InvestorID + '/detailednotes', headers={'Authorization': args.APIKey, 'Accept':'application/json'}) 
my_notes = pd.DataFrame( r.json().get('myNotes') )
my_notes.set_index( 'loanId', inplace=True )
print( 'Got my notes: ', len(my_notes))


# Generate buy request for loans I haven't already invested in
buy_request = { "aid": args.InvestorID, "notes": [] }
for idx, rowData in notes_to_buy.iterrows():
    LoanId = rowData['LoanId']
    if LoanId not in my_notes.index:
        buy_request["notes"].append({"loanId": LoanId, "orderId": rowData['OrderId'], "noteId":rowData['NoteId'], "bidPrice": rowData['AskPrice']} )
        
								

# Get amount of cash available
r = requests.get('https://api.lendingclub.com/api/investor/v1/accounts/' + args.InvestorID + '/availablecash', headers={'Authorization': args.APIKey, 'Accept':'application/json'}) 
available_cash = r.json()['availableCash']

print( 'Number of notes to buy', len(notes_to_buy) )
print( 'Cash in account:', available_cash )
print( 'Sum of notes to buy', notes_to_buy.AskPrice.sum() )

if available_cash > notes_to_buy.AskPrice.sum():
	# Submit the buy request
	r = requests.post('https://api.lendingclub.com/api/investor/v1/accounts/' + args.InvestorID + '/trades/buy', headers={'Authorization': args.APIKey, 'Content-Type':'application/json'}, json=buy_request) 
	pprint(r.json())
