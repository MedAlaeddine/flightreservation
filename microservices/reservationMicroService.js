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
  console.log("Connected to database");
});

const reservationProtoPath = "proto/reservation.proto";
const reservationProtoDefinition = protoLoader.loadSync(reservationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const reservationProto = grpc.loadPackageDefinition(
  reservationProtoDefinition
).reservation;

const reservationService = {
  addReservation: (call, callback) => {
    const { user_id, flight_id, price } = call.request;
    const query =
      "INSERT INTO reservations (user_id, flight_id, price) VALUES (?,?,?)";
    connection.query(query, [user_id, flight_id, price], (err, results) => {
      if (err) return callback(err);
      const reservation = {
        id: results.insertId,
        user_id: user_id,
        flight_id: flight_id,
        price: price,
      };
      callback(null, { reservation: reservation });
    });
  },
  getReservation: (call, callback) => {
    const { user_id } = call.request;
    const query = "SELECT * FROM reservations WHERE user_id = ?";
    connection.query(query, [user_id], (err, results) => {
      if (err) return callback(err);
      const reservations = results.map((reservation) => ({
        id: reservation.id,
        user_id: user_id,
        flight_id: reservation.flight_id,
        price: reservation.price,
      }));
      callback(null, {reservations});
    });
  },
};

const server = new grpc.Server();
server.addService(
  reservationProto.ReservationService.service,
  reservationService
);
const port = 50054;
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
console.log(`Reservation microservice running on port ${port}`);
