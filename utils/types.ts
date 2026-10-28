export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type Nullable<T> = T | undefined | null

export type ServerResponse<
	SuccessResponse extends object = {},
	ErrorResponse extends object = {}
> =
	| ({ success: true } & SuccessResponse)
	| ({ success: false; message?: string } & ErrorResponse)
