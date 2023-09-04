import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  prefix: '',
  firstName: '',
  lastName: '',
  fullName: '',
  birthday: '',
  nationality: '',
  idNumber: '',
  gender: '',
  tel: '',
  passport: '',
  expectedSalary: '',
};

const editSlice = createSlice({
  name: 'editData',
  initialState,
  reducers: {
    setPrefix: (state, action) => {
      state.prefix = action.payload;
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setFullName: (state, action) => {
      state.fullName = action.payload;
    },
    setBirthday: (state, action) => {
      state.birthday = action.payload;
    },
    setTel: (state, action) => {
      state.tel = action.payload;
    },
    setNationality: (state, action) => {
      state.nationality = action.payload;
    },
    setIdNumber: (state, action) => {
      state.idNumber = action.payload;
    }, 
    setGender: (state, action) => {
      state.gender = action.payload;
    }, 
    setPassport: (state, action) => {
      state.passport = action.payload;
    },
    setExpectedSalary: (state, action) => {
      state.expectedSalary = action.payload;
    }, 
  },
});

export const {
  setPrefix,
  setFirstName,
  setLastName,
  setFullName,
  setBirthday,
  setNationality,
  setIdNumber,
  setGender,
  setTel,
  setPassport,
  setExpectedSalary
} = editSlice.actions;
export default editSlice.reducer;
