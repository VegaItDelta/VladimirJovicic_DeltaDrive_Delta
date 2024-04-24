import { PositionService, Position } from '../../../src/services';

describe('PositionService', () => {
  let positionService: PositionService;

  beforeEach(() => {
    positionService = new PositionService();
  });

  it('should be defined', () => {
    expect(positionService).toBeDefined();
  });

  it('should calculate distance between two points', () => {
    const point1: Position = { latitude: 37.7749, longitude: -122.4194 };
    const point2: Position = { latitude: 40.7128, longitude: -74.0060 }; 

    const expectedDistance = 4129.08616505731;

    const distance = positionService.calculateDistance(point1, point2);
    
    expect(distance).toBeCloseTo(expectedDistance, 2);
  });

  it('should handle negative latitude and longitude values', () => {
    const point1: Position = { latitude: -37.7749, longitude: -122.4194 };
    const point2: Position = { latitude: -40.7128, longitude: -74.0060 };

    const expectedDistance = 4129.08616505731;

    const distance = positionService.calculateDistance(point1, point2);
    
    expect(distance).toBeCloseTo(expectedDistance, 2);
  });
});