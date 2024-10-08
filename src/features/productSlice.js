import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch products from the API with pagination and search filters
// export const fetchProducts = createAsyncThunk(
//   'products/fetchProducts',
//   async ({ category, search, skip = 0 }) => {
//     const url = category
//       ? `https://dummyjson.com/products/category/${category}?limit=10&skip=${skip}`
//       : `https://dummyjson.com/products?limit=10&skip=${skip}`;
    
//     const response = await axios.get(url);
//     return response.data.products.filter((product) =>
//       product.title.toLowerCase().includes(search.toLowerCase())
//     );
//   }
// );
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, search, skip = 0 }, { rejectWithValue }) => {
    try {
      let url = '';

      if (search && category) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=100&skip=0`;
      } else if (search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=10&skip=${skip}`;
      } else if (category) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=10&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=10&skip=${skip}`;
      }

      const response = await axios.get(url);
      let products = response.data.products;

      if (search && category) {
        products = products.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
        products = products.slice(skip, skip + 10);
      }

      return products;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: { data: [], status: null, hasMore: true, skip: 0 },
  reducers: {
    clearProducts: (state) => {
      state.data = []; 
      state.skip = 0; 
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      
      const uniqueProducts = action.payload.filter(
        (product) => !state.data.some((existingProduct) => existingProduct.id === product.id)
      );
      
      state.data = [...state.data, ...uniqueProducts]; 
      state.hasMore = action.payload.length === 10;  
      state.status = 'success';
      state.skip += 10;  
    });
    
    builder.addCase(fetchProducts.pending, (state) => {
      state.status = 'loading';
    });
    
    builder.addCase(fetchProducts.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
