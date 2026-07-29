import gspread
from oauth2client.service_account import ServiceAccountCredentials
from airtable import Airtable
import pandas as pd

# 1. Google Sheets සම්බන්ධ කිරීම
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("google_creds.json", scope) # ඔයාගේ Google API Key එක
client = gspread.authorize(creds)

# Sheet එක Open කිරීම (ඔයාගේ Sheet එකේ නම හෝ URL එක දෙන්න)
sheet = client.open_by_url("https://docs.google.com/spreadsheets/d/1y7p425-eOizrdIQwo33M1KlZYCd_R--D/edit").sheet1
data = sheet.get_all_records()

# දත්ත Dataframe එකකට ගැනීම
df = pd.DataFrame(data)

# 2. Airtable Cloud එකට සම්බන්ධ කිරීම
BASE_ID = "YOUR_AIRTABLE_BASE_ID"
API_KEY = "YOUR_AIRTABLE_API_KEY"
TABLE_NAME = "Monthly_Budget"

airtable = Airtable(BASE_ID, TABLE_NAME, api_key=API_KEY)

# 3. දත්ත පිරිසිදු කර Cloud එකට යැවීම
for index, row in df.iterrows():
    # Totals සහ හිස් පේළි අත්හැරීම (Filter out blank/summary rows)
    if not row['Day'] or row['Day'] == 'Day':
        continue
        
    # Cloud එකට යන Data Structure එක
    record = {
        "Date": str(row['Day']),
        "Daily Budget": float(row['Daily Budget']) if row['Daily Budget'] else 0,
        "Total Leads": int(row['Total Leads']) if row['Total Leads'] else 0,
        "Confirmed Leads": int(row['Confirmed Leads']) if row['Confirmed Leads'] else 0,
        "Cost per Lead": float(row['Cost per Lead']) if row['Cost per Lead'] else 0
    }
    
    # Airtable Cloud Database එකට ඇතුළත් කිරීම
    airtable.insert(record)

print("System Update Successful! ඔක්කොම දත්ත ටික Cloud එකට වැටුණා මචං.")
