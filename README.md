
## Description

Delta Drive is an application designed to booking of vehicles for passengers, enabling them to quickly and easily reach their desired destinations. This README provides an overview of the application's behavior, functionalities, and requirements for testing and implementation.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

```
## Database
Download and install MongoDB from the following link
https://www.mongodb.com/try/download/community

Change the database default port settings in either one of two ways:
 1) In the "database.module.ts" file change the port number
 2) Change the MongoDb config in your file system:
  - The MongoDB configuration file is usually named "mongod.conf"
  - Depending on your operating system and how MongoDB was installed, the location of this file may vary. Common locations include /etc/mongod.conf for Linux systems and C:\Program Files\MongoDB\Server\<version>\bin\mongod.cfg for Windows systems.
  - Open the mongod.conf file in a text editor
  - Look for the net section in the configuration file. If it doesn't exist, you can add it at the end of the file.
  - Within the net section, you'll find a line like port: 27017. This specifies the default MongoDB port.
  - Change the port number. The default port number for this app is 12050
  - Save the changes you made to the configuration file.
  - After changing the port in the configuration file, you need to restart the MongoDB service for the changes to take effect.
  - On Linux systems, you can typically restart MongoDB using a command like sudo systemctl restart mongod.
  - On Windows systems, you can restart the MongoDB service through the Services panel. Press Win + R, then type services.msc, and look for the MongoDB service. Right-click on it and select "Restart."

### CSV File
Make sure to pay attention the path in the ```import-vehicle.service.ts``` file. It's set that the .csv file should be saved into the folder ```vehicle_data``` on the same level as the ```src``` folder.

After running the application the data will be populated on an empty database schema. The schema itself will be created automatically.

### Application cache
Due to the big number of drivers, a cache service is implemented that handles the driver fetching and booking status. It saves the data in the database only after the ride is finished and updates the cache.

Each time the application is started the cache gets refreshed with the vehicles from the database.


## Authentification
Each endpoint is guarded with an Authentification Interceptor that prevents non authentificated users to access endpoints. The only exceptions are LogIn and Register. These endpoints are guarded with an NonAuthentification Interceptor meaning that logged users can't acces the login and register functions.

### Registration
To get started you need to register with endpoint POST ```localhost:3000/delta-drive/passenger/register```

Data for registration
```
{
	"email": "jon.doe@gmail.com",
    "password": "JonDoePassword",
    "firstName": "Jon",
    "lastName": "Doe",
    "datOfBirth": "11.12.1972"
}
```
If the email is not unique or not properly formated the system will return an error.

Passwords are save encrypted in the database.

### Login

After registration you can login with POST ```localhost:3000/delta-drive/passenger/login```
```
{
	"email": "jon.doe@gmail.com",
    "password": "JonDoePassword",
}
```
If the email or password are wrong or you are already logged in the system will return an error.

The password is encrypted and it compares the hashed instead of the raw passwords.

### Logout

For logging out you call POST ```localhost:3000/delta-drive/passenger/logout```

## Booking
There are a few simple steps to book a vehicle.
### Finding the closest vehicles
For finsing the closest vehicles near you call GET ```localhost:3000/delta-drive/vehicle/get-closest-vehicles ``` with request parameters that represent location in terms of latitude and longitude.

These parameters are :
- ``` passenger-latitude ```  - the user latitude
- ``` passenger-longitude ``` - the user longitude
- ``` destination-latitude ``` - the destination latitude
- ``` destination-longitude ``` - the destination longitude


Example: ``` localhost:3000/delta-drive/vehicle/get-closest-vehicles?passenger-latitude=41&passenger-longitude=12&destination-latitude=41.5&destination-longitude=12.5 ``` will return 10 closes vehicles based on the passenger location. Alongside with the vehicle information you will get reviews from prevoius passengers and the average rate as well as the price. The price is depends on the price per KM of the driver, the destination and the starting price of the driver.

Alongside the data you will get the ```uuid``` of the driver that you can book a ride.

```
"vehicleDistances": [
        {
            "vehicle": {
                "_id": "66277a592cd30f0b8a0a0381",
                "uuid": "5c4190c0-0e29-446a-9d92-7bee7408dace",
                "brand": "INFINITI",
                "firstName": "Reina",
                "lastName": "Charles",
                "latitude": 41.5,
                "longitude": 12.5,
                "startPrice": 6.7758896870106335,
                "pricePerKM": 1.2821298494290168,
                "booked": false,
                "__v": 0
            },
            "distanceToDriver": 69.55795219971554,
            "price": 95.95821646742267,
            "reviews": [
                {
                    "rate": 4,
                    "comment": "it was okay..."
                },
                {
                    "rate": 5,
                    "comment": "very nice :)"
                }
            ],
            "averageRating": 4.5
        },
```

### Booking a ride
After you deceided which driver you want to take you call the GET ``` localhost:3000/delta-drive/vehicle/book-vehicle ``` endpoint to book it. You need to provide the locations and the driver ``` uuid ```.

``` localhost:3000/delta-drive/vehicle/book-vehicle?passenger-latitude=41&passenger-longitude=12&destination-latitude=41.5&destination-longitude=12.5&uuid=5c4190c0-0e29-446a-9d92-7bee7408dace```

Keep in mind that the ``` uuid ``` in the request parameters of the url is the same as the one from the prevoius ```vehicleDistances```.

After the ``` book-vehicle ``` endpoint is called the ride will be book. For testing purpos there is a 25% chance of the driver to decline the ride. If he does, he will provide a reason. You can try again.

While the ride is taking place you will get an update of the position and the distance left to the passenger location and as well the distance left to the destination.
```
┌───────────────────┬────────────────────────┐
│      (index)      │         Values         │
├───────────────────┼────────────────────────┤
│     Passenger     │ 'jon.doe@yahoo.com'    │
│      Driver       │    'Reina Charles'     │
│       Brand       │       'INFINITI'       │
│ Current latitude  │   41.166666666666664   │
│ Current longitude │   12.499999999999998   │
│   Distance left   │    69.55795219971554   │
└───────────────────┴────────────────────────┘
```

If a driver is book (someone bookend just before) a warning will be returned 
```
{
    "message": "Vehicle already bookend"
}
```

After the ride is finished the passenger will get an option to review the vehicle as well as a preview this ride in the history section.

#### Behind the scenes of the live update of the location
A queueing systems is implemented to handle tasks in parallel. After booking the vehicle and some other data is added to the queue to process. This makes it possible to handle multiple rides from multiple users at once.

## History
By quering GET ``` localhost:3000/delta-drive/history ``` the user will get a preview of all the rides that he took. This includes the start and destionation location, the total price, the date of the ride and basic information about the driver.

```
"data": [
            {
                "startLatitude": 41.666666666666664,
                "startLongitude": 12.666666666666666,
                "destinationLatitude": 41.5,
                "destinationLongitude": 12.5,
                "totalPrice": 130.5902606166027,
                "date": "2024-04-23T20:12:16.281Z",
                "vehicle": {
                    "brand": "MAZDA",
                    "firstName": "Graeme",
                    "lastName": "Classes"
                }
            },
            {
            "startLatitude": 41.666666666666664,
            "startLongitude": 12.666666666666666,
            "destinationLatitude": 41.5,
            "destinationLongitude": 12.5,
            "totalPrice": 95.95821646742267,
            "date": "2024-04-23T21:45:27.548Z",
            "vehicle": {
                "brand": "INFINITI",
                "firstName": "Reina",
                "lastName": "Charles"
            }
        }
    ]
```

## Reviews
After a ride the user gets an option to review the driver. By quering GET``` localhost:3000/delta-drive/reviews ``` the user gets two arrays: ```completed``` and ```pending```.

```
"data": {
        "completed": [
            {
                "uuid": "2af49458-e355-4186-8c5d-44a11a12fe1e",
                "dateOfRide": "2024-04-23T19:53:52.161Z",
                "price": 120.7680088392875,
                "rate": 4,
                "comment": "It was okay",
                "vehicle": {
                    "brand": "Ferrari",
                    "firstName": "French",
                    "lastName": "Jonhatan",
                    "vehicleId": "a362922d-3ae6-4227-8f78-11ebdedd127d"
                }
            },
        ],
        "pending": [
            {
                "uuid": "a64dde5d-3ed7-45e7-8db8-bfb13a243c76",
                "dateOfRide": "2024-04-23T19:53:55.648Z",
                "price": 120.7680088392875,
                "vehicle": {
                    "brand": "Ferrari",
                    "firstName": "French",
                    "lastName": "Jonhatan",
                    "vehicleId": "a362922d-3ae6-4227-8f78-11ebdedd127d"
                }
            }
        ]
    }
```

### Completed reviews
The completed reviews are reviews the the user has already reviewed and gave his rate (1 - 5) an an optional comment. These reviews appear in the driver review section.

### Pending reviews
The pending reviews are reviews that the user still has not looked into and completed. These reviews will not appear in the vehicle review section until the user completes them.

To complete a review call PUT ``` localhost:3000/delta-drive/reviews ``` with the id of the review.

Example:
``` localhost:3000/delta-drive/reviews/a64dde5d-3ed7-45e7-8db8-bfb13a243c76 ```
```
{
    "rate": 5,
    "comment": "The ride was nice!!!!"
}
```

or

```
{
    "rate": 5
}
```

After requering the GET``` localhost:3000/delta-drive/reviews ```endoint the previously pending review will appear in the completed review array and it will appear in the driver's review section.

Note: A user can't review a ride twice. If he would try a warning would be returned:
```
{
    "message": "You have already completed this review!"
}
```
