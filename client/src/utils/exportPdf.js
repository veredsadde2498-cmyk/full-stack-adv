import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { notoSansHebrewBase64 } from '../assets/fonts/notoSansHebrewBase64'

const HEBREW_FONT_NAME = 'NotoHebrew'

// jsPDF's built-in fonts (helvetica/times/courier) have zero Hebrew glyph coverage -
// raw Hebrew text renders as garbled Latin-1 mojibake, not just missing. NotoSansHebrewBase64
// is a real Hebrew-glyph TrueType font embedded directly into the PDF so the actual
// glyph shapes render correctly. It's only used for the Hebrew data cells (title/category);
// the rest of the document (labels, numbers, dates) is plain English on the default font.
const registerHebrewFont = (doc) => {
  doc.addFileToVFS('NotoSansHebrew.ttf', notoSansHebrewBase64)
  doc.addFont('NotoSansHebrew.ttf', HEBREW_FONT_NAME, 'normal')
}

// Even with Hebrew glyphs available, jsPDF still lays text out left-to-right - it has
// no bidi/RTL engine. Hebrew (unlike Arabic) doesn't reshape by position, so reversing
// the character order is a simple, well-known trick to fake correct RTL visual order.
// Limitation: any digits/Latin embedded inside the string get reversed too (e.g. a title
// like "פגישה 14:30" would show its digits out of order) - fine for the plain Hebrew
// words/phrases typical of transaction titles and categories in this app.
const toVisualRTL = (text) => text.split('').reverse().join('')

const formatDate = (date) => new Date(date).toLocaleDateString('en-GB') // DD/MM/YYYY - digits only

// Number.prototype.toLocaleString() silently inserts an invisible bidi control
// character (U+200E, LEFT-TO-RIGHT MARK) right before the minus sign on negative
// numbers - e.g. (-150).toLocaleString() === '\u200E-150'. jsPDF's text renderer
// treats that invisible character as "unusual" and falls back to manual per-glyph
// spacing for the *entire* string it's part of, which is why "Balance: -150 NIS"
// rendered as "B a l a n c e :   - 1 5 0   N I S" whenever the balance went negative.
// Stripping bidi control characters before formatting avoids it - has no visible
// effect on positive numbers, which never contained the mark to begin with.
const formatAmount = (value) => value.toLocaleString().replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')

// מייצא לPDF את הסיכום הפיננסי + טבלת הטרנזקציות, מה-state שכבר קיים ב-Redux -
// בלי endpoint נפרד בשרת. כל התהליך רץ בדפדפן.
export function exportTransactionsToPdf(transactions) {
  const doc = new jsPDF()
  registerHebrewFont(doc)

  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount
      else acc.expense += t.amount
      return acc
    },
    { income: 0, expense: 0 }
  )
  const balance = totals.income - totals.expense

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Vefinance - Financial Summary', 14, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Generated on: ${formatDate(new Date())}`, 14, 25)

  doc.setFontSize(12)
  doc.text(`Total Income: ${formatAmount(totals.income)} NIS`, 14, 35)
  doc.text(`Total Expense: ${formatAmount(totals.expense)} NIS`, 14, 42)
  doc.setFont('helvetica', 'bold')
  doc.text(`Balance: ${formatAmount(balance)} NIS`, 14, 49)

  const rows = transactions.map((t) => [
    toVisualRTL(t.title),
    `${formatAmount(t.amount)} NIS`,
    t.type === 'income' ? 'Income' : 'Expense',
    toVisualRTL(t.category),
    formatDate(t.date)
  ])

  autoTable(doc, {
    startY: 56,
    head: [['Title', 'Amount', 'Type', 'Category', 'Date']],
    body: rows,
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [0, 123, 255] },
    // רק בתאי ה-body (לא הכותרות!) של עמודות title/category עוברים לגופן העברי -
    // הכותרות "Title"/"Category" עצמן הן טקסט אנגלי וחייבות להישאר על הגופן הרגיל,
    // שהרי הגופן העברי המוטבע מכיל אותיות עבריות בלבד, בלי glyphs לטיניים
    didParseCell: (data) => {
      if (data.section === 'body' && (data.column.index === 0 || data.column.index === 3)) {
        data.cell.styles.font = HEBREW_FONT_NAME
      }
    }
  })

  const today = new Date().toISOString().slice(0, 10)
  doc.save(`vefinance-summary-${today}.pdf`)
}
