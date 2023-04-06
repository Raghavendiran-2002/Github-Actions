const express = require('express');
const { server } = require('./config');
const cors = require('cors');
 
const sequelize = require('./services/database');

const views = require('./views');
const errCtrl = require('./controllers/error_control');

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
  }))

app.use((req, res,next) => {
    // res.status(200).json({'status': 'success', 'message': 'Kuruksastra 2023 backend :)'});
    // console.log(req.headers);
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({'status': 'success', 'message': 'Kuruksastra 2023 backend :)'});
});

app.use('/', views);

app.use(errCtrl);


sequelize.sync({alter : true}).then(() => console.log("altered")).catch(err => console.log(err))

app.listen(server.port,() => console.log(`started at port : ${server.port}`));



