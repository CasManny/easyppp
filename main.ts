
type ApiResponse<Data> = {
    data: Data,
    isError: boolean
}

type UserResponse = ApiResponse<{ user: string, age: number }>

const response: UserResponse = {
    data: {
        user: 'Cas',
        age: 25,
    },
    isError: false
}