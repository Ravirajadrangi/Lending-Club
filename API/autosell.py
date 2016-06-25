import requests
import pandas as pd
import argparse
import datetime 
from pprint import pprint

parser = argparse.ArgumentParser()
parser.add_argument('InvestorID')
parser.add_argument('APIKey')
args = parser.parse_args()


print('--------------------------------------')
print(str(datetime.datetime.now()))

# # Get all my current notes

r = requests.get('https://api.lendingclub.com/api/investor/v1/accounts/' + args.InvestorID + '/detailednotes', headers={'Authorization': args.APIKey, 'Accept':'application/json'}) 
my_notes = pd.DataFrame( r.json().get('myNotes') )
my_notes.set_index( 'loanId', inplace=True )

print( 'Got', len(my_notes), 'notes')


# # Collect any bad notes

bad_notes = my_notes.query('(currentPaymentStatus == "Overdue" | currentPaymentStatus == "Not Received") & canBeTraded == True')
print( 'There are', len(bad_notes), 'notes that are late' )


# ### Set some discounted price

notes_to_sell = []
for loanId,rowData in bad_notes.iterrows():
    remainingValue = round( rowData['principalPending'] + rowData['accruedInterest'], 2 )
    
    if rowData['loanStatus'].find('Grace') > 0:
        askPrice = remainingValue *.8
    elif rowData['loanStatus'].find('120') > 0:
        askPrice = remainingValue * .3
    else:
        askPrice = remainingValue * .6
       
    askPrice = round( askPrice, 2 )
    print( 'Status:', rowData['loanStatus'], 'Remaining:', remainingValue, 'Ask Price:', askPrice)
    
    notes_to_sell.append({'loanId':int(loanId), "orderId": rowData['orderId'], "noteId": rowData['noteId'], "askingPrice": askPrice})



expire_date = datetime.datetime.now() + datetime.timedelta(days=7)
sell_request = {"aid": args.InvestorID, "expireDate": expire_date.strftime('%m/%d/%Y'), "notes":notes_to_sell}



# ### Submit sell request
r = requests.post('https://api.lendingclub.com/api/investor/v1/accounts/' + args.InvestorID + '/trades/sell', headers={'Authorization': args.APIKey, 'Accept':'application/json'}, json=sell_request) 
pprint(r.json())