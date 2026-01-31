<!--
Sync Impact Report
==================
Version change: 0.0.0 → 1.0.0
Modified principles: None (initial formalization)
Added sections:
  - 8 Core Principles (I-VIII)
  - Technology Stack section
  - Development Workflow section
  - Governance section
Removed sections: None (replaced placeholders)
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section compatible
  ✅ spec-template.md - No changes required
  ✅ tasks-template.md - No changes required
Follow-up TODOs:
  - TODO(HUSKY_HOOKS): Enable pre-commit hooks with `npx husky install`
  - TODO(A11Y_TESTING): Add automated accessibility testing to CI pipeline
-->

# JsBootSpark Constitution

## Core Principles

### I. Static-First Development (MANDATORY)

All features MUST work on GitHub Pages without a backend server. The Express.js server exists only for local development and testing.

**Requirements:**
- All production functionality MUST work from static files
- Data sources MUST have pre-built JSON equivalents in `/docs/data/`
- JavaScript MUST try static JSON first, with API fallback for local dev only
- All paths MUST include GitHub Pages base path (`/JsBootSpark/`)
- URL parsing MUST handle trailing slashes correctly

**Rationale:** Primary deployment target is GitHub Pages static hosting. Server-dependent features cannot be deployed to production.

### II. Test-First Quality (MANDATORY)

All code MUST have Jest tests with minimum 80% coverage threshold.

**Requirements:**
- All new code MUST have corresponding test files in `/src/tests/`
- Tests MUST use Jest with the `*.test.js` naming convention
- Coverage threshold: 80% minimum enforced in CI
- API tests MUST use Supertest for endpoint verification
- Test names SHOULD be descriptive using arrange-act-assert pattern

**Rationale:** High test coverage ensures reliability and enables confident refactoring. Tests document expected behavior.

### III. Code Quality Gates (MANDATORY)

All code MUST pass ESLint and Prettier checks before merge. Pre-commit hooks MUST be enabled.

**Requirements:**
- ESLint MUST pass with zero errors
- Prettier formatting MUST be applied consistently
- Husky pre-commit hooks MUST be configured and enabled
- Standard config: 2-space indent, single quotes, trailing commas ES5
- No unused variables except with `_` prefix pattern

**Rationale:** Consistent code style reduces cognitive load and prevents common errors. Pre-commit enforcement catches issues early.

### IV. Security-First Architecture (MANDATORY)

All API endpoints and external resources MUST implement security best practices.

**Requirements:**
- Helmet.js security headers MUST be enabled
- Content Security Policy (CSP) MUST be configured
- Rate limiting MUST be applied to all public API endpoints
- External resources MUST use Subresource Integrity (SRI) hashes
- User inputs MUST be validated and sanitized
- Secrets MUST NOT be committed; use environment variables

**Rationale:** Security vulnerabilities can expose users and damage trust. Defense in depth is required.

### V. Build Process Integrity (NON-NEGOTIABLE)

Source files are the single source of truth. Output files are generated artifacts.

**Requirements:**
- NEVER edit files in `/docs/` directory (GitHub Pages output)
- NEVER edit files in `/public/css/` or `/public/js/` (built CSS/JS)
- ONLY edit source files in `/src/scss/`, `/src/views/`, `/src/public/js/`, `/src/data/`
- ALL builds MUST auto-clear output directories before rebuilding
- ALL changes MUST go through the build process (`npm run build`)

**Rationale:** Manual edits to generated files will be overwritten. Single source of truth prevents drift.

### VI. CSS Architecture (MANDATORY)

All styling MUST be in SCSS source files with no inline styles in templates.

**Requirements:**
- NO inline styles in EJS templates
- NO `<style>` tags in EJS templates
- ALL styling MUST be in `/src/scss/` directory
- Custom classes SHOULD follow BEM methodology
- Bootstrap variables and mixins SHOULD be used for customization

**Rationale:** Separation of concerns improves maintainability. Centralized styling enables consistent theming.

### VII. Accessibility Standards (MANDATORY)

All user interfaces MUST meet WCAG AA accessibility standards.

**Requirements:**
- All UI components MUST meet WCAG 2.1 AA compliance
- Semantic HTML5 elements MUST be used
- ARIA labels and roles MUST be included where needed
- Color contrast MUST meet minimum ratios
- Automated accessibility testing SHOULD be added to CI

**Rationale:** Accessibility ensures the application is usable by everyone, including users with disabilities.

### VIII. Language Standards

JavaScript with modern ES6+ features is the primary language.

**Requirements:**
- JavaScript (ES6+) for all application code
- TypeScript MAY be used for specific tooling
- JSDoc comments SHOULD be used for complex function signatures
- Node.js 18+ is required as minimum runtime version

**Rationale:** Consistent language choice reduces tooling complexity. JavaScript is sufficient for this project's needs.

## Technology Stack

**Frontend:**
- Bootstrap 5.3.x for CSS framework
- SASS/SCSS for styling preprocessing
- EJS for server-side templating
- Vanilla JavaScript (ES6+) for client-side interactivity

**Backend (Development Only):**
- Express.js 5.x for local development server
- Node.js 18+ runtime

**Build & Quality:**
- Jest for testing with Supertest for API tests
- ESLint + Prettier for code quality
- SASS compiler for CSS generation
- Custom build orchestrator in `/build/build/`

**Deployment:**
- GitHub Pages (primary production target)
- Docker (optional containerized deployment)

## Development Workflow

### CI/CD Pipeline

The GitHub Actions workflow enforces quality gates:

1. **Lint & Test**: ESLint, Prettier, Jest tests with 80% coverage
2. **Security Audit**: npm audit, dependency analysis
3. **Quality Assurance**: Build validation, SEO audit
4. **Deploy**: GitHub Pages deployment (main branch only)

### Local Development

1. Edit source files ONLY (`/src/` directory)
2. Run `npm run dev` for development with hot reload
3. Run `npm run lint:fix` to auto-fix formatting
4. Run `npm test` to verify tests pass
5. Run `npm run build` to generate production output
6. Commit; CI validates before merge

## Governance

This constitution supersedes all informal practices and ad-hoc decisions.

**Amendment Process:**
- Amendments MUST be proposed with documented rationale
- Amendments MUST be approved by tech lead/maintainer
- Amendments MUST include migration plan if breaking
- Version bumps follow semantic versioning (MAJOR.MINOR.PATCH)

**Compliance:**
- All PRs MUST verify compliance with these principles
- Complexity beyond these principles MUST be justified in writing
- Use `.github/copilot-instructions.md` for runtime development guidance

**Version**: 1.0.0 | **Ratified**: 2026-01-30 | **Last Amended**: 2026-01-30
