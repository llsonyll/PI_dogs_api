/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Temperament, conn } = require("../../src/db.js");

const agent = session(app);

describe("Temperament route", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );

  describe("GET /temperaments", () => {
    xit("should get 200", async () => {
      const { statusCode } = await agent.get("/temperaments");
      return expect(statusCode).to.equal(200);
    });

    // it("GET /temperaments should get 124 DogAPI temperaments", async () => {
    //   const { body } = await agent.get("/temperaments");
    //   return expect(body.length).to.equal(124);
    // });
  });
});
