import { combineReducers } from "redux";
import logindataReducer from "./logindataReducer"

export const reducers = combineReducers({

    logindata : logindataReducer

})

export default reducers