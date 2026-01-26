'use client'

import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/utils/format'
import { cn } from '@/utils/helpers'
import {
	FileTextIcon,
	Loader2Icon,
	Sparkles,
	Upload,
	XIcon
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone, type DropzoneOptions } from 'react-dropzone'

export type PDFDropzoneProps = DropzoneOptions & {
	onFileSelect: (file: File) => void
	onClear?: () => void
	isProcessing?: boolean
}

export function PDFDropzone({
	onFileSelect,
	onClear,
	isProcessing = false,
	...props
}: PDFDropzoneProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [isOpen, setIsOpen] = useState(false)

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0]
			if (!file) return

			setSelectedFile(file)
			onFileSelect(file)
			setIsOpen(true)
		},
		[onFileSelect]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { 'application/pdf': [] },
		multiple: false,
		...props
	})

	const handleClear = useCallback(() => {
		setSelectedFile(null)
		onClear?.()
	}, [onClear])

	if (selectedFile) {
		return (
			<div className='relative border-2 border-dashed border-primary/40 rounded-xl p-6 bg-primary/5'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<div className='size-12 bg-primary/10 rounded-lg flex items-center justify-center'>
							<FileTextIcon className='size-6 text-primary' />
						</div>
						<div>
							<p className='font-medium text-foreground'>{selectedFile.name}</p>
							<p className='text-sm text-muted-foreground'>
								{formatFileSize(selectedFile.size)}
							</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						{isProcessing ? (
							<div className='flex items-center gap-2 text-primary'>
								<Loader2Icon className='size-4 animate-spin' />
								<span className='text-sm font-medium'>AI is analyzing...</span>
							</div>
						) : (
							<Button
								variant='ghost'
								size='icon'
								onClick={handleClear}
								className='text-muted-foreground hover:text-destructive'
							>
								<XIcon className='size-4' />
							</Button>
						)}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div
			{...getRootProps()}
			className={cn(
				'relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer',
				isDragActive
					? 'border-primary bg-primary/5 scale-[1.02]'
					: 'border-border hover:border-primary/50 hover:bg-secondary/50'
			)}
		>
			<input {...getInputProps()} />
			<div className='flex flex-col items-center justify-center gap-4 text-center'>
				<div
					className={cn(
						'size-16 rounded-full flex items-center justify-center transition-colors',
						isDragActive ? 'bg-primary/20' : 'bg-secondary'
					)}
				>
					<Upload
						className={cn(
							'size-8 transition-colors',
							isDragActive ? 'text-primary' : 'text-muted-foreground'
						)}
					/>
				</div>
				<div>
					<p className='font-medium text-foreground'>
						{isDragActive
							? 'Drop your PDF here'
							: 'Drop a PDF or click to upload'}
					</p>
					<p className='text-sm text-muted-foreground mt-1 text-pretty'>
						AI will analyze your content, populate configuration fields and
						generate questions for you
					</p>
				</div>
				<div className='flex items-center gap-2 text-xs text-muted-foreground'>
					<Sparkles className='h-3 w-3' />
					<span>Powered by AI</span>
				</div>
			</div>
		</div>
	)
}
