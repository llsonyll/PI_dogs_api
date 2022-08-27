const { Breed, Temperament, Op } = require("../db.js");
const DogAPI = require("../utils/axios");
const LIMIT_DOGS = 8;

const getDogBreed = async (req, res) => {
  const { name, page = 0 } = req.query;

  try {
    if (!name) {
      // Retornar listado de razas de perro
      const dbBreeds = await Breed.findAll({
        offset: page === 0 ? 0 : page * LIMIT_DOGS,
        limit: LIMIT_DOGS,
        include: Temperament,
      });

      if (dbBreeds.length === 0) {
        const { data: breeds } = await DogAPI.get(
          `breeds?limit=${LIMIT_DOGS}&page=${page}`
        );
        return res.status(200).json(breeds);
      } else if (dbBreeds.length === LIMIT_DOGS) {
        return res.status(200).json(
          dbBreeds.map((breed) => {
            return {
              name: breed.name,
              id: breed.id,
              life_span: breed.lifeSpan,
              temperament: breed.temperaments
                .map((temp) => temp.name)
                .join(", "),
              height: {
                metric: `${breed.minHeight}-${breed.maxHeight}`,
              },
              weight: {
                metric: `${breed.minWeight}-${breed.maxWeight}`,
              },
            };
          })
        );
      } else {
        // si el numero de razas en la db no es 8 sino menor se completa con el resto
        const numberToComplete = LIMIT_DOGS - dbBreeds.length;
        const { data: breeds } = await DogAPI.get(
          `breeds?limit=${numberToComplete}&page=0`
        );
        return res.status(200).json(
          dbBreeds
            .map((breed) => {
              return {
                name: breed.name,
                id: breed.id,
                life_span: breed.lifeSpan,
                temperament: breed.temperaments
                  .map((temp) => temp.name)
                  .join(", "),
                height: {
                  metric: `${breed.minHeight}-${breed.maxHeight}`,
                },
                weight: {
                  metric: `${breed.minWeight}-${breed.maxWeight}`,
                },
              };
            })
            .concat(breeds)
        );
      }
    }

    const dbBreeds = await Breed.findAll({
      where: {
        name: { [Op.iRegexp]: name },
      },
      include: Temperament,
    });

    const { data: breeds } = await DogAPI.get(`breeds/search?q=${name}`);
    return res.status(200).json(
      dbBreeds
        .map((breed) => {
          return {
            name: breed.name,
            id: breed.id,
            life_span: breed.lifeSpan,
            temperament: breed.temperaments.map((temp) => temp.name).join(", "),
            height: {
              metric: `${breed.minHeight}-${breed.maxHeight}`,
            },
            weight: {
              metric: `${breed.minWeight}-${breed.maxWeight}`,
            },
          };
        })
        .concat(breeds)
    );

    // if (dbBreeds.length === 0) {
    //   const { data: breeds } = await DogAPI.get(`breeds/search?q=${name}`);
    //   return res.status(200).json(breeds);
    // } else if (dbBreeds.length === LIMIT_DOGS) {
    //   return res.status(200).json(
    //     dbBreeds.map((breed) => {
    //       return {
    //         name: breed.name,
    //         id: breed.id,
    //         life_span: breed.lifeSpan,
    //         temperament: breed.temperaments.map((temp) => temp.name).join(", "),
    //         height: {
    //           metric: `${breed.minHeight}-${breed.maxHeight}`,
    //         },
    //         weight: {
    //           metric: `${breed.minWeight}-${breed.maxWeight}`,
    //         },
    //       };
    //     })
    //   );
    // } else {
    //   const { data: breeds } = await DogAPI.get(`breeds/search?q=${name}`);
    //   return res.status(200).json(
    //     dbBreeds
    //       .map((breed) => {
    //         return {
    //           name: breed.name,
    //           id: breed.id,
    //           life_span: breed.lifeSpan,
    //           temperament: breed.temperaments
    //             .map((temp) => temp.name)
    //             .join(", "),
    //           height: {
    //             metric: `${breed.minHeight}-${breed.maxHeight}`,
    //           },
    //           weight: {
    //             metric: `${breed.minWeight}-${breed.maxWeight}`,
    //           },
    //         };
    //       })
    //       .concat(breeds)
    //   );
    // }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const getBreedById = async (req, res) => {
  const { id } = req.params;
  const { fromDogAPI = false } = req.query;

  if (!id) {
    return res.status(404).send("ID is required, not provided");
  }

  try {
    if (fromDogAPI === "true") {
      const { data } = await DogAPI.get(`images/search?breed_id=${id}`);
      if (!data[0] || !data[0].breeds[0]) {
        return res
          .status(404)
          .send("ID provided does not belong to any existing breed");
      }
      return res.status(200).json({
        ...data[0].breeds[0],
        url: data[0].url,
      });
    } else {
      const breed = await Breed.findByPk(id, { include: Temperament });
      if (!breed)
        return res
          .status(404)
          .send("ID provided does not belong to any existing breed on DB");
      return res.status(200).json({
        name: breed.name,
        id: breed.id,
        life_span: breed.lifeSpan,
        temperament: breed.temperaments.map((temp) => temp.name).join(", "),
        height: {
          metric: `${breed.minHeight}-${breed.maxHeight}`,
        },
        weight: {
          metric: `${breed.minWeight}-${breed.maxWeight}`,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong, try it later");
  }
};

const createDogBreed = async (req, res) => {
  const {
    name,
    maxHeight,
    minHeight,
    maxWeight,
    minWeight,
    lifeSpan,
    temperaments,
  } = req.body;

  console.log(req.body);

  if (!name || !maxHeight | !minHeight | !maxWeight | !minWeight) {
    return res
      .status(404)
      .send(
        `CREATE DOG BREED INFO NEEDED: name(${!!name}), height(min-${!!minHeight} max-${!!maxHeight}) and weight(min-${!!maxWeight} max-${!!minWeight}))`
      );
  }

  try {
    const newBreed = await Breed.create({
      name,
      maxHeight,
      minHeight,
      maxWeight,
      minWeight,
      lifeSpan,
    });

    if (temperaments && temperaments.length > 0) {
      await newBreed.setTemperaments(temperaments);
    }

    return res.status(201).json(newBreed);
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

module.exports = {
  getDogBreed,
  getBreedById,
  createDogBreed,
};
