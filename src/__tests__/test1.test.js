// Test using jest
const sortingByAge = require("../testFiles/test1");

beforeEach(() => {

})

afterEach(() => {
    
})

test("Testing sortingByAge function", () => {
  const sortedData = sortingByAge();

  expect(sortedData[0].name).toBe("Elon");
});

test("Check sorted data length is 4", () => {
  const sortedData = sortingByAge();
  expect(sortedData).toHaveLength(4);
});
