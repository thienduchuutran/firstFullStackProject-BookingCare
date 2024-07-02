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
next we go to homeController aka homeController.js to actually create a function that handles this action of redirecting (aka creating a new user in this case)
 
***To follow MVC model, we actually don't create the function that handles the action of creating a new user in homeController, but homeController will call a function that
actually creates a new user from services (aka CRUDServices at this moment). The services files will actually have these functions of CRUD actions***
***At the same time, we pass req.body aka all the info we got from the form of user input into the function called from services. That will be the data

===> homeController is like a boss now, just directing the flow of data. Services is the one who actually handles the data


Using Promise to make sure the function always returns us a result!!!

To save data to database, we need to know which table we wanna save into:
1. import db into te file that is handling data (in this case we're creating a new user => need user table)
2. using the function "create()". This function = 'INSERT INTO USER ..."
    ex:
    await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1'? true : false,
                roleId: data.roleId,
            })


To exit a promise we need resolve