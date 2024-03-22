document.addEventListener("DOMContentLoaded", init);

const resultsContainer = document.querySelector(".results");

function init() {
  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const val = document.querySelector("#search-form input").value.trim();

    if (val.length === 0) {
      return genError("Error: Entered value must not be empty!");
    }

    resultsContainer.innerHTML = "";

    fetch(`https://api.github.com/users/${val}/repos`)
      .then((resp) => {
        if (!resp.ok) {
          if (resp.status == 404) {
            throw new Error("Nothing found");
          } else {
            throw new Error(resp.statusText);
          }
        }

        return resp.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Nothing found");
        }

        const resultsFragment = new DocumentFragment();

        data.forEach((item) => {
          const el = document.createElement("div");

          el.innerHTML = `<div class="result" data-id="${item.id}">
            <a href="${item.html_url}" target="_blank">${item.name}</a>
            <p>Watchers: ${item.watchers}</p>
            <p>Open Issues: ${item.open_issues}</p>
          </div>`;

          resultsFragment.append(el);
        });

        resultsContainer.append(resultsFragment);
      })
      .catch((err) => {
        genError(err);
      });
  });
}

function genError(msg = "An error occured") {
  resultsContainer.innerHTML = `<p class="error">${msg}</p>`;
}
