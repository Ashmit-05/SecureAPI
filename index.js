const express = require("express");
const app = express();
// winston and express-winston is used for logging
const winston = require("winston");
const expressWinston = require("express-winston");
const responseTime = require("response-time");
const cors = require("cors");
const helmet = require("helmet");
const {createProxyMiddleware} = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit"); // used for rate limiting
const config = require("./config");
const port = config.serverPort;

// const {readFileSync} = require("fs");
// const {createServer} = require("https");
// const credentials = {
//     key : readFileSync("cert/server.key","utf8"),
//     cert : readFileSync("cert/server.crt","utf8"),
// };
// const httpsServer = createServer(credentials,app);
// httpsServer.listen(443);

const session = require("express-session");

const secret = config.sessionSecret;
const store = new session.MemoryStore();
const protect = (req, res, next) => {
  const { authenticated } = req.session;

  if (!authenticated) {
    res.sendStatus(401);
  } else {
    next();
  }
};

app.disable("x-powered-by");
app.use(cors());
app.use(helmet());

app.use(responseTime());

app.use(
    expressWinston.logger({
        transports : [new winston.transports.Console()],
        format : winston.format.json(),
        statusLevels : true,
        meta : false,
        level : "debug",
        msg : "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        expressFormat : true,
        ignoreRoute() {
            return false;
        },
    })
);

app.use(rateLimit(config.rate));

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true,
    store,
  })
);

app.get("/login",(req,res) => {
    const {authenticated} = req.session;
    if(!authenticated) {
        req.session.authenticated = true;
        res.send("Successfully authenticated");
    } else {
        res.send("Already authenticated");
    }
});

Object.keys(config.proxies).forEach((path) => {
    const { protected, ...options} = config.proxies[path];
    const check = protected ? protect : alwaysAllow;
    app.use(path,check,createProxyMiddleware(options));
});

app.get("/",(req,res) => {
    const {name = "user"} = req.query;
    res.send(`Hello ${name}`);
});

app.get("/protected",protect,(req,res) => {
    const {name="user"} = req.query;
    res.send(`Hello ${name}`);
});

app.get("/logout",protect,(req,res) => {
    req.session.destroy(() => {
        res.send("Successfully logged out");
    });
});

app.listen(port,() => {
    console.log(`Server running at http://localhost:${port}`);
});
