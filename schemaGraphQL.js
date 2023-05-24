const typeDefs = ` #graphql
  type Flight {
    id: Int
    airline: String!
    origine: String!
    destination: String!
    price: Float!
  }

  type Query {
    flight(id: Int!): Flight
    flights: [Flight]
  }

  type Mutation {
    createFlight(airline: String!, origine: String!, destination: String!, price: Float!): Flight!
    deleteFlight(id: Int!): String
    updateFlight(id: Int!, airline: String!, origine: String!, destination: String!, price: Float!): Flight!
  }
`;

module.exports = typeDefs;
