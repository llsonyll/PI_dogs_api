const { Breed, conn } = require("../../src/db");
const { expect } = require("chai");

const temperaments = [
  { id: 1, name: "Amistoso" },
  { id: 2, name: "Revoltoso" },
];

const newBreed = {
  name: "Henry 2",
  lifeSpan: "12 years",
  maxHeight: 2,
  maxWeight: 5,
  minHeight: 1,
  minWeight: 3,
  temperaments: ["1", "2"],
};

describe("Breed model", () => {
  before(() =>
    conn
      .sync({ force: true })
      .then(() => {
        console.log("Sincronizado");
      })
      .catch((e) => {
        console.log("Error", e);
      })
  );

  describe("Validators", () => {
    // beforeEach(() => Breed.sync({ force: true }));
    describe("name", () => {
      it("should thrown an error on non-null fields sent", async () => {
        try {
          await Breed.create({ name: "Pug" });
        } catch (error) {
          expect(error.message).to.exist;
        }
      });

      it("should work with required fields", async () => {
        try {
          await Breed.create(newBreed);
        } catch (error) {
          expect(error.message).to.be.undefined;
        }
      });
    });
  });
});
