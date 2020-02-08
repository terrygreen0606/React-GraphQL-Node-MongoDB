import React, { useState } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import {
	DELETE_POST,
	FETCH_POSTS_QUERY,
	DELETE_COMMENT
} from '../../graphql/postsQuery';
import Tooltip from '../../custom/Tooltip';

const DeleteButton = ({ postId, commentId, callback }) => {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

	const [deletePostOrComment, { error }] = useMutation(mutation, {
		variables: { postId, commentId },
		update(proxy) {
			console.log(error);
			setConfirmOpen(false);

			if (!commentId) {
				// Remove from cache
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY
				});
				const postsAfterDeleted = data.getPosts.filter(
					post => post.id !== postId
				);
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: { getPosts: postsAfterDeleted }
				});
				// If called from single post, redirect to posts page
				if (callback) callback();
			}
		}
	});

	return (
		<>
			<Tooltip content={commentId ? 'Delete comment' : 'Delete Post'}>
				<Button
					as="div"
					color="red"
					onClick={() => setConfirmOpen(true)}
					floated="right"
				>
					<Icon name="trash" style={{ margin: 0 }} />
				</Button>
			</Tooltip>

			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrComment}
			/>
		</>
	);
};

export default DeleteButton;
