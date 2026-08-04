const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
]

// מחזיר את 3 החודשים האחרונים (כולל הנוכחי), מהישן לחדש - לכל חודש:
// שם בעברית, סה"כ הכנסות וסה"כ הוצאות שנפלו בתוכו
export function getMonthlyStats(transactions) {
  const now = new Date()

  const months = [2, 1, 0].map((monthsAgo) => {
    // Date עם חודש שלילי "מתגלגל" אוטומטית לשנה הקודמת - אין צורך בחישוב ידני
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      label: HEBREW_MONTHS[date.getMonth()],
      income: 0,
      expense: 0
    }
  })

  transactions.forEach((t) => {
    const txDate = new Date(t.date)
    const match = months.find(
      (m) => m.year === txDate.getFullYear() && m.month === txDate.getMonth()
    )
    if (!match) return

    if (t.type === 'income') match.income += t.amount
    else match.expense += t.amount
  })

  return months
}

// אחוז שינוי בין ערך נוכחי לקודם. previous === 0 הוא מקרה קצה: אין "בסיס"
// לחישוב אחוז (חלוקה באפס), אז מחזירים null (לא ניתן להשוואה) - אלא אם
// גם current הוא 0, ואז אין שום שינוי בכלל ומחזירים 0 באופן תקין
export function calculatePercentChange(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : null
  }
  return ((current - previous) / previous) * 100
}
