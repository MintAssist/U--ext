require("bootstrap/dist/css/bootstrap.min.css");
const bootstrap = require("bootstrap"); 
require("bootstrap-icons/font/bootstrap-icons.css")

const languages = require("./constants/language")

const domainFrontEnd = process.env.DOMAIN_FE
const domainCookie = process.env.DOMAIN_COOKIE

const apiClient = require("./api/apiClient")

const {
	accessTokenKey,
} = require("./api/base")

const localsStorageUtil = require("./utils/localStorage")


async function fetchUserProfile() {
	const isLoggedIn = localStorage.getItem("isLoggedIn");
	if (!isLoggedIn || false === isLoggedIn) {
		window.location.href = "popup.html";
	} else {
		const cookies = await chrome.cookies.getAll({
			domain: domainCookie
		});
		const accessToken = await cookies.find(cookie => cookie.name === accessTokenKey)?.value;

		if (!accessToken) {
			localStorage.setItem("isLoggedIn", "false");
			window.location.href = "popup.html";
		}

		let userProfile = null

		const response = await apiClient.get("u/me")
		if (response.status !== 200) {
			window.location.href = "popup.html";
		}
		const result = response.data;
		userProfile = result.data.user;

		
		const accInfoDiv = document.getElementById("accountProfile");
		accInfoDiv.innerHTML = `
		<p><strong>Email:</strong> ${userProfile.email}</p>
		<p><strong>State:</strong> ${userProfile.state}</p>
    	`;
	}
}

fetchUserProfile();

function createFormSetting() {
	const currentLanguage = localStorage.getItem("currentLanguage") ?? false;
	const targetLanguage = localStorage.getItem("targetLanguage") ?? false;

	function populateSelect(selectElement, options, selectedValue) {
		options.forEach(option => {
			const opt = document.createElement("option");
			opt.value = option.name;
			opt.textContent = option.name;
			// Kiểm tra nếu giá trị đã có trong localStorage thì đánh dấu option đó là selected
			if (option.name === selectedValue) {
				opt.selected = true;
			}
			selectElement.appendChild(opt);
		});
	}

	const currentLanguageSelect = document.getElementById("currentLanguage");
	const targetLanguageSelect = document.getElementById("targetLanguage");

	populateSelect(currentLanguageSelect, languages, currentLanguage);
	populateSelect(targetLanguageSelect, languages, targetLanguage);

	document.getElementById("saveSettingsButton").addEventListener("click", async () => {
		const currentLanguage = currentLanguageSelect.value;
		const targetLanguage = targetLanguageSelect.value;

		console.log("Current Language:", currentLanguage);
		console.log("Target Language:", targetLanguage);
		localStorage.setItem("currentLanguage", currentLanguage);
		localStorage.setItem("targetLanguage", targetLanguage);
		await chrome.storage.local.set({ currentLanguage: currentLanguage });
		await chrome.storage.local.set({ targetLanguage: targetLanguage });

		showToast("Update language!");
	});
}

createFormSetting()


document.getElementById('moreDetail').addEventListener('click', () => {
	chrome.tabs.create({ url: `${domainFrontEnd}/me` });
});

function showToast(message) {
	const toastMessage = document.getElementById("toast-message");
	const toastElement = new bootstrap.Toast(document.getElementById("toast"));

	toastMessage.textContent = message;
	toastElement.show();
}