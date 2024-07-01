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


in order to proceed an action by submitting form, we need to utilize the atribute "action" of the form tag.
Action will call a link on our server side
Next is defining a method with restAPI standard
ex: <form action="/post-crud" method="post">

every time we add a new link route to our website, first need to initialize it in route aka web.js
next we go to homeController aka homeController.js to actually create a function that handles this action of redirecting