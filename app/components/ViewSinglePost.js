import React, { useEffect, useState } from "react";
import Page from "./Page";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkDown from "react-markdown";
import ReactTooltip from "react-tooltip";

const ViewSinglePost = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);

  useEffect(() => {
    const request = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${id}/`, {
          cancelToken: request.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("There was a problem");
      }
    };
    fetchPost();
    return () => {
      request.cancel();
    };
  }, []);

  if (isLoading)
    return (
      <Page>
        <LoadingDotsIcon />
      </Page>
    );

  const date = new Date(post.createdDate);

  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/ ${date.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link
            to={`/post/${id}/edit`}
            data-tip="Edit"
            data-for="edit"
            className="text-primary mr-2"
          >
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />{" "}
          <Link
            to="#"
            className="delete-post-button text-danger"
            data-tip="Delete"
            data-for="delete"
          >
            <i className="fas fa-trash"></i>
          </Link>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkDown source={post.body} />
      </div>
    </Page>
  );
};

export default ViewSinglePost;
