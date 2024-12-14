export const userdetails = (userdata) => {
    return (dispatch) => {

        dispatch({
            type: 'storelogindata',
            payload: userdata
        }
        )

    }

}