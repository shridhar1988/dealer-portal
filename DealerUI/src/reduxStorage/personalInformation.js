import { createSlice } from '@reduxjs/toolkit'
import { capitalizeText } from '../common/textOperations';

export const personalInformation = createSlice({
    name: "Personal Information",
    initialState: {
        userID: "",
        empInfoId:"",
        userName: "",
        userRole: "",
        displayName: "",
        emailAddress: "",
        menuItemNames: "",
        token: "",
        profilePic: "",
        firstName: "",
        lastName: "",
        clientId: "",
        gender: "",
        department: "",
    },

    reducers: {
        setUserPersonalInformation: (state, action) => {
            return state = {
                userID: action.payload.userID,
                empInfoId:action.payload.empInfoId,
                userName: capitalizeText(action.payload.userName),
                userRole: action.payload.userRole,
                displayName: action.payload.displayName,
                emailAddress: action.payload.emailAddress,
                menuItemNames: action.payload.menuItemNames,
                token: action.payload.token,
                profilePic: action.payload.profilePic,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                clientId: action.payload.clientId,
                department: action.payload.department,
                gender: action.payload.gender
            }
        },

        changePersonalInfo: (state, action) => {
            return state = {
                ...state,
                profilePic: action.payload.profilePic,
            }
        },

        changeApplicationClientIdAndMenuItems: (state, action) => {
            return state = {
                ...state,
                clientId: action.payload.clientId,
                menuItemNames: action.payload.menuItemNames,
            }
        },
        clearPersonalInformation: (state) => {
            return state = {
                userID: "",
                empInfoId:"",
                userName: "",
                userRole: "",
                displayName: "",
                emailAddress: "",
                menuItemNames: "",
                token: "",
                profilePic: "",
                firstName: "",
                lastName: "",
                clientId: "",
                department: "",
                gender: "",
            };
        },

    },
})

export const { setUserPersonalInformation, changePersonalInfo, changeApplicationClientIdAndMenuItems, clearPersonalInformation } = personalInformation.actions;

export default personalInformation.reducer;
