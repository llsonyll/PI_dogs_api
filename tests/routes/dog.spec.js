/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Breed, Temperament, conn } = require("../../src/db.js");

const agent = session(app);
const newBreed = {
  name: "Henry 2",
  lifeSpan: "12 years",
  maxHeight: 2,
  maxWeight: 5,
  minHeight: 1,
  minWeight: 3,
  temperaments: ["1", "2"],
};

const temperaments = [
  { id: 1, name: "Amistoso" },
  { id: 2, name: "Revoltoso" },
];

describe("Dog routes - Breed", () => {
  before(async () => {
    await conn.sync({ force: true });
    temperaments.forEach((t) => {
      Temperament.create(t);
    });
  });

  describe("GET /dogs", () => {
    xit("should get 200", async () => {
      agent.get("/dogs").expect(200);
    });

    xit("should get 8 breeds on page 1", async () => {
      const { body } = await agent.get("/dogs?page=0");
      return expect(body.length).to.equal(8);
    });
  });

  describe("POST /dogs", () => {
    xit("should throws error on non-null fields with empty data", async () => {
      const emptyDog = {
        name: "Henry 1",
        lifeSpan: "12 years",
        maxHeight: null,
        maxWeight: 4,
        minHeight: null,
        minWeight: 3,
        temperaments: ["1", "2"],
      };

      const { statusCode } = await agent.post("/dogs").send(emptyDog);
      return expect(statusCode).to.equal(404);
    });

    xit("should create a new breed", async () => {
      const { statusCode } = await agent.post("/dogs").send(newBreed);
      expect(statusCode).to.equal(201);
    });
  });
});
