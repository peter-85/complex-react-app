import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Profile = (props) => {
  const { post, onClick, noAuthor } = props;

  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/ ${date.getFullYear()}`;

  return (
    <Link
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
      onClick={onClick}
    >
      <img className="avatar-tiny" src={post.author.avatar} />
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {!noAuthor && `by ${post.author.username}`} on {dateFormatted}
      </span>
    </Link>
  );
};

export default Profile;
