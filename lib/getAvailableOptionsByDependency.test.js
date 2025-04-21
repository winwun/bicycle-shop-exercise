import { jest } from '@jest/globals';
import { getAvailableOptionsByDependency } from './getAvailableOptionsByDependency.js';

// Mock the database models
jest.mock('../models/index.js', () => ({
  Part: {
    findAll: jest.fn(),
  },
  PartDependency: {
    findAll: jest.fn(),
  },
}));

const { Part, PartDependency } = require('../models/index.js');

describe('getAvailableOptionsByDependency', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all parts with options when no options are selected', async () => {
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

    const result = await getAvailableOptionsByDependency([]);

    expect(result).toEqual([
      {
        'partId': 1,
        'name': 'Part 1',
        'options': [
          {
            'partOptionId': 1,
            'name': 'Option 1',
            'price': 10,
            'hasStock': true
          },
          {
            'partOptionId': 2,
            'name': 'Option 2',
            'price': 20,
            'hasStock': true
          }
        ]
      }
    ]);
  });

  it('should filter options based on dependencies', async () => {
    const mockParts = [
      {
        partId: 1,
        name: 'Part 2',
        options: {
          partOptionId: 1,
          name: 'Option 1',
          price: 10,
          hasStock: true
        }
      },
      {
        partId: 1,
        name: 'Part 2',
        options: {
          partOptionId: 2,
          name: 'Option 2',
          price: 20,
          hasStock: true
        }
      }
    ];

    const mockDependencies = [
      { partDependencyId: 1, partOptionId: 1, targetPartOptionId: 2, name: 'Dependency 1', type: 'exclude' },
    ];

    Part.findAll.mockResolvedValueOnce(mockParts);
    PartDependency.findAll.mockResolvedValueOnce(mockDependencies);

    const selectedOptions = [{ partOptionId: 1 }];
    const result = await getAvailableOptionsByDependency(selectedOptions);

    expect(result).toEqual([
      {
        partId: 1,
        name: 'Part 2',
        options: [
          { partOptionId: 1, name: 'Option 1', price: 10, hasStock: true },
        ],
      },
    ]);
  });

  it('should return an empty array when no parts are found', async () => {
    Part.findAll.mockResolvedValueOnce([]);

    const result = await getAvailableOptionsByDependency([]);

    expect(result).toEqual([]);
  });
});
