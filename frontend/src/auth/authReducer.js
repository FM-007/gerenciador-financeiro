const userKey = '_mymoney_user'

const INITIAL_STATE = {

    user: { name: 'Felipe', email: 'testando@gmail.com' }, //JSON.parse(localStorage.getItem(userKey)),
    validToken: false

}

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case 'TOKEN_VALIDETED':

            if (action.payload) {

                return { ...state, validToken: false, user: null }

            } else {

                localStorage.removeItem(userKey)
                return { ...state, validToken: false, user: null }

            }

        case 'USER_FETCHED':

            localStorage.setItem(userKey, JSON.stringify(action.payload))
            return { ...state, validToken: true, user: action.payload}

        default:
            return state

    }

}