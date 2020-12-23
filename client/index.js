const query = "{totalUsers, totalPhotos}";
const url = "http://localhost:4000/graphql";
const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
};

fetch(url, options)
  .then((res) => res.json())
  .then(
    ({ data }) => `
  <p>users: ${data.totalUsers}</p>
  <p>photos: ${data.totalPhotos}</p>
  `
  )
  .then((text) => (document.body.innerHTML = text))
  .catch(console.error);
