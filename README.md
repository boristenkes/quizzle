# Quizzle

Quizzle is a full-stack, social-media-like quiz application. Sign in, create quizzes, review them, and play quizzes made by other people. Building a quiz is faster with AI: upload a PDF and Quizzle generates questions from its contents.

**Live demo:** [bt-quizzle.vercel.app](https://bt-quizzle.vercel.app)

## Features

- **Authentication**: sign up and sign in with [Better Auth](https://www.better-auth.com)
- **Quiz creation**: build quizzes with multiple questions and rich-text content (Tiptap)
- **AI question generation**: upload a PDF and let Google Gemini generate questions from its text
- **Play quizzes**: take quizzes created by other users
- **Reviews**: leave reviews on quizzes you have played
- **File uploads**: image and file uploads via UploadThing
- **Light and dark mode**

## Tech stack

| Area                 | Tools                                                                          |
| -------------------- | ------------------------------------------------------------------------------ |
| Framework            | Next.js 16 (App Router, Server Actions), React 19, TypeScript                  |
| Database             | PostgreSQL, Drizzle ORM, drizzle-kit                                           |
| Auth                 | Better Auth                                                                    |
| AI                   | Google Gemini (`@google/genai`), `pdf-parse`                                   |
| Uploads              | UploadThing, react-dropzone                                                    |
| UI                   | Tailwind CSS v4, shadcn/ui, Base UI, Framer Motion, Tiptap, Sonner, Vaul, cmdk |
| Forms and validation | React Hook Form, Zod 4, `@t3-oss/env-nextjs`                                   |
| Data fetching        | TanStack Query                                                                 |
| Security             | `sanitize-html` for user-generated rich text                                   |

## Getting started

### Prerequisites

- Node.js 20 or newer
- [pnpm](https://pnpm.io)
- A PostgreSQL database (local, Docker, Neon, Supabase, and so on)
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini
- An [UploadThing](https://uploadthing.com) account

### Installation

```bash
git clone https://github.com/boristenkes/quizzle.git
cd quizzle
pnpm install
```

### Environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

The exact variable names are defined in `.env.example` and validated at startup by `@t3-oss/env-nextjs`. You will typically need:

| Variable               | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string                              |
| `BETTER_AUTH_SECRET`   | Secret used by Better Auth to sign sessions               |
| `BETTER_AUTH_URL`      | Base URL of the app (for example `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID`     | Google client key                                         |
| `GOOGLE_CLIENT_SECRET` | Google client secret                                      |
| `GEMINI_API_KEY`       | Google Gemini API key                                     |
| `UPLOADTHING_TOKEN`    | UploadThing token                                         |

### Database setup

```bash
pnpm db:push        # push the schema to your database (quick, good for development)
# or
pnpm db:generate    # generate SQL migrations
pnpm db:migrate     # apply migrations
```

### Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script               | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `pnpm dev`           | Start the development server                               |
| `pnpm dev:debug`     | Start the dev server with the Node inspector enabled       |
| `pnpm build`         | Create a production build                                  |
| `pnpm start`         | Run the production build                                   |
| `pnpm lint`          | Run ESLint                                                 |
| `pnpm auth:generate` | Regenerate the Better Auth schema into `db/schema/auth.ts` |
| `pnpm auth:info`     | Print Better Auth configuration diagnostics                |
| `pnpm db:generate`   | Generate Drizzle migrations                                |
| `pnpm db:migrate`    | Apply Drizzle migrations                                   |
| `pnpm db:push`       | Push the schema directly to the database                   |
| `pnpm db:pull`       | Introspect an existing database into the schema            |
| `pnpm db:studio`     | Open Drizzle Studio                                        |

## Project structure

```
app/          Next.js App Router routes, layouts and pages
components/   Shared UI components
context/      React context providers
db/           Drizzle schema and database client
features/     Feature-based modules (quizzes, reviews, auth, and so on)
hooks/        Custom React hooks
lib/          Core configuration (auth, AI client, helpers)
utils/        Utility functions
public/       Static assets
```

## How AI generation works

1. The user uploads a PDF while creating a quiz.
2. The server extracts the text with `pdf-parse`.
3. The text is sent to Gemini with a prompt asking for quiz questions.
4. The response is validated and returned to the quiz editor, where the user can review and edit the questions before saving.

## Deployment

The app is configured for [Vercel](https://vercel.com) (see `vercel.json`). Set the same environment variables in your Vercel project settings and point `DATABASE_URL` at a hosted PostgreSQL instance.

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you would like to change.
