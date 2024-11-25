

var siteName = document.getElementById("bookmarkName");
var siteURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submit-btn");
var tableContent = document.getElementById("tableContent");
var deleteBtns;
var visitBtns;
var closeBtn = document.getElementById("closeBtn");
var boxModal = document.querySelector(".box-info");
var bookmarks = [];


if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  bookmarks.forEach((_, index) => displayBookmark(index));
}


function displayBookmark(index) {
  var userURL = bookmarks[index].siteURL;
  var httpsRegex = /^https?:\/\//g;
  var fixedURL = httpsRegex.test(userURL)
    ? userURL.slice(userURL.match(httpsRegex)[0].length)
    : userURL;
  var validURL = httpsRegex.test(userURL) ? userURL : `https://${userURL}`;

  var newBookmark = `
    <tr>
      <td>${index + 1}</td>
      <td>${bookmarks[index].siteName}</td>
      <td>
        <button class="btn btn-visit" data-index="${index}">
          <i class="fa-solid fa-eye pe-2"></i>Visit
        </button>
      </td>
      <td>
        <button class="btn btn-delete" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>Delete
        </button>
      </td>
    </tr>
  `;
  tableContent.innerHTML += newBookmark;

  attachEventListeners();
}


function attachEventListeners() {
  deleteBtns = document.querySelectorAll(".btn-delete");
  deleteBtns.forEach(btn =>
    btn.addEventListener("click", deleteBookmark)
  );

  visitBtns = document.querySelectorAll(".btn-visit");
  visitBtns.forEach(btn =>
    btn.addEventListener("click", visitWebsite)
  );
}


function clearInput() {
  siteName.value = "";
  siteURL.value = "";
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


submitBtn.addEventListener("click", function () {
  if (
    siteName.classList.contains("is-valid") &&
    siteURL.classList.contains("is-valid")
  ) {
    var bookmark = {
      siteName: capitalize(siteName.value),
      siteURL: siteURL.value,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmark(bookmarks.length - 1);
    clearInput();
    siteName.classList.remove("is-valid");
    siteURL.classList.remove("is-valid");
  } else {
    boxModal.classList.remove("d-none");
  }
});


function deleteBookmark(e) {
  var deletedIndex = e.target.dataset.index || e.target.parentElement.dataset.index;
  bookmarks.splice(deletedIndex, 1);
  tableContent.innerHTML = "";
  bookmarks.forEach((_, index) => displayBookmark(index));
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
}


function visitWebsite(e) {
  var websiteIndex = e.target.dataset.index || e.target.parentElement.dataset.index;
  var url = bookmarks[websiteIndex].siteURL;
  open(url.startsWith("http") ? url : `https://${url}`);
}


var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(www\.)?\w+\.\w{2,}(:\d{2,5})?(\/\w+)*$/;

siteName.addEventListener("input", () => validateInput(siteName, nameRegex));
siteURL.addEventListener("input", () => validateInput(siteURL, urlRegex));

function validateInput(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}


function closeModal() {
  boxModal.classList.add("d-none");
}


closeBtn.addEventListener("click", closeModal);
document.addEventListener("keydown", e => e.key === "Escape" && closeModal());
document.addEventListener("click", e => {
  if (e.target.classList.contains("box-info")) closeModal();
});
