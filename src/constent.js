import dotenv from "dotenv";

dotenv.config();

// port and mongodb url ....
const PORT = process.env.PORT;
const DBURL = process.env.DBURL;

// ssl key and ssl certificate path
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;

export { PORT, DBURL, SSL_KEY_PATH, SSL_CERT_PATH };
