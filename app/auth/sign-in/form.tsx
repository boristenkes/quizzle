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
import { SignInSchema, signInSchema } from '@/features/auth/zod'
import { authClient } from '@/lib/auth.client'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function SignInForm() {
	const form = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: '',
			password: ''
		}
	})
	const { isSubmitting, errors } = form.formState
	const [showPassword, setShowPassword] = useState(false)
	const router = useRouter()

	const onSubmit = async (data: SignInSchema) => {
		const chosenIdentifier = data.identifier.includes('@')
			? 'email'
			: 'username'
		// @ts-ignore
		const response = await authClient.signIn[chosenIdentifier]({
			password: data.password,
			[chosenIdentifier]: data.identifier
		})

		if (response.error) {
			console.error('[SIGN_IN_ERROR]:', response.error)
			return form.setError('root', {
				message: response.error?.message ?? 'Something went wrong'
			})
		}

		toast.success('Signed in successfully', {
			description: `Welcome back, ${response.data.user.name}`
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
						name='identifier'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='signIn__identifier'>
									Email or Username
								</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id='signIn__identifier'
										aria-invalid={fieldState.invalid}
										placeholder='johndoe@example.com | johndoe'
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
						name='password'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='signIn__password'>Password</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id='signIn__password'
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
				</FieldGroup>

				<Button
					type='submit'
					className='w-full'
					size='lg'
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Please wait' : 'Sign In'}
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
			>
				<GoogleLogo className='mr-2 size-4' />
				Continue with Google
			</Button>
		</>
	)
}
