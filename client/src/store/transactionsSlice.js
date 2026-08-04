import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

// שולף את כל הטרנזקציות של המשתמש המחובר (השרת מסנן לפי owner בעצמו)
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    const response = await api.get('/transactions')
    return response.data
  }
)

// שלושת ה-thunks הבאים משתמשים ב-rejectWithValue כדי להעביר את גוף
// השגיאה האמיתי מהשרת (message/errors) לקומפוננטה שקוראת להם עם
// .unwrap() - בלי זה היינו מקבלים רק הודעת שגיאה גנרית של axios

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/transactions', transactionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/transactions/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    clearTransactions: (state) => {
      state.list = []
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // create/update/delete לא נוגעים ב-loading/error הכלליים של הרשימה -
      // הצלחה/כישלון שלהם מטופלים מקומית בקומפוננטה שקוראת להם (עם .unwrap()),
      // כאן רק מסנכרנים את ה-list בזיכרון כדי לא לצטרך fetch מלא מחדש מהשרת
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id)
        if (index !== -1) state.list[index] = action.payload
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload)
      })
  }
})

export const { clearTransactions } = transactionsSlice.actions
export default transactionsSlice.reducer
