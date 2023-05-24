const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { response } = require("express");
const flightProtoPath = "proto/flight.proto";
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "miniaos",
});

const flightProtoDefinition = protoLoader.loadSync(flightProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const flightProto = grpc.loadPackageDefinition(flightProtoDefinition).flight;
const client = new flightProto.FlightService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

const resolvers = {
  Query: {
    flight: (_, { id }) => {
      return new Promise((resolve, reject) => {
        client.getFlight({ id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.flight);
          }
        });
      });
    },
    flights: () => {
      return new Promise((resolve, reject) => {
        client.getAllFlights({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.flights);
          }
        });
      });
    },
  },
  Mutation: {
    createFlight: (_, { airline, origine, destination, price }) => {
      return new Promise((resolve, reject) => {
        const flight = {
          airline: airline,
          origine: origine,
          destination: destination,
          price: price,
        };
        client.createFlight(flight,
          (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.flight);
            }
          }
        );
      });
    },
    deleteFlight: (_, { id }) => {
      return new Promise((resolve, reject) => {
        client.deleteFlight({ id }, (err, response) => {
          if (err) reject(err);
          else resolve(response.res);
        });
      });
    },
    updateFlight: (_, { id, airline, origine, destination, price }) => {
      const flight = {
        id: id,
        airline: airline,
        origine: origine,
        destination: destination,
        price: price,
      };
      return new Promise((resolve, reject) => {
        client.updateFlight(flight, (err, response) => {
          if (err) reject(err);
          else resolve(response.flight);
        });
      });
    },
  },
};
module.exports = resolvers;
