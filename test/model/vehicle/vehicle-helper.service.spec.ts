import { VehicleHelperService } from "../../../src/model";

describe('VehicleHelperService', () => {
  const service = new VehicleHelperService();

  describe('cutOffCurrencies', () => {
    it('should return the same json when no key is provided', () => {
      const jsonInput = {
        key1: 'value1',
      };

      const expectedJson = {
        key1: 'value1',
      };
      const actualJson = service.cutOffCurrencies(jsonInput);
      expect(expectedJson).toEqual(actualJson);
    });
    it('should return the same json when no existing key is provided', () => {
      const jsonInput = {
        key1: 'value1',
      };

      const expectedJson = {
        key1: 'value1',
      };
      const actualJson = service.cutOffCurrencies(jsonInput, 'key2');
      expect(expectedJson).toEqual(actualJson);
    });
    it('should return the same json when the value has less than 3 characters', () => {
      const jsonInput = {
        key1: 'ab',
      };

      const expectedJson = {
        key1: 'ab',
      };
      const actualJson = service.cutOffCurrencies(jsonInput, 'key1');
      expect(expectedJson).toEqual(actualJson);
    });
    it('should return the json with cuttoff values', () => {
      const jsonInput = {
        key1: 'value_test',
      };

      const expectedJson = {
        key1: 'value_t',
      };
      const actualJson = service.cutOffCurrencies(jsonInput, 'key1');
      expect(expectedJson).toEqual(actualJson);
    });

    it('should return the json with cuttoff values when multiple keys are provided', () => {
      const jsonInput = {
        key1: 'value_test',
        key2: 'another_value',
      };

      const expectedJson = {
        key1: 'value_t',
        key2: 'another_va',
      };
      const actualJson = service.cutOffCurrencies(jsonInput, 'key1', 'key2');
      expect(expectedJson).toEqual(actualJson);
    });

    it('should return only the cuttoff values with provided keys', () => {
      const jsonInput = {
        key1: 'value_test',
        key2: 'another_value',
      };

      const expectedJson = {
        key1: 'value_t',
        key2: 'another_value',
      };
      const actualJson = service.cutOffCurrencies(jsonInput, 'key1');
      expect(expectedJson).toEqual(actualJson);
    });
  });
});
