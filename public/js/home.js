const form = document.getElementById("chat-form");

const userList = document.getElementById("users");

// Get username and room from URL
const { userName, roomName, token } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

console.log(token);
localStorage.setItem("token", token);

console.log("window", window.location);

form.addEventListener("submit", async e => {
  try {
    e.preventDefault();
    const userDetails = document.querySelector("#userDetails");
    userDetails.innerHTML = `
<p>Loading... </p>`;
    var value = e.target.elements.userId.value;
    console.log(token, "e====", e.target.elements.userId.value);
    const data = await fetch(
      `${window.location.origin}/getuserprofile?token=${localStorage.getItem(
        "token"
      )}&userId=${value}`
    );

    var result = await data.json();

    userDetails.innerHTML = `
<p>${JSON.stringify(result)} </p>`;
  } catch (error) {
    console.log("error==", error);
    userDetails.innerHTML = `
<p>Somthing Went Wrong Open in new Incognito window </p>`;
  }
});
