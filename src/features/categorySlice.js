// categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axios.get('https://dummyjson.com/products/category-list');
  return response.data;
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: { data: [], status: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = 'success';
    });
    builder.addCase(fetchCategories.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchCategories.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export default categorySlice.reducer;
