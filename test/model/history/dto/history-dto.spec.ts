import { HistoryDto } from '../../../../src/model';

describe('HistoryDto', () => {
    const startLatitudeMock = 1;
    const startLongitudeMock = 2;
    const destinationLatitudeMock = 3;
    const destinationLongitudeMock = 4;
    const totalPriceMock = 5;
    const dateMock = new Date('01.01.2000.');


    const history = {} as any;
    history.startLatitude = startLatitudeMock;
    history.startLongitude = startLongitudeMock;
    history.destinationLatitude = destinationLatitudeMock;
    history.destinationLongitude = destinationLongitudeMock;
    history.totalPrice = totalPriceMock;
    history.date = dateMock;

    const brandMock = 'brandMock';
    const firstNameMock = 'firstNameMock';
    const lastNameMock = 'lastNameMock';
    
    const vehicle = {} as any;
    vehicle.brand = brandMock;
    vehicle.firstName = firstNameMock;
    vehicle.lastName = lastNameMock;

    history.vehicle = vehicle;

    it('should create a dto from a hsitroy class', () => {
        const historyDto: HistoryDto = new HistoryDto(history);
        const expetedHistoryDto: HistoryDto = {
            startLatitude: startLatitudeMock,
            startLongitude: startLongitudeMock,
            destinationLatitude: destinationLatitudeMock,
            destinationLongitude: destinationLongitudeMock,
            totalPrice: totalPriceMock,
            date: dateMock,
            vehicle: {
                brand: brandMock,
                firstName: firstNameMock,
                lastName: lastNameMock
            }
        };

        expect(historyDto).toEqual(expetedHistoryDto);
    });
})