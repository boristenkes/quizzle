export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type ServerActionResponse<
	SuccessResponse extends object = {},
	ErrorResponse extends object = {}
> =
	| ({ success: true } & SuccessResponse)
	| ({ success: false; message?: string } & ErrorResponse)
