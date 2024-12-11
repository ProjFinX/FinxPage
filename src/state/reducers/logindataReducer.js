export const reducer = (state = {}, action) => {

    switch (action.type) {
        case 'storelogindata':

            return action.payload;

        default:
            return state;

    }

} 

export default reducer;