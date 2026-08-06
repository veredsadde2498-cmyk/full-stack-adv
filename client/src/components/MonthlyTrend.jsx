import { useMemo } from 'react'
import { getMonthlyStats, calculatePercentChange } from '../utils/monthlyStats'

// שורת שינוי אחוזי לשדה אחד (הכנסות/הוצאות), עם חץ וצבע לפי אם השינוי
// הזה "טוב" או "רע" למדד הספציפי הזה - זה לא אותו דבר לשני המדדים!
// הכנסה: עלייה=טוב(ירוק,↑) ירידה=רע(אדום,↓)
// הוצאה:  עלייה=רע(אדום,↑)  ירידה=טוב(ירוק,↓)
function ChangeRow({ label, change, metric }) {
  if (change === null) {
    return (
      <p>
        {label}: <span style={{ color: '#888' }}>אין נתון להשוואה מהחודש הקודם</span>
      </p>
    )
  }

  const isIncrease = change > 0
  const isGood = metric === 'income' ? isIncrease : !isIncrease
  const color = change === 0 ? '#888' : isGood ? '#28a745' : '#dc3545'
  const arrow = change === 0 ? '–' : isIncrease ? '↑' : '↓'

  return (
    <p>
      {label}: <span style={{ color, fontWeight: 'bold' }}>{arrow} {Math.abs(change).toFixed(1)}%</span>
    </p>
  )
}

function MonthlyTrend({ transactions }) {
  // useMemo - לא מחשבים מחדש את פילוח שלושת החודשים בכל render, רק
  // כש-transactions באמת משתנה (למשל אחרי fetch/create/delete מ-Redux)
  const months = useMemo(() => getMonthlyStats(transactions), [transactions])
  const previous = months[1]
  const current = months[2]

  // גובה כל בר יחסי לסכום הגבוה ביותר משלושת החודשים; ה-,1 מונע חלוקה
  // באפס אם אין שום נתונים בכלל (משתמשת חדשה)
  const maxAmount = Math.max(...months.flatMap((m) => [m.income, m.expense]), 1)

  const previousHasData = previous.income > 0 || previous.expense > 0
  const incomeChange = calculatePercentChange(current.income, previous.income)
  const expenseChange = calculatePercentChange(current.expense, previous.expense)

  // משפט הפרשנות מבוסס על מגמת ההוצאות בכוונה - זה בדיוק הדבר ש-Vefinance
  // (אפליקציית ניהול הוצאות) קיימת בשבילו, יותר מסך ההכנסות
  let interpretation = null
  if (expenseChange !== null) {
    if (expenseChange < 0) interpretation = 'לעומת חודש שעבר, חסכת יותר! 🎉'
    else if (expenseChange > 0) interpretation = 'לעומת חודש שעבר, ההוצאות עלו'
    else interpretation = 'לעומת חודש שעבר, ההוצאות נשארו אותו הדבר'
  }

  return (
    <div className="trend-container">
      <h3>מגמה - 3 חודשים אחרונים</h3>

      <div className="trend-legend">
        <span><span className="trend-dot trend-dot-income" /> הכנסות</span>
        <span><span className="trend-dot trend-dot-expense" /> הוצאות</span>
      </div>

      <div className="trend-bars">
        {months.map((m) => (
          <div className="trend-month" key={`${m.year}-${m.month}`}>
            <div className="trend-bar-track">
              <div
                className="trend-bar trend-bar-income"
                style={{ height: `${(m.income / maxAmount) * 100}%` }}
                title={`הכנסות: ${m.income.toLocaleString()} ₪`}
              />
              <div
                className="trend-bar trend-bar-expense"
                style={{ height: `${(m.expense / maxAmount) * 100}%` }}
                title={`הוצאות: ${m.expense.toLocaleString()} ₪`}
              />
            </div>
            <span className="trend-month-label">{m.label}</span>
          </div>
        ))}
      </div>

      {!previousHasData ? (
        <p style={{ color: '#888', marginTop: '10px' }}>עוד אין מספיק נתונים להשוואה</p>
      ) : (
        <div style={{ marginTop: '10px' }}>
          <ChangeRow label="הכנסות" change={incomeChange} metric="income" />
          <ChangeRow label="הוצאות" change={expenseChange} metric="expense" />
          {interpretation && <p style={{ fontWeight: 'bold', marginTop: '6px' }}>{interpretation}</p>}
        </div>
      )}
    </div>
  )
}

export default MonthlyTrend
