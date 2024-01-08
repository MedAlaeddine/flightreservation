const express = require("express");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { ApolloServer } = require("@apollo/server");

const userProtoPath = "./proto/user.proto";
const reservationProtoPath = "./proto/reservation.proto";
const app = express();
app.use(bodyParser.json());
const resolvers = require("./resolversGraphQL");
const typeDefs = require("./schemaGraphQL");
const authentication = require("./authentication");
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const reservationProtoDefinition = protoLoader.loadSync(reservationProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;
const reservationProto = grpc.loadPackageDefinition(
  reservationProtoDefinition
).reservation;

const clientUser = new userProto.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const clientReservation = new reservationProto.ReservationService(
  "localhost:50054",
  grpc.credentials.createInsecure()
);

// User APIs
app.post("/api/user/create", (req, res) => {
  const data = req.body;
  clientUser.createUser(data, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.user);
  });
});

app.post("/api/login", (req, res) => {
  const data = req.body;
  clientUser.authUser(data, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.delete("/api/user/:id", authentication, (req, res) => {
  const id = req.params.id;
  clientUser.deleteUser({ id: id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.res);
  });
});

app.get("/api/user/:id", authentication, (req, res) => {
  const user_id = req.params.id;
  clientUser.getUser({ user_id: user_id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.user);
  });
});

app.put("/api/user/update", authentication, (req, res) => {
  const user = req.body;
  clientUser.updateUser({ user: user }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.user);
  });
});

app.get("/api/users/search", (req, res) => {
  const { cin } = req.body;
  clientUser.searchUser({ cin: cin }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.user);
  });
});

// Reservation APIs
app.post("/api/reservation/add", (req, res) => {
  const data = req.body;
  clientReservation.addReservation(data, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.reservation);
  });
});

app.get("/api/reservation/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  clientReservation.getReservation({ user_id: user_id }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response.reservations);
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "hello World aka warda ;)  " });
});

const port = 3002;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
