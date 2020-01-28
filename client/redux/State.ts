// InitialState
export type StoreState = {
    authorization: {
        username: string;
        loggedIn: boolean;
    };
};
export const initialState: StoreState = {
    authorization: {
        username: '',
        loggedIn: false,
    },
};