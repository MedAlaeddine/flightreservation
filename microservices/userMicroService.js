const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
let saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "miniaos",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

const userProtoPath = "proto/user.proto";
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;

const userService = {
  deleteUser: (call, callback) => {
    const { id } = call.request;
    const deleteQuery = "DELETE from users where id = ? ";
    connection.query(deleteQuery, [id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.affectedRows == 0) {
        callback(null, { res: "Id not found" });
      } else {
        callback(null, { res: "deleted" });
      }
    });
  },
  searchUser: (call, callback) => {
    const cin = call.request.cin;

    const searchQuery = `SELECT * FROM users WHERE cin = ?`;
    connection.query(searchQuery, [cin], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.length === 0) {
        callback(new Error(`Record with cin ${cin} not found`));
        return;
      } else {
        const users = results.map((user) => ({
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          genre: user.genre,
          cin: user.cin,
        }));
        callback(null, { user: users });
      }
    });
  },
  getUser: (call, callback) => {
    const user_id = call.request.user_id;
    const query = `SELECT * from users where id= ?`;
    connection.query(query, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }
      if (results.length === 0) {
        callback(new Error(`Record with  id ${user_id} not found`));
        return;
      }
      const user = results[0];
      callback(null, {
        user: user,
      });
    });
  },
  updateUser: (call, callback) => {
    const user = call.request.user;

    const query = `UPDATE users SET nom = ? , prenom = ? , email = ? , genre = ? , cin = ? where id = ?`;
    connection.query(
      query,
      [user.nom, user.prenom, user.email, user.genre, user.cin, user.id],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, { user: user });
      }
    );
  },
  authUser: (call, callback) => {
    const { email, password } = call.request;
    const query = "SELECT * from users where email = ?";
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.length == 0) {
        callback({ message: "user not found" });
        return;
      }
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          callback(err);
        } else if (result) {
          const token = jwt.sign({ id: user.id }, "secret", {
            expiresIn: "2h",
          });
          callback(null, { user: user, token: token });
        } else {
          callback({ message: "password dont match" });
        }
      });
    });
  },

  createUser: (call, callback) => {
    const { nom, prenom, cin, email, password, genre } = call.request;
    const hash = bcrypt.hashSync(password, salt);

    const query =
      "INSERT INTO users (nom, prenom,email,cin,password,genre) VALUES (?,?,?,?,?,?)";
    connection.query(
      query,
      [nom, prenom, email, cin, hash, genre],
      (error, results) => {
        if (error) {
          console.error(error);
          callback(error);
          return;
        }

        const createdUser = {
          id: results.insertId,
          nom: nom,
          prenom: prenom,
          email: email,
          genre: genre,
          password: hash,
          cin: cin,
        };

        callback(null, { user: createdUser });
      }
    );
  },
};

const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);
const port = 50051;
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
console.log(`User microservice running on port ${port}`);
