import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const request = Axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: request.token,
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("There was a problem");
      }
    };
    fetchPosts();
    return () => {
      request.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <>
      <div className="list-group">
        {posts.map((post) => {
          const date = new Date(post.createdDate);
          const dateFormatted = `${
            date.getMonth() + 1
          }/${date.getDate()}/ ${date.getFullYear()}`;

          return (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="list-group-item list-group-item-action"
            >
              <img className="avatar-tiny" src={post.author.avatar} />
              <strong>{post.title}</strong>{" "}
              <span className="text-muted small">on {dateFormatted}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default ProfilePosts;
