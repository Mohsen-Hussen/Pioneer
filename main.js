//global variabels
let repoInput = document.querySelector("#repos_input_value");
let repoError = document.querySelector("#empty_data");
let repoRow = document.querySelector("#repos_info");
let select = document.querySelector("#selectMenu");
let repoSelectNumber = select.options[select.selectedIndex].value;
let selectLanguage = document.querySelector("#langMenu");
let langSelectValue =
	selectLanguage.options[selectLanguage.selectedIndex].value;
let responseData;

const apiUrl = `https://api.github.com/search/repositories?q=created:>`;
const options = {
	method: "GET",
	"Access-Control-Allow-Origin": "*",
	headers: {
		Accept: "application/vnd.github+json",
	},
};
// this function to render the row of table & to slice the respose array by selected number of repo from select menu
const loadTable = (repos, count, lang) => {
	lang = langSelectValue;
	let repoData = repos
		.filter((item) => {
			// to return all of languages => 100 object
			if (lang === "All") {
				return { item: item.language };
			}
			// to return choosen language
			return item.language === lang;
		})
		.map((item, index) => {
			return `<tr>
              <th scope="row">${index + 1}</th>
              <td>${item.full_name}</td>
              <td>${
								item.description ? item.description : "No description found"
							}</td>
              <td>${item.language ? item.language : "Language not found"}</td>
              <td class="repo-stars">${item.stargazers_count}&#11088;</td>
              <td>
                <a href="${
									item.html_url
								}" target="_blank" class="btn btn-success">Visit</a>
              </td>
            </tr>`;
		})
		.slice(0, count);
	repoRow.innerHTML = repoData;
};
// this function will call the api , fetch data & handle errors
const fetchApi = async () => {
	if (repoInput.value === "") {
		repoError.innerHTML =
			"** Please Enter Date To Fetch Sorted Repos By Stars ** ";
		return;
	}
	const response = await fetch(
		`${apiUrl}${repoInput.value}&per_page=100`,
		options
	);
	// handle erros
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	let data = await response.json();
	console.log(data);
	repoRow.innerHTML = repoSelectNumber;
	// if fetching return with empty [] => username haven't any repos
	if (data.length === 0) {
		repoError.innerHTML =
			"** No Data Found ... Please Enter Another Username ** ";
	} else {
		// sorting stars from data array fetching by api
		let sortedData = data.items.sort(
			// sort desc
			(a, b) => b.stargazers_count - a.stargazers_count
			// (a, b) => a.stargazers_count - b.stargazers_count => sort asc
		);
		// storing the sorteddata into data
		data = sortedData;
		// storing the sorteddata into responseData to use it at loadTable so we can slice it without calling api again
		responseData = data;
		loadTable(responseData, repoSelectNumber, langSelectValue);
		repoError.innerHTML = "Data Fecthed Successfully";
	}
};

// to track the number of selected repos if changed & trigger loadTable to slice the sortedData stored at responseData
let dropdownNumber = select.addEventListener("change", () => {
	repoSelectNumber = select.options[select.selectedIndex].value;
	loadTable(responseData, repoSelectNumber, langSelectValue);
});
// to track the choosen language if changed
let langDropdownValue = selectLanguage.addEventListener("change", () => {
	langSelectValue = selectLanguage.options[selectLanguage.selectedIndex].value;
	loadTable(responseData, repoSelectNumber, langSelectValue);
});
// to load fetchApi automatic after first load
window.addEventListener("load", fetchApi);
