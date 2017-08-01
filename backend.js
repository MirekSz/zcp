'use strict';

let express = require('express');
let path = require("path");
var pdfmake = require('pdfmake');
var fs = require('fs');
let bodyParser = require('body-parser');
let cors = require('cors');
var Holidays = require('date-holidays')

var hd = new Holidays('PL');
let app = express();
app.listen(3030, function () {
    console.log('listening on 3030');
});

app.use(bodyParser.json({type: '*/*'}));
app.use(cors());

process.on('message', function (packet) {
    if (packet.topic == 'cmd:topic') {
        console.log('Received packet', packet.data);
    }
});
//async function mirek() {
//    return Promise.resolve("a")
//}
class User {
    constructor(id, name, surname, age, sex) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.sex = sex;
    }
}

let users = [new User(1, 'Jacek', 'Doe', '43', 'Mężczyzna'),
    new User(2, 'Marzanna', 'Uss', '54', 'Kobieta'),
    new User(3, 'Julia', 'Dolej', '22', 'Kobieta')];

function generateID() {
    let maxID = 0;
    users.map((obj) => {
        if (obj.id > maxID) {
            maxID = obj.id;
        }
    });
    return (maxID + 1);
}

app.use('/zcp', express.static('dist'))
// app.get('/zcp', function(req, res) {
//   res.sendFile(path.join(__dirname+'/dist/index.html'));
// });
app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    next();
});

app.get('/soap', function (request, response) {
    var soap = require('strong-soap').soap;
// wsdl of the web service this client is going to invoke. For local wsdl you can use, url = './wsdls/stockquote.wsdl'
    var url = 'http://ke.streamsoft.pl/next-app/services/soap/echoService?wsdl';

    var requestArgs = {
        value: 'IBM'
    };

    var options = {};
    soap.createClient(url, options, function (err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('stream_pr', 'produkcja'));
        var method = client['echoService']['EchodWebServicePort']['echo'];
        method(requestArgs, function (err, result, envelope, soapHeader) {
            response.send('Response Envelope: \n' + envelope + err + result);
            console.log('Response Envelope: \n' + envelope);
            //'result' is the response body
            console.log('Result: \n' + JSON.stringify(err));
            console.log('Result: \n' + JSON.stringify(envelope));
            console.log('Result: \n' + JSON.stringify(result));
        });
    })

});
app.get('/zcp/holidays', function (request, response) {
    var holidays = hd.getHolidays(new Date());
    holidays.splice(6, 1);
    response.send(holidays);
});

app.post('/report', function (request, response) {
    let reportData = request.body;
    let body = [
        ['Dzień miesiąca', 'Czas pracy', 'Program', 'Czas nieobecności', 'Przyczyna nieobecności'],
    ];
    var days = reportData.days;
    for (let day of days) {
        body.push([day.lp, day.workHours || '', day.holiday || day.weekend ? '' : (day.nonWorkHours == 8 ? '' : reportData.userData.program), day.holiday || day.weekend ? '' : day.nonWorkHours || '', day.holiday || day.weekend ? '' : day.nonWorkReason || '']);
    }
    let docDefinition = {
        content: [{
            text: 'Zestawienie czasu pracy pracownika za ' + reportData.month + " - " + reportData.userData.user,
            style: 'header'
        }, {
            layout: 'lightHorizontalLines',
            style: 'table',
            table: {
                headerRows: 1,
                widths: ['*', 'auto', 100, '*', '*'],

                body: body
            }
        }],
        styles: {
            header: {
                fontSize: 10,
                alignment: 'center',
                margin: [0, 0, 0, 20]
            },
            table: {
                alignment: 'center',
                fontSize: 8,
            }
        }
    };
    var fontDescriptors = {
        Roboto: {
            normal: path.join(__dirname, '..', './zcp/Roboto-Regular.ttf'),
        }
    };


    var printer = new pdfmake(fontDescriptors);
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
});

app.get('/users', function (request, response) {
    response.send(users);
});

app.get('/users/:id', function (request, response) {
    let found = users.findIndex(user => user.id == request.params.id);
    response.send(users[found]);
});

app.post('/users', function (request, response) {
    let user = request.body;
    user.id = generateID();
    users.push(user);
    response.send({id: user.id});
});

app.put('/users', function (request, response) {
    let editedUser = request.body;
    let found = users.find(user => user.id == editedUser.id);
    if (found) {
        Object.assign(found, editedUser);
    }
    response.end();
});

app.delete('/users/:id', function (request, response) {
    let found = users.findIndex(user => user.id == request.params.id);
    users.splice(found, 1);
    response.end();
});
var i = 0;
app.get('/stuck', function handleStuckRequest(request, response) {
    ImStuck();
    process.send({
        topic: 'cmd:topic',
        data: {
            some: 'data'
        }
    });
    response.send({res: 'ok'});
});

app.get('/leak', function handleStuckRequest(request, response) {

    memeoryLeak();
    response.send({res: 'ok'});
});
var li = [];

function memeoryLeak() {
    i++;
    li = [];
    if (i == 3) {
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('/home/jenkins.tar')
        });

        lineReader.on('line', function (line) {
            li.push(line)
        });
    }
}


function ImStuck() {
    i++;
    if (i == 3) {
        while (true) {

        }
    }
}

function run_cmd(cmd, args, callBack) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) {
        resp += buffer.toString()
    });
    child.stdout.on('end', function () {
        callBack(resp)
    });
}
