const { Temperament } = require('../db');
const DogAPI = require('../utils/axios');

const getTemperaments = async (req, res) => {
  try {
    const dbTemperaments = await Temperament.findAll();
    if (dbTemperaments.length === 0) {
      console.log('THERES NO TEMPERAMENTS IN DB, GET IT FROM API');
      try {
        const { data: Dogs } = await DogAPI.get('breeds');
        let temperaments = [];

        Dogs.forEach(dog => {
          if (!dog.temperament) return;
          if (dog.temperament.length !== 0) {
            const dogTemperaments = dog.temperament.split(', '); // de string a
            if (dogTemperaments.length > 0) {
              dogTemperaments.forEach(temp => {
                const alreadyExist = temperaments.find(t => t === temp)
                if (alreadyExist) return;
                temperaments.push(temp)
              })
            }
          }
        })

        await Promise.all(temperaments.map(t => {
          return Temperament.create({ name : t});
        }));

        const dbTemperaments = await Temperament.findAll();
        return res.status(200).json(dbTemperaments);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          error: 'GET TEMPERAMENTS ROUTE ERROR',
        });
      }
    }
    console.log('TEMPERAMENTS FROM DB');
    return res.status(200).json(dbTemperaments);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error.message
    });
  }
}

module.exports = {
  getTemperaments
}