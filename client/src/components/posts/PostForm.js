import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Button } from 'semantic-ui-react';

import { useForm } from '../../custom/userCustom';
import { ADD_POST, FETCH_POSTS_QUERY } from '../../graphql/postsQuery';

const PostForm = () => {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: ''
	});

	const [createPost, { error }] = useMutation(ADD_POST, {
		variables: values,
		update(proxy, result) {
			// After creating post, save it to apollo cache to read from frontend
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY
			});
			const newPost = result.data.createPost;
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: { getPosts: [newPost, ...data.getPosts] }
			});

			values.body = '';
		}
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a Post:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Post Content"
						name="body"
						onChange={onChange}
						value={values.body}
						error={error ? true : false}
					/>
					<Button type="submit" color="teal">
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	);
};

export default PostForm;
