const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	// Context gets the http requests
	context: ({ req }) => ({ req, pubsub })
});

mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Mongodb connected');
		return server.listen({ port: 5000 });
	})
	.then(res => {
		console.log(`Server running at ${res.url}`);
	})
	.catch(err => console.log(err));
