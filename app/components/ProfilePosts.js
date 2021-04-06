import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";
import { useAPI } from "../common/hooks/use-api";

const ProfilePosts = () => {
  const { username } = useParams();

  const { data: posts, isLoading, error } = useAPI("fetchPosts", username);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <>
      <div className="list-group">
        {posts.map((post) => {
          return <Post noAuthor post={post} key={post._id} />;
        })}
      </div>
    </>
  );
};

export default ProfilePosts;
