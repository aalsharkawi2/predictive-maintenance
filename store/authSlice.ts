import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  engineer: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  engineer: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEngineer: (state, action: PayloadAction<string>) => {
      state.engineer = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.engineer = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setEngineer, logout } = authSlice.actions;
export default authSlice.reducer;
