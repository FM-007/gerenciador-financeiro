import { combineReducers } from 'redux'
import { reducer as formReducer } from "redux-form";
import { reducer as toastrReducer } from "react-redux-toastr";

import DashboardReducer from '../dashboard/DashboardReducer'
import TabReducer from '../common/tab/TabReducer'
import BillingCycle from '../billingCycle/BillingCycleReducer'
import AuthReducer from '../auth/authReducer'

const rootReducer = combineReducers({

    dashboard: DashboardReducer,
    tab: TabReducer,
    billingCycle: BillingCycle,
    form: formReducer,
    toastr: toastrReducer,
    auth: AuthReducer

})

export default rootReducer