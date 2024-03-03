export default () => {
  self.addEventListener("message", (event) => {
    const data = event.data;
    const result = performIntensiveTask(data);
    self.postMessage(result);
  });

  function performIntensiveTask(data) {
    return data * data;
  }
};
