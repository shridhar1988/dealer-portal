import { createSlice } from '@reduxjs/toolkit'
import { capitalizeText } from '../common/textOperations';

export const selectedEmployeeInformation = createSlice({
    name: "Selected Employee Personal Information",
    initialState: {
        selectedEmployeeID: "",
        firstName: "",
        email: "",
        department: "",
        mobile: "",
        assignedManager: "",
        gender: "",
    },

    reducers: {
        setSelectedEmployeePersonalInformation: (state, action) => {
            return state = {
                selectedEmployeeID: action.payload.selectedEmployeeID,
                firstName: capitalizeText(action.payload.firstName),
                email: action.payload.email,
                department: action.payload.department,
                mobile: action.payload.mobile,
                assignedManager: action.payload.assignedManager,
                gender: action.payload.gender,
            }
        },

     
        clearSelectedEmployeePersonalInformation: (state) => {
            return state = {
                selectedEmployeeID: "",
                firstName: "",
                email: "",
                department: "",
                mobile: "",
                assignedManager:"",
                gender: "",
            };
        },

    },
})

export const { setSelectedEmployeePersonalInformation, clearSelectedEmployeePersonalInformation } = selectedEmployeeInformation.actions;

export default selectedEmployeeInformation.reducer;
