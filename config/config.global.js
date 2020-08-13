var config = module.exports = {};

config.env = process.env.NODE_ENV;
process.env.NODE_ENV = config.env

config.backend = process.env.SERVER || "http://localhost:7020"

if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV not set, please set it before restarting.");
}