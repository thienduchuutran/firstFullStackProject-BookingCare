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

In order to pass data from a functioning file to file view, we need to include the param data after a comma in the res.render() in homeController
ex:
let díplayGetCRUD = async(req, res) => {
    let data = await CRUDServices.getAllUser()
    console.log(data)
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}


In order to get an exact element by clicking into it:
<a href="/edit-crud?id= <%=dataTable[i].id%>" class="btn-edit" type="button">Edit</a>

file userController.js in folder homeController now plays a role as a function returning API to connect BE and FE, so it only return JSON object, not 
rendering any view
ex:
let handleLogin = (req, res) => {
    return res.status(200).json({
        message: 'hello wolre'
    })
}


how to attach info as param from reactJS (FE) to nodejs (BE) aka into file userController



IN ORDER TO write API to get all user info so the react side can get the info:
create a new route in web.js: 
    router.get('/api/get-all-user', userController.handlGetAllUsers);

next create in userController:
let handleGetAllUsers = async (req, res) => {
    let users = await userService.getALlUsers()
}

then in userService.js create function that uses findOne and findAll in database according to id
ALSO can't pass the password to client side
====>             if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }
                })
            }

To dynamically load data from database:




TO JOIN TABLES:
