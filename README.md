# Test DM

## Test

```
$ npm i
$ npm test
$ npm run test:e2e
```

## Running the Project

```
$ docker-compose up -d
```

Then add a manufacturer with ID = 1 manually.

## CRUD

```
$ curl -d '{"manufacturer":1, "price":100.01, "owners":["Smith", "Wesson"]}' -H "Content-Type: application/json" -X POST http://localhost:3001/cars
```

```
$ curl -X GET http://localhost:3001/cars
```

```
$ curl -X GET http://localhost:3001/cars/1
```

```
$ curl -X GET http://localhost:3001/cars/1/manufacturer
```

```
$ curl -d '{"price":200.01}' -H "Content-Type: application/json" -X PUT http://localhost:3001/cars/1
```

```
$ curl -X DELETE http://localhost:3001/cars/1
```

## Jobs

```
$ curl -X GET http://localhost:3001/cars/jobs/owners
```

```
$ curl -X GET http://localhost:3001/cars/jobs/discounts
```
