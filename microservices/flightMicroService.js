const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root",
  database: "miniaos",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

const flightProtoPath = "proto/flight.proto";
const flightProtoDefinition = protoLoader.loadSync(flightProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const flightProto = grpc.loadPackageDefinition(flightProtoDefinition).flight;

const flightService = {
  createFlight: (call, callback) => {
    const { airline, origine, destination, price } = call.request;
    const query =
      "INSERT INTO flights (airline, origine, destination, price) VALUES (?,?,?,?)";
    connection.query(
      query,
      [airline, origine, destination, price],
      (err, results) => {
        if (err) return callback(err);
        const flight = {
          id: results.insertId,
          airline: airline,
          origine: origine,
          destination: destination,
          price: price,
        };
        callback(null, { flight: flight });
      }
    );
  },
  getFlight: (call, callback) => {
    const { id } = call.request;
    const query = "SELECT * FROM flights WHERE id = ?";

    connection.query(query, [id], (err, result) => {
      if (err) return callback(err);
      const flight = result[0];
      callback(null, { flight: flight });
    });
  },
  getAllFlights: (call, callback) => {
    const query = "SELECT * FROM flights";
    connection.query(query, (err, results) => {
      if (err) return callback(err);
      const flights = results.map((flight) => ({
        id: flight.id,
        airline: flight.airline,
        origine: flight.origine,
        destination: flight.destination,
        price: flight.price,
      }));
      callback(null, { flights: flights });
    });
  },
  deleteFlight: (call, callback) => {
    const { id } = call.request;
    const query = "DELETE FROM flights WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err);
      if (results.affectedRows == 0) {
        callback(null, { res: "id not found" });
      } else {
        callback(null, { res: "deleted" });
      }
    });
  },
  updateFlight: (call, callback) => {
    const { flight } = call.request;
    const query =
      "UPDATE flights SET airline = ?, origine = ?, destination = ?, price = ? WHERE id = ?";
    connection.query(
      query,
      [
        flight.airline,
        flight.origine,
        flight.destination,
        flight.price,
        flight.id,
      ],
      (err, results) => {
        if (err) return callback(err);
        if (results.affectedRows == 0) {
          callback(null, { res: "id not found" });
        } else {
          callback(null, { flight: flight });
        }
      }
    );
  },
};
const server = new grpc.Server();
server.addService(flightProto.FlightService.service, flightService);
const port = 50052;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }

    console.log(`Server is running on port ${port}`);
    server.start();
  }
);
console.log(`Flight microservice running on port ${port}`);
