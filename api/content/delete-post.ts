import { Validation } from "@utils/types"

export type DeletePostAPI = {
    // Data from client to server
    // Sucess (200 - OK)
    // Error (400 - Bad request)
    req: {
        id: number;
    }
}

export const verification: Validation<DeletePostAPI['req']> = {
    id: value => typeof(value) == 'number' && value > 0,
}