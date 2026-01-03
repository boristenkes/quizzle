'use client'

import ErrorMessage from '@/components/error-message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { editUserSchema, EditUserSchema } from '@/features/users/zod'
import { authClient } from '@/lib/auth.client'
import { getDirtyValues, getInitials, isEmpty } from '@/utils/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'better-auth'
import { Camera, Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export type ProfileInfoProps = {
	user: User
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
	const form = useForm<EditUserSchema>({
		defaultValues: editUserSchema.parse(user),
		// @ts-expect-error TODO
		resolver: zodResolver(editUserSchema)
	})
	const { isSubmitting, errors } = form.formState

	const onSubmit = async (data: EditUserSchema) => {
		if (isEmpty(form.formState.dirtyFields)) return

		const dirtyValues = getDirtyValues(data, form.formState.dirtyFields)

		console.log(dirtyValues)

		const response = await authClient.updateUser(dirtyValues)

		if (response.error) {
			console.error('[UPDATE_USER]:', response.error)
			form.setError('root', {
				message:
					response.error.message ??
					'Failed to update profile. Please try again later'
			})
			return
		}

		toast.success('Profile updated successfully')
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Information</CardTitle>
				<CardDescription>
					Update your personal details and public profile
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* Avatar */}
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'
				>
					<div className='flex items-center gap-6'>
						<Avatar className='h-20 w-20'>
							<AvatarImage
								src={form.getValues('image') ?? ''}
								alt={form.getValues('name')}
							/>
							<AvatarFallback className='text-2xl'>
								{getInitials(form.getValues('name')!)}
							</AvatarFallback>
						</Avatar>
						<div className='space-y-2'>
							<Button
								variant='outline'
								size='sm'
							>
								<Camera className='mr-2 h-4 w-4' />
								Change Photo
							</Button>
							<p className='text-xs text-muted-foreground'>
								JPG, PNG or GIF. Max 2MB
							</p>
						</div>
					</div>

					<Separator />

					<div className='grid gap-4 sm:grid-cols-2'>
						<Controller
							name='name'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder='John Doe'
										autoComplete='given-name'
										disabled={isSubmitting}
									/>
									<FieldDescription>Enter your name</FieldDescription>
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
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder='john.doe@example.com'
										autoComplete='email'
										disabled={isSubmitting}
									/>
									<FieldDescription>Enter your email address</FieldDescription>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</div>

					<Controller
						name='bio'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Bio</FieldLabel>
								<Textarea
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder='Tell us about yourself...'
									disabled={isSubmitting}
								/>
								<FieldDescription>
									Brief description of your profile
								</FieldDescription>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					{errors.root && (
						<ErrorMessage
							message={errors.root.message!}
							className='my-4'
						/>
					)}

					<div className='flex justify-end'>
						<Button
							type='submit'
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<Spinner className='size-4' />
							) : (
								<Save className='size-4' />
							)}
							{isSubmitting ? 'Saving' : 'Save Changes'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
