import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid } from 'semantic-ui-react';

import PostCard from '../components/posts/PostCard';
import { FETCH_POSTS_QUERY } from '../graphql/postsQuery';

const Home = () => {
	let posts = '';
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);

	if (data) {
		posts = { data: data.getPosts };
	}

	// const {
	// 	loading,
	// 	data: { getPosts: posts }
	// } = useQuery(FETCH_POSTS_QUERY);

	return (
		<Grid columns={3}>
			<Grid.Row className="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			{loading ? (
				<h1>Loading posts..</h1>
			) : (
				posts.data &&
				posts.data.map(post => (
					<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
						<PostCard post={post} />
					</Grid.Column>
				))
			)}
		</Grid>
	);
};

export default Home;
