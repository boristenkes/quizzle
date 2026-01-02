'use client'

import ErrorMessage from '@/components/error-message'
import GoogleLogo from '@/components/icons/google-logo'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { SignUpSchema, signUpSchema } from '@/features/auth/zod'
import { authClient } from '@/lib/auth.client'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function SignUpForm() {
	const form = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	})
	const [showPassword, setShowPassword] = useState(false)
	const router = useRouter()
	const { isSubmitting, errors } = form.formState

	const onSubmit = async (data: SignUpSchema) => {
		const response = await authClient.signUp.email(data)

		if (response.error) {
			console.error('[SIGN_UP_ERROR]:', response.error)
			return form.setError('root', {
				message: response.error?.message ?? 'Something went wrong'
			})
		}

		toast.success('Registration successful', {
			description: `Welcome to Quizzle, ${response.data.user.name}!`
		})
		form.reset()
		router.replace('/')
	}

	return (
		<>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'
			>
				<FieldGroup className='gap-6'>
					<Controller
						name='name'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='signup__name'>Name</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id='signup__name'
										aria-invalid={fieldState.invalid}
										placeholder='John Doe'
										autoComplete='off'
										disabled={isSubmitting}
									/>
									<InputGroupAddon>
										<UserIcon />
									</InputGroupAddon>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name='username'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='signup__username'>Username</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id='signup__username'
										aria-invalid={fieldState.invalid}
										placeholder='johndoe'
										autoComplete='off'
										disabled={isSubmitting}
									/>
									<InputGroupAddon>
										<UserIcon />
									</InputGroupAddon>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name='email'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='signup__email'>Email</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id='signup__email'
										aria-invalid={fieldState.invalid}
										placeholder='johndoe@example.com'
										autoComplete='off'
										disabled={isSubmitting}
									/>
									<InputGroupAddon>
										<MailIcon />
									</InputGroupAddon>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name='password'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='signup__password'>Password</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id='signup__password'
										type={showPassword ? 'text' : 'password'}
										aria-invalid={fieldState.invalid}
										placeholder='••••••••'
										autoComplete='off'
										disabled={isSubmitting}
									/>
									<InputGroupAddon>
										<LockIcon />
									</InputGroupAddon>

									<InputGroupAddon align='inline-end'>
										<InputGroupButton
											aria-label={
												showPassword ? 'Hide password' : 'Show password'
											}
											title={showPassword ? 'Hide' : 'Show'}
											size='icon-xs'
											onClick={() => setShowPassword(prev => !prev)}
											disabled={isSubmitting}
										>
											{showPassword ? <EyeOffIcon /> : <EyeIcon />}
										</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name='confirmPassword'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='signup__confirmPassword'>
									Confirm Password
								</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id='signup__confirmPassword'
										type={showPassword ? 'text' : 'password'}
										aria-invalid={fieldState.invalid}
										placeholder='••••••••'
										autoComplete='off'
										disabled={isSubmitting}
									/>

									<InputGroupAddon>
										<LockIcon />
									</InputGroupAddon>
								</InputGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>

				<Button
					type='submit'
					className='w-full'
					size='lg'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Please wait' : 'Create Account'}
					{isSubmitting && <Spinner />}
				</Button>
			</form>

			{errors.root && (
				<ErrorMessage
					message={errors.root.message!}
					className='mt-4'
				/>
			)}

			<div className='relative my-6'>
				<Separator />
				<span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground'>
					or
				</span>
			</div>

			<Button
				variant='outline'
				className='w-full'
				size='lg'
				disabled={isSubmitting}
				onClick={() =>
					authClient.signIn.social({
						provider: 'google',
						callbackURL: '/'
					})
				}
			>
				<GoogleLogo className='mr-2 size-4' />
				Continue with Google
			</Button>
		</>
	)
}
