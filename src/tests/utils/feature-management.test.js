/**
 * Feature Management System Tests
 * Tests for feature flags, presets, and middleware
 */

const { features, presets, isFeatureEnabled, getEnabledFeatures, generatePackageJson, generateScripts } = require('../../config/features');
const { featureMiddleware, checkFeature, getFeatureConfig } = require('../../utils/feature-middleware');

describe('Feature Management System', () => {
  describe('Feature Configuration', () => {
    test('should have core features defined', () => {
      expect(features).toBeDefined();
      expect(features.core).toBeDefined();
      expect(features.ui).toBeDefined();
      expect(features.development).toBeDefined();
      expect(features.testing).toBeDefined();
    });

    test('should have all required presets', () => {
      expect(presets).toBeDefined();
      expect(presets.minimal).toBeDefined();
      expect(presets.standard).toBeDefined();
      expect(presets.production).toBeDefined();
      expect(presets.learning).toBeDefined();
    });

    test('should have preset descriptions', () => {
      Object.values(presets).forEach(preset => {
        expect(preset.description).toBeDefined();
        expect(typeof preset.description).toBe('string');
        expect(preset.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Feature Detection', () => {
    test('should correctly identify enabled features', () => {
      expect(isFeatureEnabled('core.express')).toBe(true);
      expect(isFeatureEnabled('core.express', 'minimal')).toBe(true);
      expect(isFeatureEnabled('advanced.pwa')).toBe(false);
      expect(isFeatureEnabled('advanced.pwa', 'production')).toBe(true);
    });

    test('should handle nested feature paths', () => {
      expect(isFeatureEnabled('ui.darkMode')).toBe(true);
      expect(isFeatureEnabled('security.helmet')).toBe(true);
      expect(isFeatureEnabled('development.linting')).toBe(true);
    });

    test('should return false for non-existent features', () => {
      expect(isFeatureEnabled('nonexistent.feature')).toBe(false);
      expect(isFeatureEnabled('core.nonexistent')).toBe(false);
    });

    test('should handle invalid preset names', () => {
      expect(isFeatureEnabled('core.express', 'nonexistent')).toBe(true); // Falls back to standard
    });
  });

  describe('Feature Lists', () => {
    test('should return enabled features for presets', () => {
      const minimalFeatures = getEnabledFeatures('minimal');
      const standardFeatures = getEnabledFeatures('standard');
      const productionFeatures = getEnabledFeatures('production');

      expect(Array.isArray(minimalFeatures)).toBe(true);
      expect(Array.isArray(standardFeatures)).toBe(true);
      expect(Array.isArray(productionFeatures)).toBe(true);

      expect(minimalFeatures.length).toBeGreaterThan(0);
      expect(standardFeatures.length).toBeGreaterThan(minimalFeatures.length);
      expect(productionFeatures.length).toBeGreaterThan(standardFeatures.length);
    });

    test('should include core features in all presets', () => {
      ['minimal', 'standard', 'production', 'learning'].forEach(preset => {
        const features = getEnabledFeatures(preset);
        expect(features).toContain('core.express');
        expect(features).toContain('core.ejs');
        expect(features).toContain('core.staticFiles');
      });
    });
  });

  describe('Package Generation', () => {
    test('should generate valid package.json structure', () => {
      const pkg = generatePackageJson();
      
      expect(pkg).toBeDefined();
      expect(pkg.dependencies).toBeDefined();
      expect(pkg.devDependencies).toBeDefined();
      
      expect(typeof pkg.dependencies).toBe('object');
      expect(typeof pkg.devDependencies).toBe('object');
    });

    test('should include required dependencies', () => {
      const pkg = generatePackageJson();
      
      expect(pkg.dependencies.express).toBeDefined();
      expect(pkg.dependencies.ejs).toBeDefined();
      expect(pkg.dependencies['express-ejs-layouts']).toBeDefined();
    });

    test('should generate scripts object', () => {
      const scripts = generateScripts();
      
      expect(scripts).toBeDefined();
      expect(typeof scripts).toBe('object');
      expect(scripts.start).toBeDefined();
      expect(scripts.dev).toBeDefined();
      expect(scripts.test).toBeDefined();
    });
  });

  describe('Feature Middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = {};
      res = {
        locals: {}
      };
      next = jest.fn();
    });

    test('should add feature functions to res.locals', () => {
      const middleware = featureMiddleware('standard');
      middleware(req, res, next);

      expect(res.locals.isFeatureEnabled).toBeDefined();
      expect(res.locals.features).toBeDefined();
      expect(res.locals.enabledFeatures).toBeDefined();
      expect(res.locals.featureFlags).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    test('should add feature flags for template access', () => {
      const middleware = featureMiddleware('standard');
      middleware(req, res, next);

      expect(res.locals.featureFlags.darkMode).toBe(true);
      expect(res.locals.featureFlags.bootstrap).toBe(true);
      expect(res.locals.featureFlags.helmet).toBe(true);
      expect(res.locals.featureFlags.testing).toBe(true);
    });

    test('should handle different presets', () => {
      const minimalMiddleware = featureMiddleware('minimal');
      const productionMiddleware = featureMiddleware('production');

      minimalMiddleware(req, res, next);
      const minimalFlags = res.locals.featureFlags;

      res.locals = {}; // Reset
      productionMiddleware(req, res, next);
      const productionFlags = res.locals.featureFlags;

      expect(productionFlags.pwa).toBe(true);
      expect(minimalFlags.pwa).toBe(false);
    });
  });

  describe('Feature Utilities', () => {
    test('should check features correctly', () => {
      expect(checkFeature('core.express')).toBe(true);
      expect(checkFeature('advanced.pwa')).toBe(false);
      expect(checkFeature('advanced.pwa', 'production')).toBe(true);
    });

    test('should generate feature config', () => {
      const config = getFeatureConfig('standard');
      
      expect(config).toBeDefined();
      expect(config.preset).toBe('standard');
      expect(config.enabledFeatures).toBeDefined();
      expect(config.ui).toBeDefined();
      expect(config.security).toBeDefined();
      expect(config.development).toBeDefined();
      expect(config.advanced).toBeDefined();
    });

    test('should have consistent config structure', () => {
      const config = getFeatureConfig('production');
      
      expect(config.ui.darkMode).toBeDefined();
      expect(config.ui.bootstrap).toBeDefined();
      expect(config.security.helmet).toBeDefined();
      expect(config.security.cors).toBeDefined();
      expect(config.development.linting).toBeDefined();
      expect(config.advanced.pwa).toBeDefined();
    });
  });

  describe('Preset Consistency', () => {
    test('should have minimal features as subset of standard', () => {
      const minimalFeatures = getEnabledFeatures('minimal');
      const standardFeatures = getEnabledFeatures('standard');
      
      const minimalNotInStandard = minimalFeatures.filter(
        feature => !standardFeatures.includes(feature)
      );
      
      expect(minimalNotInStandard.length).toBe(0);
    });

    test('should have standard features as subset of production', () => {
      const standardFeatures = getEnabledFeatures('standard');
      const productionFeatures = getEnabledFeatures('production');
      
      const standardNotInProduction = standardFeatures.filter(
        feature => !productionFeatures.includes(feature)
      );
      
      expect(standardNotInProduction.length).toBe(0);
    });

    test('should have learning preset with appropriate features', () => {
      const learningFeatures = getEnabledFeatures('learning');
      const standardFeatures = getEnabledFeatures('standard');
      
      expect(learningFeatures.length).toBeGreaterThan(standardFeatures.length);
      expect(learningFeatures).toContain('development.linting');
      expect(learningFeatures).toContain('testing.coverage');
    });
  });
});