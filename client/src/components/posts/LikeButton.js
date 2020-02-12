import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Button, Label, Icon } from 'semantic-ui-react';

import { LIKE_P0ST } from '../../graphql/postsQuery';
import Tooltip from '../../custom/Tooltip';

const LikeButton = ({ post, authUser }) => {
	const { id, likes, likesCount } = post;
	const [liked, setLiked] = useState(false);

	// If the user is logged in and he liked the post, then...
	useEffect(() => {
		if (
			authUser &&
			likes.find(like => like.username === authUser.username)
		) {
			setLiked(true);
		} else {
			setLiked(false);
		}
	}, [authUser, likes]);

	const [likePost] = useMutation(LIKE_P0ST, {
		variables: { postId: id },
		onError(error) {
			console.log(error.graphQLErrors[0].message);
		}
	});

	const likeBtn = authUser ? (
		liked ? (
			<Button color="teal">
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="teal" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button color="teal" basic as={Link} to="/login">
			<Icon name="heart" />
		</Button>
	);

	return (
		<Button as="div" labelPosition="right" onClick={likePost}>
			<Tooltip content={liked ? 'I Dislike this' : 'I like this'}>
				{likeBtn}
			</Tooltip>

			<Label basic color="teal" pointing="left">
				{likesCount}
			</Label>
		</Button>
	);
};

export default LikeButton;
