import { Validation } from "@utils/types"

export type DeletePostAPI = {
    // Data from client to server
    req: {
        id: number;
    }
}

export const verification: Validation<DeletePostAPI['req']> = {
    id: value => typeof(value) == 'number' && value > 0,
}