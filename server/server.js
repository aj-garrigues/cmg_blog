let express  = require('express')
let bodyParser = require('body-parser')
let morgan = require('morgan')
let pg =  require('pg')
var cors = require('cors')

const PORT = 3000

let pool = new pg.Pool({
    port: 5432,
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'cmg_blogs'
})

/** TESTING CONNECTION */
// pool.connect(( err, db, done ) =>  {
//     if ( err ) {
//         return console.log(err)
//     } else {
//         db.query('select * from posts', (err, table) => {
//             if (err) {
//                 return console.log(err)
//             } else {
//                 console.log(table)
//             }
//         }) 
//     }
// })

let app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: false} ))

app.use(morgan('dev'))
app.use(cors({origin:true,credentials: true}))

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// });

app.delete('/api/remove-post/:id', function(req, res) {
    var id = req.params.id
    let values = [post]
    console.log(id)

    pool.connect(function(err, db,  done){
        done()
        if (err) {
            return res.status(400).send({message: err})
        }  else {
            db.query('DELETE FROM posts WHERE id = $1', [...values], function(err,result){
                if (err) {
                    return res.status(400).send({message: err})
                } else {
                    res.status(201).send({message:'success removed'})
                }
            })
        }
    })
})

app.post('/api/add-post', function (req, res) {
    // console.log('im in api post fook')
    // console.log(req.body)
    let post =  req.body.post;
    let values = [post]

    pool.connect((err, db, done) => {
        if ( err ) {
            // return console.log(err)
            return res.status(400).send({message: err})
        }  else {
           db.query('INSERT INTO posts (post) VALUES ($1)', [...values], (err, table) => {
                done()
                if (err) {
                    // return console.log(err)  
                    return res.status(400).send({message: err})
                } else {
                    console.log('data inserted')
                    // db.end()
                    res.status(201).send({message:'data inserted'})
                }
           }) 
        }

    })
})

app.get('/api/posts', (req, res) => {
    pool.connect(( err, db, done ) =>  {
        done()
        if ( err ) {
            // return console.log(err)
            return res.status(400).send({message: err})
        } else {
            db.query('SELECT * FROM posts').then(data => {
                console.log(data);
                // res.json(data.rows);
                res.status(201).send(data.rows)
            });
        }
    })
});

app.listen( PORT, () => console.log('listening on port ' + PORT) )