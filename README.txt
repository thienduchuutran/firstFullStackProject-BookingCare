migations are to edit database (create tables, drop tables, etc)

models are basically all the tables themselves in our project

return queryInterface.bulkInsert('Users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'example@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
---> bulkInsert is to insert multiple records at once (those records could be read from a file for example) 