import { jest } from '@jest/globals';
import { calculateTotalPrice } from './getTotalPrice.js';

// Mock the database models
jest.mock('../models/index.js', () => ({
  Part: {
    findAll: jest.fn(),
  },
  PartOption: {
    findAll: jest.fn(),
  },
  PartDependency: {
    findAll: jest.fn(),
  },
  PriceRule: {
    findAll: jest.fn(),
  },
}));

const { Part, PriceRule } = require('../models/index.js');

describe('calculateTotalPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate total price without price rules', async () => {
    const mockParts = [
      {
        partId: 1,
        name: 'Part 1',
        options: {
          partOptionId: 1,
          name: 'Option 1',
          price: 10,
          hasStock: true
        }
      },
      {
        partId: 1,
        name: 'Part 1',
        options: {
          partOptionId: 2,
          name: 'Option 2',
          price: 20,
          hasStock: true
        }
      }
    ];

    Part.findAll.mockResolvedValueOnce(mockParts);

    const selectedOptions = [
      { partOptionId: 1 },
      { partOptionId: 2 },
    ];

    const result = await calculateTotalPrice(selectedOptions);

    expect(result.totalPrice).toBe('30.00');
  });

  it('should apply price rules to calculate total price', async () => {
    const mockParts = [
      {
        partId: 1,
        name: 'Part 1',
        options: {
          partOptionId: 1,
          name: 'Option 1',
          price: 10,
          hasStock: true
        }
      },
      {
        partId: 2,
        name: 'Part 2',
        options: {
          partOptionId: 2,
          name: 'Option 2',
          price: 20,
          hasStock: true
        }
      }
    ];

    const mockPriceRules = [
      { targetPartOptionId: 2, newPrice: 30, name: 'Discounted Option 2', partOptionId: 1 },
    ];

    Part.findAll.mockResolvedValueOnce(mockParts);
    PriceRule.findAll.mockResolvedValueOnce(mockPriceRules);

    const selectedOptions = [
      { partOptionId: 1 },
      { partOptionId: 2 },
    ];

    const result = await calculateTotalPrice(selectedOptions);

    expect(result.totalPrice).toBe('40.00');
  });
});
