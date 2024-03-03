import { useEffect, useState } from "react";
import TopicCard from "./TopicCard";

function Home() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const topics = [
      {
        title: "Web Workers",
        path: "/web-worker",
      },
      {
        title: "Service Workers",
        path: "/service-worker",
      },
    ];
    setTopics(topics);
  }, []);
  return (
    <div className=" p-6">
      <h1 className="text-3xl font-bold">Topics!</h1>
      <div className="flex flex-wrap -mx-4">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4"
          >
            <TopicCard {...topic} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
