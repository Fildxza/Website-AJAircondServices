# Lead-tracking spreadsheet: specification

A simple spreadsheet (Google Sheets or Excel) that records every enquiry AJ receives and, as
honestly as possible, where it came from. It is useful to **both** AJ (what is working, what
earns money) and the digital marketing operator (what their activity contributed).

It deliberately replaces a database, CRM or admin dashboard. Nothing in this document requires
code, a tracking script or a paid tool.

## 1. Principles

1. **One row per enquiry.** An enquiry is a customer's first contact about a job, by any channel.
2. **Record facts, not guesses.** If the source is not known, write "Unknown". Do not infer.
3. **Minimum personal data.** The shared sheet holds **no customer names, phone numbers, street
   addresses or message text**. Only a lead ID, a general area (KL / Selangor) and job facts.
   AJ keeps names and numbers in WhatsApp or its own private notes, matched by the lead ID.
4. **The owner owns the data.** The sheet lives in the owner's Google/Microsoft account. The
   operator gets the access they need (see section 7).
5. **Evidence before credit.** A lead is attributed to marketing activity only when there is a stated
   reason (section 5). Unclear leads are never silently credited to anyone.
6. **Revenue is entered only by AJ** and only shared where AJ authorises it.

## 2. Workbook layout

| Sheet             | Purpose                                               | Who edits                                         |
| ----------------- | ----------------------------------------------------- | ------------------------------------------------- |
| `Leads`           | The log: one row per enquiry                          | AJ (operator can add rows for leads they receive) |
| `Lists`           | Dropdown values (section 4)                           | Owner only                                        |
| `Monthly`         | Counts and rates per source (section 6)               | Formulas, read-only                               |
| `Commission view` | Rows eligible for a commission discussion (section 8) | Formula, read-only                                |
| `README`          | Definitions, data rules and the owner decision list   | Owner                                             |

Freeze the header row, turn on filters, and protect the `Lists`, `Monthly` and `Commission view`
sheets so only the owner can edit them.

## 3. `Leads` columns

Header row 1. Data from row 2. The CSV file `lead-tracking-template.csv` has these headers in this order.

| Col | Header                  | Type / validation                   | Filled by       | Notes                                                                                                                                          |
| --- | ----------------------- | ----------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | Lead ID                 | Text, unique, pattern `L-YYYY-NNNN` | Whoever logs it | Never reuse. This is the link back to AJ's private contact notes                                                                               |
| B   | Date received           | Date                                | Logger          | The day the first message or call arrived                                                                                                      |
| C   | Month                   | Formula `=TEXT(B2,"yyyy-mm")`       | Auto            | Used by the monthly sheet                                                                                                                      |
| D   | Source                  | Dropdown (`Lists`)                  | Logger          | Where the customer came from, e.g. Google Business Profile, Facebook, Instagram, TikTok, Website, Referral, Community outreach, Other, Unknown |
| E   | Medium                  | Dropdown                            | Logger          | organic, paid, referral, offline, unknown                                                                                                      |
| F   | Campaign                | Text, lowercase-with-hyphens        | Logger          | The `utm_campaign` name if known, otherwise blank                                                                                              |
| G   | Entry point             | Dropdown                            | Logger          | Website WhatsApp button, Website call, Business Profile call, Direct WhatsApp, Referral message, Other                                         |
| H   | Enquiry type            | Dropdown                            | Logger          | Matches the website's shortcuts: Servicing, Chemical cleaning, Repair/troubleshooting, Area check, Other                                       |
| I   | Unit type               | Dropdown                            | Logger          | Wall Mounted, Ceiling Cassette, Ceiling Exposed, Other/unsure                                                                                  |
| J   | Units                   | Whole number ≥ 1                    | Logger          | Number of units, if stated                                                                                                                     |
| K   | General area            | Dropdown                            | Logger          | **Kuala Lumpur, Selangor, Outside coverage, Not stated.** Nothing more specific                                                                |
| L   | Status                  | Dropdown                            | AJ              | See the status list below                                                                                                                      |
| M   | First response date     | Date                                | AJ              | When AJ first replied                                                                                                                          |
| N   | Hours to first response | Formula (below)                     | Auto            | Blank until M is filled                                                                                                                        |
| O   | Booked date             | Date                                | AJ              | Date a slot was agreed                                                                                                                         |
| P   | Completed date          | Date                                | AJ              | Date the job was finished                                                                                                                      |
| Q   | Quoted (RM)             | Number ≥ 0                          | AJ              | Optional                                                                                                                                       |
| R   | Confirmed revenue (RM)  | Number ≥ 0                          | **AJ only**     | Entered only after payment. Leave blank otherwise                                                                                              |
| S   | Revenue shareable?      | Yes / No                            | **AJ only**     | Whether AJ authorises sharing column R with the operator                                                                                       |
| T   | Attribution basis       | Dropdown                            | Logger          | Section 5                                                                                                                                      |
| U   | Attribution confidence  | Dropdown                            | Auto or owner   | Section 5                                                                                                                                      |
| V   | Notes                   | Text                                | Any             | **No personal data.** Short factual notes only                                                                                                 |

