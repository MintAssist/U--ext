const axios = require('axios');
const Cookies  = require('js-cookie');

const {
	buildApi,
	accessTokenKey,
	refreshTokenKey,
	tmpCurrentUserKey
} = require("./base")

const REFRESH_TOKEN_URL = 'auth/refresh-token';

const apiClient = axios.create({
	baseURL: buildApi(),
	timeout: 5000,
});

const domainCookie = process.env.DOMAIN_COOKIE
const domainFrontEnd = process.env.DOMAIN_FE

const getAccessToken = async () => {
	const cookies = await chrome.cookies.getAll({
		domain: domainCookie,
	});

	const accessToken = await cookies.find((cookie) => cookie.name === accessTokenKey)?.value;

	return accessToken;
};

const getRefreshToken = async () => {
	const cookies = await chrome.cookies.getAll({
		domain: domainCookie,
	});

	const token = await cookies.find((cookie) => cookie.name === refreshTokenKey)?.value;
	return token
};
const setAccessTokenCookie = async (domain, accessToken) => {
	const cookieDetails = {
		url: domainFrontEnd,  
		name: accessTokenKey,      
		value: accessToken,  
		domain: domainCookie, 
		path: '/', 
		httpOnly: true,          
		expirationDate: (Date.now() / 1000) + 3600 * 24
	};

	// Sử dụng chrome.cookies.set để cài đặt cookie
	chrome.cookies.set(cookieDetails, (cookie) => {
		if (chrome.runtime.lastError) {
			console.error("Không thể thiết lập cookie:", chrome.runtime.lastError);
		} else {
			console.log("Cookie đã được cài đặt thành công:", cookie);
		}
	});
};

apiClient.interceptors.request.use(
	async (config) => {
		const token = await getAccessToken();
		console.log(token)
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		} else {
			console.log("No Token")
		}
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response && error.response.status === 401) {
			try {
				const refreshToken = await getRefreshToken();
				if (!refreshToken) {
					localStorage.setItem("isLoggedIn", "false");
					localStorage.removeItem(tmpCurrentUserKey)
				}

				const { data } = await axios.post(buildApi(REFRESH_TOKEN_URL), { refreshToken });
				const newAccessToken = data.data.accessToken
				await setAccessTokenCookie(newAccessToken);

				error.config.headers.Authorization = `Bearer ${data.accessToken}`;
				return apiClient.request(error.config);
			} catch (refreshError) {
				localStorage.setItem("isLoggedIn", "false");
				localStorage.removeItem(tmpCurrentUserKey)
			}
		}

		return Promise.reject(error);
	}
);

module.exports = apiClient;
