import supertest from 'supertest';
import 'dotenv/config';
import { app } from '../../src/index';
import { verifyToken } from '../../src/utils/token';
import Token from '../../src/utils/interfaces/token.interface';

let adminToken: string;
let userToken: string;

describe('/users', () => {
    test('User info without authorization error', async () => {
        await supertest(app.express).get('/api/users').expect(401, {
            status: 401,
            message: 'Unauthorized',
        });
    });

    test('Create new user.', async () => {
        const body = {
            name: 'Serhiy',
            email: 'serhious2@gmail.com',
            password: 'secret',
        };
        const response = await supertest(app.express)
            .post('/api/users/register')
            .send(body)
            .expect(201);
        const createdUser = response.body;
        expect(createdUser).toEqual({
            token: expect.any(String),
        });
        userToken = createdUser.token;
    });

    test('Login user', async () => {
        const body = {
            email: 'john@gmail.com',
            password: 'secret',
        };
        const response = await supertest(app.express)
            .post('/api/users/login')
            .send(body)
            .expect(200);
        expect(response.body).toEqual({
            token: expect.any(String),
        });
        adminToken = response.body.token;
    });

    test('Cant delete user without admin permissions', async () => {
        if (!adminToken || !userToken) throw Error('No admin or user token');
        const decoded = (await verifyToken(adminToken)) as Token;
        const response = await supertest(app.express)
            .delete(`/api/users/delete/${decoded.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(405);
        expect(response.body).toEqual({
            status: 405,
            message: 'Not allowed',
        });
    });

    test('Delete user', async () => {
        if (!adminToken || !userToken) throw Error('No admin or user token');
        const decoded = (await verifyToken(userToken)) as Token;
        const response = await supertest(app.express)
            .delete(`/api/users/delete/${decoded.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toEqual({
            deletedUser: {
                _id: expect.any(String),
                name: expect.stringMatching('Serhiy'),
                email: expect.stringMatching('serhious2@gmail.com'),
                role: expect.stringMatching('user'),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                __v: expect.any(Number),
            },
        });
    });

    test('Unable to delete not existing user', async () => {
        if (!adminToken) throw Error('No admin');
        const response = await supertest(app.express)
            .delete('/api/users/delete/123')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(400);
        expect(response.body).toEqual({
            status: 400,
            message: 'Unable to delete user or user does not exist',
        });
    });

    test('Update user', async () => {
        if (!adminToken) throw new Error('Not authorized');
        const response = await supertest(app.express)
            .patch('/api/users/update/')
            .send({ name: 'Johnson', old_password: 'secret' })
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toEqual({
            updatedUser: {
                _id: expect.any(String),
                name: expect.stringMatching('Johnson'),
                email: expect.any(String),
                role: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                __v: expect.any(Number),
            },
        });
    });
});

describe('/flights/', () => {
    let createdFLightId: string;

    test('Create new flight.', async () => {
        if (!adminToken) throw new Error('No admin token');
        const body = {
            name: 'Kyiv Tokio',
            from: 'Kyiv',
            destination: 'Tokio',
            departureDate: '20.08.2022-09:30',
            arrivalDate: '21.08.2022-01:00',
            seatsCount: 150,
        };
        const response = await supertest(app.express)
            .post('/api/flights')
            .send(body)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(201);

        expect(response.body).toEqual({
            flight: {
                _id: expect.any(String),
                name: expect.stringMatching('Kyiv Tokio'),
                from: expect.stringMatching('Kyiv'),
                destination: expect.stringMatching('Tokio'),
                departureDate: expect.stringMatching('20.08.2022-09:30'),
                arrivalDate: expect.stringMatching('21.08.2022-01:00'),
                transplants: [],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                seatsCount: 150,
                __v: expect.any(Number),
            },
        });

        createdFLightId = response.body.flight._id;
    });
    test('Update existing flight', async () => {
        if (!adminToken) throw new Error('No admin token');
        if (!createdFLightId) throw new Error('No flight id');

        const body = {
            name: 'Kyiv Sydney',
            from: 'Kyiv',
            destination: 'Sydney',
            departureDate: '20.08.2022-09:30',
            arrivalDate: '22.08.2022-01:00',
            seatsCount: 160,
        };

        const response = await supertest(app.express)
            .patch(`/api/flights/update/${createdFLightId}`)
            .send(body)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(response.body).toEqual({
            updatedFlight: {
                _id: expect.any(String),
                name: expect.stringMatching('Kyiv Sydney'),
                from: expect.stringMatching('Kyiv'),
                destination: expect.stringMatching('Sydney'),
                departureDate: expect.stringMatching('20.08.2022-09:30'),
                arrivalDate: expect.stringMatching('22.08.2022-01:00'),
                transplants: [],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                seatsCount: 160,
                __v: expect.any(Number),
            },
        });
    });

    const keys = [
        '_id',
        'name',
        'from',
        'destination',
        'transplants',
        'departureDate',
        'arrivalDate',
        'seatsCount',
        'createdAt',
        'updatedAt',
        '__v',
    ];

    test('Show flights', async () => {
        const response = await supertest(app.express)
            .get('/api/flights/')
            .expect(200);
        const data = response.body.flights;

        expect(Object.keys(data[0]).sort()).toEqual(keys.sort());
        //Here i want to check if response.body.flights equals an array of Flight type
    });

    test('Show one flight', async () => {
        const response = await supertest(app.express)
            .get(`/api/flights/${createdFLightId}`)
            .expect(200);
        const data = response.body.flight;
        expect(Object.keys(data).sort()).toEqual(keys.sort());
    });

    test('Delete flight', async () => {
        if (!adminToken) throw new Error('No admin token');
        if (!createdFLightId) throw new Error('No created flight id');
        console.log(createdFLightId);
        const response = await supertest(app.express)
            .delete(`/api/flights/${createdFLightId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        const data = response.body.deletedFlight;
        expect(Object.keys(data).sort()).toEqual(keys.sort());
    });
});
