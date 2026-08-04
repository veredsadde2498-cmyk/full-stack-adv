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
  }
})

export const { clearTransactions } = transactionsSlice.actions
export default transactionsSlice.reducer
