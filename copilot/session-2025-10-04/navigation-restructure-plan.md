# Navigation Restructure Plan

## Current Navigation Issues

- Too many top-level items (8 total including Home)
- No logical grouping
- Cluttered appearance on smaller screens
- Related items scattered across navigation

## Proposed Navigation Structure

### 1. **Home** (standalone)

- Keep as main brand/home link

### 2. **Documentation** (dropdown)

- Getting Started
- GitHub Pages (deployment guide)

### 3. **Components** (dropdown)

- Components (basic components)
- Advanced Components
- Data Tables

### 4. **Community** (dropdown)

- Community & Contributing
- (Future: Changelog, Roadmap, etc.)

### 5. **Theme Toggle** (standalone)

- Keep as current toggle

## Benefits

- Reduces top-nav from 8 items to 4 main groups
- Logical grouping by function
- Cleaner mobile experience
- Room for future expansion within groups
- Maintains all current functionality

## Implementation Plan

1. Update layout.ejs to support dropdown navigation
2. Add necessary Bootstrap dropdown JavaScript
3. Update SCSS for custom dropdown styling
4. Test responsive behavior
5. Ensure accessibility compliance
