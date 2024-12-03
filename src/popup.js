//popup.js
require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap"); 
require("bootstrap-icons/font/bootstrap-icons.css")

const domainFrontEnd = process.env.DOMAIN_FE
const domainCookie = process.env.DOMAIN_COOKIE

const {
	accessTokenKey,
	currentUserKey,
} = require("./api/base")

document.addEventListener("DOMContentLoaded", async () => {
	const isLoggedIn = localStorage.getItem("isLoggedIn");
	let accessToken = null
	let currentUser = null
	if (isLoggedIn === "true") {
		window.location.href = "profile.html";
	} else {
		const cookies = await chrome.cookies.getAll({
			domain: domainCookie
		});
		accessToken = await cookies.find(cookie => cookie.name === accessTokenKey)?.value;
		currentUser = await cookies.find(cookie => cookie.name === currentUserKey)?.value;

		if (accessToken) {
			localStorage.setItem("isLoggedIn", "true");
			window.location.href = "profile.html";
		} else {
			localStorage.setItem("isLoggedIn", "false");
		}
	}
});

document.getElementById('signUpLink').addEventListener('click', () => {
	chrome.tabs.create({ url: `${domainFrontEnd}/support/sign-up` });
});

document.getElementById('forgotPasswordLink').addEventListener('click', () => {
	chrome.tabs.create({ url: `${domainFrontEnd}/support/forgot-password` });
});

document.getElementById('loginButton').addEventListener('click', () => {
	chrome.tabs.create({ url: `${domainFrontEnd}/login` });
});



