import React, { useContext, useState, useRef } from 'react';
import moment from 'moment';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
	Grid,
	Card,
	Image,
	Button,
	Icon,
	Label,
	Form
} from 'semantic-ui-react';

import { FETCH_POST_QUERY, ADD_COMMENT } from '../../graphql/postsQuery';
import { UserContext } from '../../context/UserContext';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

const SinglePost = props => {
	const postId = props.match.params.postId;
	const commentInputRef = useRef(null);
	const [comment, setComment] = useState('');
	const { user } = useContext(UserContext);

	const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
		variables: { postId }
	});

	const [addComment] = useMutation(ADD_COMMENT, {
		variables: { postId, body: comment },
		update(proxy) {
			setComment('');

			// Remove focus prop after adding comment
			commentInputRef.current.blur();
		}
	});

	const deleteButtonCallback = () => {
		props.history.push('/posts');
	};

	let markUp;
	if (loading) {
		markUp = <h3>Loading...</h3>;
	} else if (error) {
		markUp = <h3>Error...</h3>;
	} else {
		const {
			id,
			body,
			createdAt,
			username,
			commentsCount,
			comments
		} = data.getPost;

		const displayComments =
			comments.length > 0 ? (
				comments.map(comment => (
					<Card fluid key={comment.id}>
						<Card.Content>
							{user && user.username === comment.username && (
								<DeleteButton
									postId={id}
									commentId={comment.id}
								/>
							)}
							<Card.Header>{comment.username}</Card.Header>
							<Card.Meta>
								{moment(comment.createdAt).fromNow()}
							</Card.Meta>
							<Card.Description>{comment.body}</Card.Description>
						</Card.Content>
					</Card>
				))
			) : (
				<h3>No comments here</h3>
			);

		markUp = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							size="small"
							float="right"
							src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
						/>
					</Grid.Column>

					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>
									{moment(createdAt).fromNow()}
								</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton user={user} post={data.getPost} />

								<Button as="div" labelPosition="right">
									<Button basic color="blue">
										<Icon name="comments" />
									</Button>
									<Label basic color="blue" pointing="left">
										{commentsCount}
									</Label>
								</Button>
								{user && user.username === username && (
									<DeleteButton
										postId={id}
										callback={deleteButtonCallback}
									/>
								)}
							</Card.Content>
						</Card>

						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a Comment</p>
									<Form>
										<div className="ui action input fluid">
											<input
												type="text"
												placeholder="comment"
												name="comment"
												value={comment}
												onChange={e =>
													setComment(e.target.value)
												}
												ref={commentInputRef}
											/>
											<button
												type="submit"
												className="ui button teal"
												disabled={comment.trim() === ''}
												onClick={addComment}
											>
												Add Comment
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}

						{displayComments}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}

	return markUp;
};

export default SinglePost;
