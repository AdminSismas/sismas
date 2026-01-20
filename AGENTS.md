# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Build, Development, and Testing Commands

### Development

```bash
pnpm run dev          # Start development server with hot reload
pnpm run build        # Build for production (static assets + SSR)
pnpm run preview      # Preview production build locally
pnpm start            # Start production server (runs ./dist/server/entry.mjs)
```

### Code Quality

```bash
# This project uses ESLint for code quality
# Run manually: pnpm eslint src/
# Fix automatically: pnpm eslint src/ --fix
```

### Astro-specific Commands

```bash
pnpm astro add <integration>    # Add new Astro integration
pnpm astro db push --remote     # Push database schema to remote
pnpm astro db seed              # Seed local database
```

## Project Structure and Conventions

### Architecture

- **Framework**: Astro 5.1+ with React islands
- **Styling**: Tailwind CSS with custom design system
- **Storage**: File-based persistence (currently, migrating to Astro DB)
- **Mode**: Server-side rendering (SSR) with Node.js adapter
- **Base Path**: `/wiki` (configured in astro.config.mjs)

### Import Path Aliases

```typescript
// Use these path aliases for imports
import Component from '@/components/Component'; // src/components/
import utility from '@/lib/utility'; // src/lib/
import asset from '@/assets/logo.png'; // src/assets/
import db from '@lib/db/db'; // src/lib/db/
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `WikiEditor.tsx`, `ErrorAlert.tsx`)
- **Pages**: lowercase with kebab-case for directories (e.g., `manual/[slug].astro`)
- **Hooks**: camelCase with `use` prefix (e.g., `useArticles.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`, `strip-markdown.ts`)
- **Types**: camelCase with interfaces (e.g., `WikiArticle` interface)

### TypeScript and Types

- **Strict Mode**: Enabled with `strictNullChecks: true`
- **Interface Export**: Always export types when defined (`export interface WikiArticle`)
- **Generic Types**: Use standard React patterns (`React.ButtonHTMLAttributes<HTMLButtonElement>`)
- **Enum Usage**: Prefer const objects over enums when possible

### Code Style Guidelines

#### Components

- **Functional Components**: Use React functional components with hooks
- **Props Destructuring**: Destructure props directly in function signature
- **Forward Ref**: Use `React.forwardRef` for components that need ref forwarding
- **Display Names**: Always set `Component.displayName = "ComponentName"`

```typescript
// Good example
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

#### Styling and CSS

- **Tailwind Classes**: Use utility classes, avoid custom CSS when possible
- **Component Variants**: Use `class-variance-authority` (cva) for component variations
- **Utility Function**: Use `cn()` from `@/lib/utils` for class merging
- **CSS Variables**: Design tokens stored in CSS custom properties

```typescript
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('base-classes', {
  variants: {
    variant: { default: 'bg-primary', destructive: 'bg-destructive' },
    size: { default: 'h-9 px-4', sm: 'h-8 px-3' }
  },
  defaultVariants: { variant: 'default', size: 'default' }
});
```

#### Error Handling

- **API Routes**: Use try-catch blocks with consistent error responses
- **User Feedback**: Display errors through ErrorAlert component
- **Console Logging**: Log errors with context for debugging
- **Graceful Degradation**: Provide fallbacks when data fetching fails

```typescript
// API route pattern
export const GET: APIRoute = async () => {
  try {
    const data = await fetchData();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
  }
};
```

#### Async Operations

- **Promise Handling**: Use async/await consistently
- **Loading States**: Implement loading indicators for async operations
- **Error States**: Handle and display error states appropriately
- **Data Fetching**: Use proper TypeScript typing for API responses

### Database and Data Management

#### Current Storage (File-based)

- **Repository Pattern**: Use `wikiRepository` for all data operations
- **Type Safety**: All operations use `WikiArticle` interface
- **Persistence**: Data persists to JSON files with automatic backups

```typescript
// Repository usage
const articles = await wikiRepository.listArticles();
const article = await wikiRepository.getArticle(slug);
await wikiRepository.saveArticle(article);
```

#### Migration to Astro DB (Future)

- **Schema Location**: `db/config.ts` contains table definitions
- **Seed Data**: `db/seed.ts` contains initial data
- **Type Safety**: Astro DB provides full TypeScript support

### Content and Markdown

- **Markdown Parser**: Uses `marked` for server-side rendering
- **Editor Component**: `react-markdown-editor-lite` with syntax highlighting
- **Code Highlighting**: `highlight.js` with atom-one-dark theme
- **Content Stripping**: Use `stripMarkdown()` utility for text previews

### React Integration Patterns

- **Islands Architecture**: Use `client:load`, `client:only="react"` directives
- **State Management**: Local React state for component-specific data
- **Custom Hooks**: Extract logic into custom hooks (e.g., `useArticle`)
- **Form Handling**: Standard HTML5 forms with controlled components

## Environment and Configuration

### Required Node Version

- **Minimum**: Node.js 22+
- **Package Manager**: pnpm (configured in package.json)

### Key Configuration Files

- **Astro Config**: `astro.config.mjs` - Main framework configuration
- **TypeScript**: `tsconfig.json` - Extends Astro strict config with path aliases
- **ESLint**: `eslint.config.js` - Code quality and style enforcement
- **Tailwind**: `tailwind.config.mjs` - Design system and styling
- **Base Path**: All routes are prefixed with `/wiki`

### Development Server

- **Local**: http://localhost:4321/wiki
- **Network**: Available on all network interfaces
- **Hot Reload**: Enabled for development

## Testing Considerations

While this project doesn't currently have automated tests, when adding tests:

1. **Unit Tests**: Test utility functions and components in isolation
2. **Integration Tests**: Test API endpoints and database operations
3. **E2E Tests**: Test user workflows across the application
4. **Test Files**: Place alongside source files with `.test.ts/.spec.ts` suffix

## Common Gotchas

1. **Path Imports**: Always use path aliases (`@/`) not relative imports
2. **SSR Mode**: Remember this is server-side rendered, not client-side SPA
3. **Base Path**: All internal links must include `/wiki` prefix
4. **TypeScript**: Strict mode enabled - handle null/undefined properly
5. **CSS Variables**: Use design system colors via CSS custom properties
6. **File Storage**: Data persists to filesystem, ensure write permissions

## When Making Changes

1. **Run Linter**: Check code quality before committing
2. **Test Locally**: Verify changes work in development mode
3. **Check Types**: Ensure TypeScript compilation succeeds
4. **Test Build**: Verify production build works with `pnpm run build`
5. **Preview**: Test production build with `pnpm run preview`
