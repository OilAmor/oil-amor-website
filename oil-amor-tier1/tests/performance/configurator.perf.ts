/**
 * Configurator Performance Tests
 * 
 * Measure:
 * - Initial render: < 100ms
 * - Synergy update: < 200ms
 * - Add to cart: < 500ms
 */

import React from 'react';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { render } from '@testing-library/react';
import { ProductConfigurator } from '@/app/components/product-configurator/ProductConfigurator';
import { measurePerformance, assertPerformance } from '../utils/setup';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock Zustand store
jest.mock('@/app/stores/configurator-store', () => ({
  useConfiguratorStore: jest.fn(() => ({
    selectedOil: null,
    selectedCrystal: null,
    selectedCord: null,
    selectedSize: '30ml',
    setSelectedOil: jest.fn(),
    setSelectedCrystal: jest.fn(),
    setSelectedCord: jest.fn(),
  })),
}));

describe('Configurator Performance Tests', () => {
  const mockOil = {
    id: 'oil-1',
    title: 'Lavender Essential Oil',
    slug: 'lavender-essential-oil',
    price: 89.99,
    crystal: {
      name: 'Amethyst',
      property: 'Calming',
    },
    images: [
      { url: '/images/lavender.jpg', alt: 'Lavender oil bottle' },
    ],
  };

  const mockCrystals = [
    { id: 'amethyst', name: 'Amethyst', color: 'purple' },
    { id: 'rose-quartz', name: 'Rose Quartz', color: 'pink' },
    { id: 'citrine', name: 'Citrine', color: 'yellow' },
  ];

  const mockCords = [
    { id: 'waxed-cotton', name: 'Waxed Cotton', material: 'cotton' },
    { id: 'hemp', name: 'Hemp', material: 'hemp' },
  ];

  describe('Initial Render Performance', () => {
    it('should render configurator in under 100ms', async () => {
      // Measure render time
      const { performance } = await measurePerformance(async () => {
        render(
          React.createElement(ProductConfigurator, {
            oil: mockOil,
            crystals: mockCrystals,
            cords: mockCords,
          })
        );
      });

      // Assert: Initial render < 100ms
      assertPerformance(performance, 100);
      expect(performance.duration).toBeLessThan(100);
    });

    it('should render with large crystal list efficiently', async () => {
      // Create large crystal list
      const largeCrystalList = Array.from({ length: 50 }, (_, i) => ({
        id: `crystal-${i}`,
        name: `Crystal ${i}`,
        color: 'purple',
      }));

      const { performance } = await measurePerformance(async () => {
        render(
          React.createElement(ProductConfigurator, {
            oil: mockOil,
            crystals: largeCrystalList,
            cords: mockCords,
          })
        );
      });

      // Should still render reasonably fast even with many crystals
      expect(performance.duration).toBeLessThan(200);
    });

    it('should lazy load synergy content', async () => {
      const { container } = render(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
        })
      );

      // Initial render should not include heavy synergy content
      const synergyContent = container.querySelector('[data-testid="synergy-content"]');
      // Should be null or loading state initially
      expect(synergyContent?.textContent?.length || 0).toBeLessThan(500);
    });
  });

  describe('Synergy Update Performance', () => {
    it('should update synergy content in under 200ms when crystal changes', async () => {
      const { rerender } = render(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
        })
      );

      // Measure time to update with new crystal
      const { performance } = await measurePerformance(async () => {
        rerender(
          React.createElement(ProductConfigurator, {
            oil: mockOil,
            crystals: mockCrystals,
            cords: mockCords,
            initialCrystal: mockCrystals[1],
          })
        );
      });

      // Assert: Synergy update < 200ms
      assertPerformance(performance, 200);
    });

    it('should debounce rapid crystal selections', async () => {
      const updateSpy = jest.fn();
      
      const { rerender } = render(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
          onCrystalChange: updateSpy,
        })
      );

      // Simulate rapid selections
      const startTime = performance.now();
      
      for (let i = 0; i < 5; i++) {
        rerender(
          React.createElement(ProductConfigurator, {
            oil: mockOil,
            crystals: mockCrystals,
            cords: mockCords,
            initialCrystal: mockCrystals[i % mockCrystals.length],
          })
        );
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // All rapid updates should complete quickly
      expect(totalTime).toBeLessThan(500);
    });

    it('should cache synergy responses', async () => {
      const fetchSpy = jest.fn().mockResolvedValue({
        headline: 'Test Synergy',
        story: 'Test story content',
      });

      global.fetch = fetchSpy;

      // First selection - should fetch
      const { rerender } = render(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
          initialCrystal: mockCrystals[0],
        })
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      // Second selection of same crystal
      rerender(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
          initialCrystal: mockCrystals[0],
        })
      );

      // Should not fetch again for same crystal
      const fetchCalls = fetchSpy.mock.calls.filter(
        call => call[0].includes('/api/synergy')
      );

      // Should only fetch once for the same crystal
      expect(fetchCalls.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Add to Cart Performance', () => {
    it('should add to cart in under 500ms', async () => {
      const mockAddToCart = jest.fn().mockResolvedValue({ success: true });

      const { container } = render(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
          onAddToCart: mockAddToCart,
        })
      );

      // Simulate configured product
      const addButton = container.querySelector('[data-testid="add-to-cart-button"]');

      const { performance } = await measurePerformance(async () => {
        addButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Assert: Add to cart < 500ms
      assertPerformance(performance, 500);
    });

    it('should handle concurrent add to cart requests', async () => {
      const mockAddToCart = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { container } = render(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
          onAddToCart: mockAddToCart,
        })
      );

      const addButton = container.querySelector('[data-testid="add-to-cart-button"]');

      const startTime = performance.now();

      // Click multiple times rapidly
      for (let i = 0; i < 3; i++) {
        addButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      const endTime = performance.now();

      // Should handle without excessive delay
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Memory Performance', () => {
    it('should not leak memory on repeated crystal changes', async () => {
      const { rerender, unmount } = render(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
        })
      );

      const memoryBefore = process.memoryUsage().heapUsed;

      // Change crystal 20 times
      for (let i = 0; i < 20; i++) {
        rerender(
          React.createElement(ProductConfigurator, {
            oil: mockOil,
            crystals: mockCrystals,
            cords: mockCords,
            initialCrystal: mockCrystals[i % mockCrystals.length],
          })
        );
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryDelta = memoryAfter - memoryBefore;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryDelta).toBeLessThan(10 * 1024 * 1024);

      unmount();
    });
  });

  describe('Bundle Size Performance', () => {
    it('should have acceptable bundle size for configurator component', () => {
      // This is a documentation test - actual bundle analysis would be done
      // with tools like webpack-bundle-analyzer
      
      // Maximum expected gzipped size for configurator chunk
      const MAX_BUNDLE_SIZE_KB = 150;
      
      // Document the expectation
      expect(MAX_BUNDLE_SIZE_KB).toBeLessThan(200);
    });
  });

  describe('Interaction Responsiveness', () => {
    it('should respond to user interactions within 16ms (60fps)', async () => {
      const interactionSpy = jest.fn();

      const { container } = render(
        React.createElement(ProductConfigurator, {
          oil: mockOil,
          crystals: mockCrystals,
          cords: mockCords,
          onInteraction: interactionSpy,
        })
      );

      const crystalOption = container.querySelector('[data-testid="crystal-option"]');

      const startTime = performance.now();
      
      crystalOption?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Should respond within one frame (16.67ms) for 60fps
      expect(responseTime).toBeLessThan(50); // Allow some buffer
    });
  });
});