Formula for N (Google Sheets), assuming date-only values:
`=IF(M2="","",(M2-B2)*24)` shows hours only if times are recorded. If you log date only, label the
column "Days to first response" and use `=IF(M2="","",M2-B2)`.

**Status list:** New, Responded, Quoted, Booked, Completed, Lost (no reply or declined), Not a
fit (outside coverage, or a request AJ does not handle), Spam.

## 4. `Lists` sheet (dropdown sources)

Keep each list in its own column with a header. Suggested starting values (edit as needed):

- **Source:** Google Business Profile, Google Search (website), Facebook, Instagram, TikTok,
  WhatsApp status or broadcast, Website (other), Referral, Community outreach, Repeat customer,
  Paid ad, Other, Unknown
- **Medium:** organic, paid, referral, offline, unknown
- **Entry point:** Website WhatsApp button, Website call, Business Profile call, Direct WhatsApp, Referral message, Other
- **Enquiry type:** Servicing, Chemical cleaning, Repair/troubleshooting, Area check, Other
- **Unit type:** Wall Mounted, Ceiling Cassette, Ceiling Exposed, Other/unsure
- **General area:** Kuala Lumpur, Selangor, Outside coverage, Not stated
- **Status:** New, Responded, Quoted, Booked, Completed, Lost, Not a fit, Spam
- **Attribution basis:** see section 5
- **Attribution confidence:** Confirmed, Probable, Unknown

## 5. Attribution: what counts as evidence

| Attribution basis                    | Meaning                                                             | Confidence    |
| ------------------------------------ | ------------------------------------------------------------------- | ------------- |
| Customer stated source               | The customer said how they found AJ ("I saw your TikTok")           | **Confirmed** |
| Campaign-specific contact            | The customer used a number, code or link made for one campaign only | **Confirmed** |
| Tracked link plus customer confirmed | A UTM link was used **and** the customer confirms it                | **Confirmed** |
| Inferred                             | Timing or traffic pattern suggests a source, nobody confirmed       | **Probable**  |
| Unknown                              | No information                                                      | **Unknown**   |

Rules:

- A UTM link on its own is **not** confirmation (see `utm-links.md`). It shows a web visit, not who
  messaged or bought.
- Ask every new customer one neutral question and record the answer: _"Boleh tahu bagaimana anda
  jumpa AJ?" / "How did you hear about AJ?"_
- Only AJ (or the owner) may change a confidence level to Confirmed.
- Customers often use more than one channel. Record the one the customer names; mention others in Notes.

## 6. `Monthly` sheet (formulas)

Put the month as text in `B1`, for example `2026-11`. Put each source name in column A from row 4
down (copy from `Lists`). Assume data in `Leads!A2:V2000`.

| Column | Header                             | Formula for row 4                                                                                                                                                                |
| ------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B      | Leads                              | `=COUNTIFS(Leads!$C$2:$C$2000,$B$1,Leads!$D$2:$D$2000,$A4)`                                                                                                                      |
| C      | Valid leads (not Spam / Not a fit) | `=B4-COUNTIFS(Leads!$C$2:$C$2000,$B$1,Leads!$D$2:$D$2000,$A4,Leads!$L$2:$L$2000,"Spam")-COUNTIFS(Leads!$C$2:$C$2000,$B$1,Leads!$D$2:$D$2000,$A4,Leads!$L$2:$L$2000,"Not a fit")` |
| D      | Booked or completed                | `=COUNTIFS(Leads!$C$2:$C$2000,$B$1,Leads!$D$2:$D$2000,$A4,Leads!$L$2:$L$2000,"Booked")+COUNTIFS(Leads!$C$2:$C$2000,$B$1,Leads!$D$2:$D$2000,$A4,Leads!$L$2:$L$2000,"Completed")`  |
| E      | Completed                          | `=COUNTIFS(Leads!$C$2:$C$2000,$B$1,Leads!$D$2:$D$2000,$A4,Leads!$L$2:$L$2000,"Completed")`                                                                                       |
| F      | Lead to booked %                   | `=IF(C4=0,"",D4/C4)`                                                                                                                                                             |
| G      | Revenue (RM, shareable only)       | `=SUMIFS(Leads!$R$2:$R$2000,Leads!$C$2:$C$2000,$B$1,Leads!$D$2:$D$2000,$A4,Leads!$L$2:$L$2000,"Completed",Leads!$S$2:$S$2000,"Yes")`                                             |
| H      | Confirmed-attribution leads        | `=COUNTIFS(Leads!$C$2:$C$2000,$B$1,Leads!$D$2:$D$2000,$A4,Leads!$U$2:$U$2000,"Confirmed")`                                                                                       |
| I      | Median time to first response      | Optional. Use `MEDIAN` over a filter on column N                                                                                                                                 |

