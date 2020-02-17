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
	// Context gets the http requests like headers
	context: ({ req }) => ({ req, pubsub })
});

const port = process.env.PORT || 5000;

const start = new Date().getTime();
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => {
		const end = new Date().getTime();
		console.log((end - start) / 1000);
		console.log('Mongodb connected');
		return server.listen({ port });
	})
	.then(res => {
		console.log(`Server running at ${res.url}`);
	})
	.catch(err => console.log(err));
