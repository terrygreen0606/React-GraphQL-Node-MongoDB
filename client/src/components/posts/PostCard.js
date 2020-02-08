import React, { useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, Icon, Image, Button, Label } from 'semantic-ui-react';

import { UserContext } from '../../context/UserContext';
import LikeButton from './LikeButton';

const PostCard = ({ post }) => {
	const { user } = useContext(UserContext);
	const { body, createdAt, id, username, userEmail, commentsCount } = post;

	const deletePost = () => {
		console.log('delete post');
	};

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow()}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton post={post} user={user} />

				<Button as={Link} to={`/posts/${id}`} labelPosition="right">
					<Button color="blue" basic>
						<Icon name="comments" />
					</Button>
					<Label basic color="blue" pointing="left">
						{commentsCount}
					</Label>
				</Button>

				{user && user.email === userEmail && (
					<Button color="red" onClick={deletePost} floated="right">
						<Icon name="trash" style={{ margin: 0 }} />
					</Button>
				)}
			</Card.Content>
		</Card>
	);
};

export default PostCard;