Add a totals row. Show **Unknown** as its own source row so unattributed leads stay visible.

## 7. Access and privacy

- Malaysia's Personal Data Protection Act 2010 applies to personal data handled in commercial
  transactions. Keeping the shared sheet free of names, phone numbers and addresses is the simplest
  way to stay on the safe side. Get proper advice if AJ later stores personal data in a sheet or tool.
- **AJ (owner):** full edit on all sheets.
- **Marketing operator:** can add and edit rows in `Leads` columns A–K and T–V, and see `Monthly`.
  They should **not** see column R (revenue) unless S says "Yes". The simplest method is a
  separate "Operator view" sheet that omits columns Q–S, linked by formula or filtered export.
- Do not share the sheet by public link. Invite named accounts only.
- Delete or archive rows older than the period AJ decides to keep. Write the retention period in `README`.

## 8. Commission reporting (only if AJ and the operator agree to it)

The commission rate, scope and payment terms are for AJ and the operator to agree **in writing**.
This document does not set them and nothing in the sheet assigns credit automatically.

The `Commission view` lists only rows that meet **all** of these:

1. Status is **Completed**
2. Revenue shareable is **Yes**
3. Attribution confidence is **Confirmed**
4. The source is one the operator manages (as agreed)
5. The month matches the reporting month

Google Sheets formula (month in `B1`):

```
=FILTER(Leads!A2:V2000,
  (Leads!L2:L2000="Completed")*(Leads!S2:S2000="Yes")*(Leads!U2:U2000="Confirmed")*(Leads!C2:C2000=$B$1))
```

Then filter by Source for the operator's agreed channels. **Probable** and **Unknown** rows are
**not** in this view. Any credit for them is a conversation between the owner and the operator,
decided case by case. Repeat customers, referrals from existing customers and walk-in or word-of-mouth
jobs are not marketing-attributed unless the customer says so.

Monthly routine: the owner reviews every Confirmed row, corrects mistakes, confirms revenue is
complete, then both parties agree the report before any payment.

## 9. Example rows (fictional, to show how the sheet reads. Delete before use)

| Lead ID     | Date       | Source                  | Medium  | Campaign             | Entry point             | Enquiry                | Unit             | Units | Area             | Status    | Basis                  | Confidence |
| ----------- | ---------- | ----------------------- | ------- | -------------------- | ----------------------- | ---------------------- | ---------------- | ----- | ---------------- | --------- | ---------------------- | ---------- |
| L-2026-0001 | 2026-11-03 | TikTok                  | organic | chem-clean-explainer | Direct WhatsApp         | Chemical cleaning      | Wall Mounted     | 2     | Selangor         | Completed | Customer stated source | Confirmed  |
| L-2026-0002 | 2026-11-04 | Google Business Profile | organic |                      | Business Profile call   | Repair/troubleshooting | Ceiling Cassette | 1     | Kuala Lumpur     | Booked    | Unknown                | Unknown    |
| L-2026-0003 | 2026-11-05 | Unknown                 | unknown |                      | Website WhatsApp button | Area check             | Other/unsure     |       | Outside coverage | Not a fit | Unknown                | Unknown    |

## 10. Weekly routine (about 15 minutes)

1. Log every new enquiry the same day, before replying if possible.
2. Ask the "how did you hear about AJ?" question and record the answer.
3. Update statuses and dates, and fill revenue only after payment.
4. Look at `Monthly`. Compare sources by valid leads and booked jobs, not by clicks or followers.
5. Note anything odd (many "Not a fit" enquiries may mean marketing is unclear about coverage or
   about which services AJ offers).
