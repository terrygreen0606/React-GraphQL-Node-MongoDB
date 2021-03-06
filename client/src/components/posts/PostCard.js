import React, { useContext } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, Icon, Image, Button, Label } from 'semantic-ui-react';

import { UserContext } from '../../context/UserContext';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import Tooltip from '../../custom/Tooltip';

const PostCard = ({ post }) => {
	const authUser = useContext(UserContext).user;
	const { body, createdAt, id, user, commentsCount } = post;

	let deleteButton =
		(authUser && authUser.roleType === 1) ||
		(authUser && user && user.email === authUser.email) ? (
			<DeleteButton postId={id} />
		) : null;

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
				/>
				<Card.Header>
					{user ? user.username : 'User Deleted'}
				</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow()}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton post={post} authUser={authUser} />

				<Tooltip content="Comment on Post">
					<Button as={Link} to={`/posts/${id}`} labelPosition="right">
						<Button color="blue" basic>
							<Icon name="comments" />
						</Button>
						<Label basic color="blue" pointing="left">
							{commentsCount}
						</Label>
					</Button>
				</Tooltip>

				{deleteButton}
			</Card.Content>
		</Card>
	);
};

export default PostCard;
