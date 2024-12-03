const apiClient = require("../api/apiClientBackground")

module.exports = {
	analyzerContent: async function ({
		url,
		originalText,
		language
	}) {
		const api = "u/assistants/notes/tmp/analysis";
		try {

			const response = await apiClient.post(api, {
				url,
				originalText,
				language
			})

			if (response.status !== 201 && response.status !== 200) {
				throw new Error("Create Tmp content fail")
			}

			return response.data.data;
		} catch (error) {
			console.error("Error:", error.response ? error.response.data : error.message);
			throw new Error("Create Tmp content fail")
		}
	},
	summaryContent: async function ({
		url,
		originalText,
		language,
	}) {
		const api = "u/assistants/notes/tmp/summaries";
		try {

			const response = await apiClient.post(api, {
				url,
				originalText,
				language
			})

			if (response.status !== 201 && response.status !== 200) {
				throw new Error("Create Tmp content fail")
			}

			return response.data.data;
		} catch (error) {
			console.error("Error:", error.response ? error.response.data : error.message);
			throw new Error("Create Tmp content fail")
		}
	},
	translateContent: async function ({
		url,
		originalText,
		originalLang,
		language = "English"
	}) {
		const api = "u/assistants/notes/tmp/translations";
		try {

			const response = await apiClient.post(api, {
				url,
				originalText,
				originalLang,
				language
			})

			if (response.status !== 201 && response.status !== 200) {
				throw new Error("Create Tmp content fail")
			}

			return response.data.data;
		} catch (error) {
			console.error("Error:", error.response ? error.response.data : error.message);
			throw new Error("Create Tmp content fail")
		}
	},
	relationContent: async function ({
		url,
		originalText,
		language = "English",
		min = 5,
		max = 15
	}) {
		const api = "u/assistants/notes/tmp/relations";
		try {

			const response = await apiClient.post(api, {
				url,
				originalText,
				language,
				min,
				max
			})

			if (response.status !== 201 && response.status !== 200) {
				throw new Error("Create Tmp content fail")
			}

			return response.data.data;
		} catch (error) {
			console.error("Error:", error.response ? error.response.data : error.message);
			throw new Error("Create Tmp content fail")
		}
	},
	saveContent: async function ({
		url,
		originalText,
	}) {
		const api = "u/assistants/notes";
		try {

			const response = await apiClient.post(api, {
				url,
				originalText,
			})

			if (response.status !== 201 && response.status !== 200) {
				throw new Error("Create Tmp content fail")
			}

			return response.data.data;
		} catch (error) {
			console.error("Error:", error.response ? error.response.data : error.message);
			throw new Error("Create Tmp content fail")
		}
	},
}