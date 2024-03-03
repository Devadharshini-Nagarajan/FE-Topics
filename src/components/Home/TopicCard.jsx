import React from "react";
import { Link } from "react-router-dom";

const TopicCard = ({ title, content, path }) => {
  return (
    <div className="flex flex-col p-4 border border-gray-300 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{content}</p>
      <Link to={path} className="mt-4 text-blue-500 hover:underline">
        Read more
      </Link>
    </div>
  );
};

export default TopicCard;
