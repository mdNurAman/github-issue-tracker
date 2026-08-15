const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const allIssueContainer = document.getElementById("issue-container");
const issueCounter = document.getElementById("issue-counter");
const all = document.getElementById("all");
const open = document.getElementById("open");
const closed = document.getElementById("closed");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search");
const modalContainer = document.getElementById("modal-container");
function removeActiveClass() {
  all.classList.remove("btn-primary");
  open.classList.remove("btn-primary");
  closed.classList.remove("btn-primary");
}

all.addEventListener("click", () => {
  removeActiveClass();
  all.classList.add("btn-primary");
  main("all");
});
open.addEventListener("click", () => {
  removeActiveClass();
  open.classList.add("btn-primary");
  main("open");
});
closed.addEventListener("click", () => {
  removeActiveClass();
  closed.classList.add("btn-primary");
  main("closed");
});
searchBtn.addEventListener("click", () => {
  removeActiveClass();
  loadSearchData(searchInput.value);
});
async function loadSearchData(val) {
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${val}`);
  const searchData = await res.json();
  displayAllIssue(searchData.data, "all");
}
async function main(activeBtn = "all") {
  const issues = await loadAllIsuue();
  displayAllIssue(issues, activeBtn);
}
main();

function getPriorityClass(issue) {
  let priorityClass = "";
  if (issue.priority === "high") {
    priorityClass = "bg-red-100 text-red-600";
  } else if (issue.priority === "medium") {
    priorityClass = "bg-yellow-100 text-yellow-600";
  } else {
    priorityClass = "bg-gray-100 text-gray-600";
  }
  return priorityClass;
}
function getStatusclass(issue) {
  let statusClass = "";
  if (issue.status === "open") {
    statusClass = "border-t-green-600 border-t-5";
  } else {
    statusClass = "border-t-violet-600 border-t-5";
  }
  return statusClass;
}
function getLabels(issueLabel) {
  let label = ``;
  if (issueLabel === "bug") {
    label = `<h1 class="bg-red-100 text-red-600 rounded-xl p-2 text-[8px]">
                                    <i class=" fa-solid fa-bug"></i>
                                    BUG
                                </h1>`;
  } else if (issueLabel === "documentation") {
    label = `<h1 class="bg-green-100 text-green-600 rounded-xl p-2 text-[8px]">
                                    <i class="fa-regular fa-file"></i>
                                    DOCUMENTATION
                                </h1>
        `;
  } else if (issueLabel === "enhancement") {
    label = `<h1 class="bg-blue-100 text-blue-600 rounded-xl p-2 text-[8px]">
                                    <i class=" fa-solid fa-life-ring"></i>
                                    ENHANCEMENT
                                </h1>
        `;
  } else if (issueLabel === "good first issue") {
    label = `
         <h1 class="bg-violet-100 text-violet-600 rounded-xl p-2 text-[8px]">
                                    <i class="fa-solid fa-star-of-life"></i>
                                    GOOD FIRST ISSUE
                                </h1>
        `;
  } else {
    label = ` <h1 class="bg-yellow-100 text-yellow-600 rounded-xl p-2 text-[8px]">
                                    <i class=" fa-solid fa-life-ring"></i>
                                    HELP WANTED
                                </h1>
        `;
  }

  return label;
}
function mergeLables(issue) {
  let allLables = "";
  issue.labels.forEach((label) => {
    allLables += getLabels(label);
  });
  return allLables;
}
async function loadAllIsuue() {
  const res = await fetch(url);
  const data = await res.json();

  return data.data;
}

function displayAllIssue(data, activeButton) {
  console.log(activeButton);

  allIssueContainer.innerHTML = "";
  let newEl = "";
  let cnt = 0;
  data.forEach((issue) => {
    let priorityClass = getPriorityClass(issue);
    let statusClass = getStatusclass(issue);
    let labels = mergeLables(issue);

    if (activeButton === "all" || issue.status === activeButton) {
      cnt++;
      newEl += `
        <div id="issue-box" onclick="loadModal(${issue.id})" class="issue-box bg-white ${statusClass} rounded-md data-id=${issue.id}">
                    <div class="border-b-1 border-gray-300 p-3">
                        <div class="flex justify-between items-center">
                            <img src="assets/Open-Status.png" alt="">
                            <h1 id="priority" class="priority ${priorityClass} p-2 rounded-2xl">${issue.priority}</h1>
                        </div>
                        <div class="">
                            <h1 class="issue-name font-bold text-xl my-2 line-clamp-2">${issue.title}</h1>
                            <p class="issue-description line-clamp-2 text-lg text-gray-500">${issue.description}</p>
                            <div class="flex gap-2 my-2">
                                ${labels}
                            </div>
                        </div>
                    </div>
                    <div class="p-3">
                        <div class="flex justify-between">
                            <p id="author">${issue.author}</p>
                            <p id="assignee">${issue.assignee}</p>
                        </div>
                        <div class="flex justify-between">
                            <p id="created-at">${issue.createdAt.slice(0, 10)}</p>
                            <p id="updated-at">${issue.updatedAt.slice(0, 10)}</p>
                        </div>
                    </div>
                </div>
        `;
    }
  });
  issueCounter.innerText = cnt + " Issues";

  allIssueContainer.innerHTML += newEl;
}
async function modalData(id) {
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
  const jsonModal = await res.json();

    displayModal(jsonModal.data);
}
async function displayModal(issue) {
    let priorityClass = getPriorityClass(issue);
    let statusClass = getStatusclass(issue);
    let labels = mergeLables(issue);
  modalContainer.innerHTML = `
     <div id="issue-box" onclick="loadModal(${issue.id})" class="issue-box bg-white ${statusClass} rounded-md data-id=${issue.id}">
                    <div class="border-b-1 border-gray-300 p-3">
                        <div class="flex justify-between items-center">
                            <img src="assets/Open-Status.png" alt="">
                            <h1 id="priority" class="priority ${priorityClass} p-2 rounded-2xl">${issue.priority}</h1>
                        </div>
                        <div class="">
                            <h1 class="issue-name font-bold text-xl my-2 line-clamp-2">${issue.title}</h1>
                            <p class="issue-description line-clamp-2 text-lg text-gray-500">${issue.description}</p>
                            <div class="flex gap-2 my-2">
                                ${labels}
                            </div>
                        </div>
                    </div>
                    <div class="p-3">
                        <div class="flex justify-between">
                            <p id="author">${issue.author}</p>
                            <p id="assignee">${issue.assignee}</p>
                        </div>
                        <div class="flex justify-between">
                            <p id="created-at">${issue.createdAt.slice(0, 10)}</p>
                            <p id="updated-at">${issue.updatedAt.slice(0, 10)}</p>
                        </div>
                    </div>
                </div>
        `;
    my_modal.showModal();
}
function loadModal(id) {
  modalData(id);
}
