import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'


const initialState = {
  value: Cookies.get('FreeBirdDarkMode') == 'true' || false, // note* I have used == to check if the freeBirdDarkMode is true, This gives true and it doesn't depend on the dataType, i.e returns true if the value is boolean true or string true.
}

export const setColorModeSlice = createSlice({
  name: 'darkmode',
  initialState,
  reducers: {
    changeColorMode: (state) => {
      state.value = !state.value
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeColorMode } = setColorModeSlice.actions

export default setColorModeSlice.reducer

