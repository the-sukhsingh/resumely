# Resumely 📝

Resumely is an AI-powered resume builder and management platform designed to help users seamlessly tailor their resumes to specific job descriptions. It leverages AI to analyze job descriptions, manage master resumes, and generate targeted versions of your resume with a beautiful, interactive UI.

## Features ✨

- **Master Resume Management:** Keep a comprehensive master resume and generate targeted versions.
- **Job Description Matching:** Add job descriptions and use AI to tailor your resume specifically for the role.
- **Interactive Editor & Live Preview:** Edit your resume inline (using dynamic datatables) and see live PDF-like previews.
- **AI Chat Assistant:** Collaborate with an integrated AI assistant to refine descriptions, summaries, and bullet points.
- **Version Tracking:** Keep track of different versions of your resumes tailored for various applications.
- **Modern UI:** Beautiful animations and interfaces built with Tailwind, shadcn/ui, and Motion.

## Tech Stack 🛠️

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React, [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database:** [Convex](https://convex.dev/) (Real-time backend, database, and functions)
- **Animations:** [Motion](https://motion.dev/) (motion/react)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started 🚀

### Prerequisites

- Node.js (v18.17 or higher)
- npm, pnpm, or bun
- A Convex account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd resumely
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn / pnpm install
   ```

3. **Set up Convex Backend:**
   ```bash
   npx convex dev
   ```
   *This will prompt you to log in to Convex and configure your project. It will automatically provision your backend and create a `.env.local` file with your deployment URLs.*

4. **Run the Next.js development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure 📁

- `src/app/` - Next.js App Router pages (resume builder, training, auth).
- `src/components/` - React components, including the Resume Editor, Chat panel, and core UI (`shadcn/ui`).
- `convex/` - Backend schema, real-time queries, and serverless actions/mutations.
- `src/lib/` - Utilities, AI prompts, and PDF configuration.
