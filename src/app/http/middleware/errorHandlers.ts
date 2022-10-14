// if (!res.headersSent) {
//     next(err);
//   }

// @todo: check headrs and decide if html or api error msg

// app.use((error, req, res, next) => {
//     console.log("Error Handling Middleware called")
//     console.log('Path: ', req.path)
//     console.error('Error: ', error)
   
//     if (error.type == 'redirect')
//         res.redirect('/error')
  
//      else if (error.type == 'time-out') // arbitrary condition check
//         res.status(408).send(error)
//     else
//         res.status(500).send(error)
//   })
  

// prod output

// log error 

// logic to init