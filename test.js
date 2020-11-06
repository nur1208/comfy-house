const posts = [
  { tittle: "Post one", body: "This is post one" },
  { tittle: "Post two", body: "This is post two" },
];

function getPosts() {
  setTimeout(() => {
    let output = "";
    posts.forEach((post) => {
      output += `<li>${post.tittle}</li>`;
    });
    document.body.innerHTML = output;
  }, 1000);
}

function creatPost(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push(post);

      const error = false;

      if (!error) {
        resolve();
      } else {
        reject("something want wrong");
      }
    }, 2000);
  });
}

// creatPost({ tittle: "post Three", body: "this is post three" })
//   .then(getPosts)
//   .catch((message) => console.log(message));

// Async / Await / Fetch

async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");

  const data = await res.json();

  console.log(data);
}

fetchUsers();

// Async / Await
// async function init() {
//   await creatPost({ tittle: "post Three", body: "this is post three" });

//   getPosts();
// }

// init();

// const promise1 = Promise.resolve("Hello World");
// const promise2 = 20;
// const promise3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 2000, "Goodbye");
// });
// const promise4 = fetch(
//   "https://jsonplaceholder.typicode.com/users"
// ).then((result) => result.json());

// Promise.all([promise1, promise2, promise3, promise4]).then((values) =>
//   console.log(values)
// );
