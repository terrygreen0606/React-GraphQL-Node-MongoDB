import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, Icon, Image, Button, Label } from 'semantic-ui-react';

const PostCard = ({ post }) => {
	const { body, createdAt, id, username, likesCount, commentsCount } = post;

	const likePost = () => {
		console.log('Like post');
	};

	const commentOnPost = () => {
		console.log('commenton post');
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
				<Button as="div" labelPosition="right" onClick={likePost}>
					<Button color="teal" basic>
						<Icon name="heart" />
					</Button>
					<Label basic color="teal" pointing="left">
						{likesCount}
					</Label>
				</Button>

				<Button as="div" labelPosition="right" onClick={commentOnPost}>
					<Button color="blue" basic>
						<Icon name="comments" />
					</Button>
					<Label basic color="blue" pointing="left">
						{commentsCount}
					</Label>
				</Button>
			</Card.Content>
		</Card>
	);
};

export default PostCard;
