import { memo } from 'react'
import { Link } from 'react-router-dom'

// שורה בודדת בטבלת הטרנזקציות - עטופה ב-memo כדי שמחיקה/עדכון של שורה אחת
// לא יגרמו לרינדור מחדש של כל שאר השורות שלא השתנו. כדי שזה יעבוד בפועל,
// חייב גם ש-onDelete יהיה reference יציב (useCallback ב-Dashboard.jsx) -
// אחרת ה-props "משתנים" כל render גם אם transaction עצמו לא השתנה
function TransactionRow({ transaction, onDelete }) {
  return (
    <tr>
      <td>{transaction.title}</td>
      <td>{transaction.amount.toLocaleString()} ₪</td>
      <td>{transaction.type === 'income' ? 'הכנסה' : 'הוצאה'}</td>
      <td>{transaction.category}</td>
      <td>{new Date(transaction.date).toLocaleDateString('he-IL')}</td>
      <td>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <Link to={`/transactions/${transaction._id}/edit`} className="btn btn-primary">
            עריכה
          </Link>
          <button type="button" className="btn btn-danger" onClick={() => onDelete(transaction._id)}>
            מחיקה
          </button>
        </div>
      </td>
    </tr>
  )
}

export default memo(TransactionRow)
