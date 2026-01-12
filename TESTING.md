# Testing Plan for adaptive-css

## Current Status

**⚠️ No automated tests currently exist**

This document tracks the implementation of a comprehensive test suite for the adaptive-css library.

## Test Coverage Goals

### Unit Tests

#### Color Calculations
- [ ] Verify AA level produces 4.5:1 contrast ratio
- [ ] Verify AAA level produces 7:1 contrast ratio
- [ ] Test foreground selection (black vs white)
- [ ] Validate contrast calculation formula (WCAG 2.1)
- [ ] Test relative luminance calculations

#### Palette Generation
- [ ] Validate swatch count (~50 swatches)
- [ ] Verify LAB color space uniformity
- [ ] Test saturation preservation at extremes
- [ ] Validate palette ordering (light to dark)
- [ ] Test color parsing (valid hex inputs)

#### Configuration
- [ ] Test default config merging
- [ ] Validate required fields (neutral, accent)
- [ ] Test prefix handling
- [ ] Test dark mode selector options
- [ ] Verify boolean flags work correctly

#### Error Handling
- [ ] Invalid hex color strings
- [ ] Missing required palettes
- [ ] Palette not found errors
- [ ] Invalid contrast levels
- [ ] Malformed configuration objects

### Integration Tests

#### CSS Output
- [ ] Verify all semantic tokens are present
- [ ] Validate CSS syntax is correct
- [ ] Test dark mode selectors are generated
- [ ] Verify utility class generation
- [ ] Test palette variables output
- [ ] Validate system preference media query

#### Semantic Token Selection
- [ ] Verify background indices (light mode)
- [ ] Verify background indices (dark mode)
- [ ] Test accent color contrast against backgrounds
- [ ] Validate hover/active state calculations
- [ ] Test additional palette tokens (success, warning, error, info)

#### CLI
- [ ] Test config file loading
- [ ] Test inline color arguments
- [ ] Verify output file writing
- [ ] Test --init flag
- [ ] Test --help output
- [ ] Validate error messages

### Edge Cases

#### Boundary Conditions
- [ ] Palettes with < 11 swatches
- [ ] Palettes with > 100 swatches
- [ ] Index calculations at palette boundaries
- [ ] Empty palette handling

#### Color Edge Cases
- [ ] Pure black (#000000)
- [ ] Pure white (#FFFFFF)
- [ ] Gray colors (no saturation)
- [ ] Highly saturated colors
- [ ] Colors at LAB extremes

#### Configuration Edge Cases
- [ ] Minimal config (only neutral + accent)
- [ ] Maximum config (6+ palettes, all options)
- [ ] Empty prefix
- [ ] Long prefix (50+ characters)
- [ ] Special characters in palette names

### Visual Regression Tests

#### Screenshot Comparison
- [ ] Light mode rendering in demo.html
- [ ] Dark mode rendering in demo.html
- [ ] System preference switching
- [ ] Theme toggle functionality
- [ ] Utility class applications

## Testing Framework

**Recommended:** Vitest
- Fast TypeScript support
- Compatible with ESM modules
- Good VS Code integration
- Built-in coverage reporting

**Alternatives considered:**
- Jest (requires additional config for ESM)
- Mocha + Chai (less TypeScript-friendly)

## Setup Tasks

- [ ] Install testing dependencies (vitest, @vitest/ui)
- [ ] Add test scripts to package.json
- [ ] Configure vitest.config.ts
- [ ] Set up test file structure
- [ ] Add coverage reporting
- [ ] Configure CI/CD integration

## Test File Structure

```
tests/
├── unit/
│   ├── generator.test.ts
│   ├── types.test.ts
│   └── color-calculations.test.ts
├── integration/
│   ├── css-output.test.ts
│   ├── cli.test.ts
│   └── semantic-tokens.test.ts
├── edge-cases/
│   ├── invalid-inputs.test.ts
│   ├── boundary-conditions.test.ts
│   └── color-extremes.test.ts
└── fixtures/
    ├── configs/
    └── expected-outputs/
```

## Success Criteria

- ✅ All critical contrast calculations verified
- ✅ CSS output structure validated
- ✅ Error handling tested
- ✅ Edge cases covered
- ✅ CI/CD pipeline passing
- ✅ >80% code coverage
- ✅ Documentation updated with testing info

## Timeline

**Phase 1:** Unit tests for color calculations (Priority: Critical)
**Phase 2:** Integration tests for CSS generation (Priority: High)
**Phase 3:** CLI tests (Priority: Medium)
**Phase 4:** Edge cases and visual regression (Priority: Low)

## References

- Review document: `.claude/plans/transient-dancing-cherny.md`
- WCAG 2.1 Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Vitest docs: https://vitest.dev/
