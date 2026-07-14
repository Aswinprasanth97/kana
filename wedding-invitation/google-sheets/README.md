# RSVP → Google Sheets

Collect every RSVP in a shared Google Sheet. Guests submit from the website;
you (and anyone you share the sheet with) see responses in real time.

---

## 1. Create the spreadsheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **Arjun & Sandra — RSVPs**.
3. Leave the first tab as **Sheet1** (or rename it — the script uses the active sheet).

The script adds column headers automatically on the first submission.

---

## 2. Add the Apps Script

1. In the spreadsheet: **Extensions → Apps Script**.
2. Delete any placeholder code in `Code.gs`.
3. Copy the contents of `google-sheets/Code.gs` from this project and paste it in.
4. **Save** (Ctrl+S). Name the project e.g. `RSVP Webhook`.

---

## 3. Deploy as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon → choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Authorize when prompted (Google will warn that the app isn’t verified — that’s normal for personal scripts; click **Advanced → Go to …**).
6. Copy the **Web app URL**. It must end with `/exec`, not `/dev`.

---

## 4. Connect the website

Open `js/script.js` and paste your URL:

```javascript
var RSVP_SHEETS_URL = 'https://script.google.com/macros/s/AKfycb…/exec';
```

Redeploy the site. Test by submitting an RSVP — a new row should appear in the sheet within a few seconds.

---

## 5. Share the sheet with family

In Google Sheets: **Share** → add email addresses (Editor or Viewer).

Everyone with access can see the guest list, filter by attending yes/no, and export CSV.

---

## Column reference

| Column | Field |
| --- | --- |
| Timestamp | When the guest submitted |
| Attending | `yes` or `no` |
| Name | Full name |
| Mobile | Phone (attending only) |
| Email | Optional email |
| Adults | Guest count |
| Children | Guest count |
| Message / Wishes | Blessing or best wishes |

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Row doesn’t appear | Confirm **Who has access** is **Anyone**, not “Only myself”. |
| “Something went wrong” on the site | Redeploy the script after code changes; use the new `/exec` URL. |
| Duplicate rows after editing | “Edit my response” clears the browser copy but doesn’t delete the old sheet row — filter or ignore duplicates manually. |
| Works locally but not on HTTPS host | The site must be served over **https://** (GitHub Pages, Netlify, etc.). |

---

## Local testing without Sheets

Leave `RSVP_SHEETS_URL` as an empty string. RSVPs save to the browser only (useful while building the page).
