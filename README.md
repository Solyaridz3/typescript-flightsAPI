# typescript-flightsAPI
Express flights API written in typescript.

#### Setup

1. Create .env in the root.
3. Setup JWT_SECRET in your .env, recommended value is 256-bit encryption key.
3. Setup NODE_ENV int your .env to production or development.
4. SETUP PORT in your .env.
5. SETUP MONGO_URI in your .env.
6. Configure src/config/config.json add there initial data  that consists of superusers, you can also add some flights if want to create some without HTTP requests.
7. Install dependencies.
bash
npm install
8. Build project using command below.
bash
npm build
9. Setup initial data.
bash 
npm setup
10. Then it is highly recommended to do e2e test with command below.
bash
npm test
11. If all tests are passed, you are ready to go.

#### Run server


#### Details
- app is an App class that initializes for you DB connection, Middleware, Controllers(includes Router), Error handling.
- App uses helmet and cors as security middleware, morgan as HTTP requests logger, compression package for smaller request and responses and express json and urlencoded support
- Controllers are classes and includes it's path and router
- POST and PATCH requests are validated with Joi.
- For user authentication JWT token used.
- Business logic of controllers contained in services.

#### Unit tests

- created using Jest package


#### Requests:

### Users
- GET /api/user/ get user data
- POST /api/user/register register user 
- POST /api/user/login login user
- PATCH /api/user/update update user
- DELETE /api/user/delete/:id (delete user)admin rights needed

###Flights

- GET /api/flights/ get flights
- GET /api/flights/:id get one flight
- POST /api/flights/create create flight
- UPDATE /api/flights/update/:id update flight
- DELETE /api/flights/:id delete flight