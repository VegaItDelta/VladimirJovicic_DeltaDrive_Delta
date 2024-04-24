import { ReviewDto } from "../../../../src/model/review";

describe('ReviewDto', () => {
    const uuidMock = 'uuid-mock';
    const dateOfRideMock = new Date('01.02.1999.');
    const priceMock = 3;
    const rateMock = 4;

    const review = {} as any;
    review.uuid = uuidMock;
    review.dateOfRide = dateOfRideMock;
    review.price = priceMock;
    review.rate = rateMock;

    const vehicleUuidMock = 'vehicleUuidMock';
    const brandMock = 'brandMock';
    const firstNameMock = 'firstNameMock';
    const lastNameMock = 'lastNameMock';
    
    const vehicle = {} as any;
    vehicle.uuid = vehicleUuidMock;
    vehicle.brand = brandMock;
    vehicle.firstName = firstNameMock;
    vehicle.lastName = lastNameMock;

    review.vehicle = vehicle;


    it('should create a dto from a review class without comment', () => {
        const reviewDto: ReviewDto = new ReviewDto(review);
        const expetedReviewDto: ReviewDto = {
            uuid: uuidMock,
            dateOfRide: dateOfRideMock,
            price: priceMock,
            rate: rateMock,
            vehicle: {
                brand: brandMock,
                firstName: firstNameMock,
                lastName: lastNameMock, 
                vehicleId: vehicleUuidMock
            }   
        };

        expect(reviewDto).toEqual(expetedReviewDto);
    });

    it('should create a dto from a review class with comment', () => {
        const mockComment = 'mockComment';
        review.comment = mockComment
        const reviewDto: ReviewDto = new ReviewDto(review);
        const expetedReviewDto: ReviewDto = {
            uuid: uuidMock,
            dateOfRide: dateOfRideMock,
            price: priceMock,
            rate: rateMock,
            comment: mockComment,
            vehicle: {
                brand: brandMock,
                firstName: firstNameMock,
                lastName: lastNameMock, 
                vehicleId: vehicleUuidMock
            }   
        };

        expect(reviewDto).toEqual(expetedReviewDto);
    });
})