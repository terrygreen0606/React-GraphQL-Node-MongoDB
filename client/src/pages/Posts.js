import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition, Container } from 'semantic-ui-react';

import PostCard from '../components/posts/PostCard';
import PostForm from '../components/posts/PostForm';
import { FETCH_POSTS_QUERY } from '../graphql/postsQuery';
import { UserContext } from '../context/UserContext';

const Home = () => {
	const { user } = useContext(UserContext);
	const [posts, setPosts] = useState([]);
	const { loading, data, error } = useQuery(FETCH_POSTS_QUERY);

	useEffect(() => {
		if (data) {
			setPosts(data.getPosts);
		}
	}, [data]);

	// const {
	// 	loading,
	// 	data: { getPosts: posts }
	// } = useQuery(FETCH_POSTS_QUERY);

	return (
		<Container>
			<Grid columns={3}>
				<Grid.Row className="page-title">
					<h1>Recent Posts</h1>
				</Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}
				{error ? (
					<h1>Error...</h1>
				) : loading ? (
					<h1>Loading posts..</h1>
				) : (
					<Transition.Group>
						{posts &&
							posts.map(post => (
								<Grid.Column
									key={post.id}
									style={{ marginBottom: 20 }}
								>
									<PostCard post={post} />
								</Grid.Column>
							))}
					</Transition.Group>
				)}
			</Grid>
		</Container>
	);
};

export default Home;
