const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const clientSessions = require('client-sessions');

const app = express();

app.engine('hbs', hbs.engine({extname: '.hbs', defaultLayout: 'regular_layout'}))
app.set('view engine', 'hbs');

app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "my_name_is_walter_hatrwell_white", // this should be a long un-guessable string.
    duration: 1440 * 365 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    if(req.session.lang) {
        next();
    }
    else {
        req.session.lang = getLanguagePreference(req);
        next();
    }
});

app.get('/', (req, res) => {
    renderIndexPage(req, res);
});
app.get('/skills/', (req, res) => {
    renderPage('skills', req, res);
});
app.get('/project/all', (req, res) => {
    renderPage('projects', req, res);
});
app.get('/project/:name', (req, res, next) => {
    const projectName = req.params.name;
    if(fs.existsSync('./views/' + projectName + '.hbs')) {
        renderPage(projectName, req, res);
    }
    else 
        next();
});
app.post('/choose-lang', async (req, res) => {
    try {
        const languageObj = await getLanguageObjFor(req.body.language, req.body.address);
        req.session.lang = req.body.language;
        res.json(languageObj);
    }
    catch(err) {
        console.log(err);
    }
})

app.use((req, res) => res.redirect('/'))

app.listen(8080);

function renderIndexPage(req, res) {
    if(req.session.lang == 'eng') {
        res.render('index', {
            layout: 'index_layout'
        });
    }
    else {
        res.render('ukr_index', {
            layout: 'ukr_index_layout'
        })
    }
}

function renderPage(hbsPage, req, res) {
    if(req.session.lang == 'eng') {
        res.render(hbsPage, {
            layout: 'regular_layout'
        });
    }
    else {
        res.render('ukr_' + hbsPage, {
            layout: 'ukr_regular_layout'
        })
    }
}

function getValidDirectoryAddress(path) {
    let address;
    if(path == "/")
        address = "home";
    else {
        address = path.split('/').slice(1).join('_');
        if(address[address.length - 1] == '_') 
            address = address.slice(0, address.length - 1);
    }
    return address;
}

function getLanguageObjFor(lang, path) {
    return new Promise((resolve, reject) => {
            path = getValidDirectoryAddress(path);
            fs.readFile(`./locales/${lang}/general.json`, 'utf8', (err, generalTranslationFile) => {
                if(err)
                    reject({message: err})
                else {
                    fs.readFile(`./locales/${lang}/${path}.json`, 'utf8', (err, specifiedTranslationFile) => {
                        if(err)
                            reject({message: err})
                        else {
                            const generalTranslation = JSON.parse(generalTranslationFile);
                            const specifiedTranslation = JSON.parse(specifiedTranslationFile);
                            resolve(Object.assign({}, generalTranslation, specifiedTranslation));
                        }
                    });
                }
            });
    });
}

function getLanguagePreference(req) {
    let language = req.headers['accept-language'];
    return language.includes('uk_UA') ? "ukr" : "eng";
}