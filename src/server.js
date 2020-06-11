const express = require("express")
const server = express()

const db = require("./database/db.js")

server.use(express.static("public"))

server.use(express.urlencoded({ extended:true }))

const nunjucks = require("nunjucks")
const { response } = require("express")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})

server.get("/", (require, response) => {
  return response.render("index.html")
})





server.get("/create-point", (require, response) => {

 // console.log (require.query)

  return response.render("create-point.html")
})

server.post("/savepoint", (require, response) => {
 
  //console.log (require.body)

  const query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items
    ) VALUES (?,?,?,?,?,?,?);
  `

  const values = [
    require.body.image,
    require.body.name,
    require.body.address,
    require.body.address2,
    require.body.state,
    require.body.city,
    require.body.items
  ]

  function afterInsertData(err) {
    if(err) {
      console.log(err)
    return response.send("Erro no cadastro")
    }

    console.log("Cadastrado com sucesso")
    console.log(this)

    return response.render("create-point.html", {saved: true})
  }

   db.run(query,values,afterInsertData)
  


})







server.get("/search", (require, response) => {

  const search = require.query.search

  if(search == "") {
    return response.render("search-results.html", { total: 0 })
  }




  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
      return console.log(err)
    }

    const total = rows.length

    return response.render("search-results.html", { places: rows, total:total })
  })
})
server.listen(3000)