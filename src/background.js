//background.js
const {
	analyzerContent,
	summaryContent,
	translateContent,
	relationContent,
	saveContent
} = require("./services/assistant.service")

async function getOriginalLang() {
	const result = await chrome.storage.local.get(["currentLanguage"])
	return result.currentLanguage ?? "English";
}

async function getDictLang() {
	const result = await chrome.storage.local.get(["targetLanguage"])
	return result.targetLanguage ?? "English"
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	if (request.action === 'saveContent') {
		const response = await saveContent(request.payload)
		sendResponse(response)
	}

	return true;
	
});

chrome.runtime.onConnect.addListener(function (port) {
	if (port.name === "analyzerContentPipe") {
		console.log("analyzerContentPipe");
		port.onMessage.addListener(async function (msg) {
			let timeCall = 1;
			const analyze = async () => {
				const payload = {
					...msg.payload,
					language: await getOriginalLang()
				}
				let response = await analyzerContent(payload);

				if (response.waitFor && timeCall < 10) {
					setTimeout(analyze, response.waitFor * timeCall);
				}
				port.postMessage({ response });

				timeCall++;

				if (timeCall === 10) {
					port.postMessage({
						status: "Error",
						msg: "Time out"
					});
				}
			};

			await analyze();
			return true; 
		});
		
	}
	if (port.name === "summaryContentPipe") {
		console.log("summaryContentPipe");
		port.onMessage.addListener(async function (msg) {
			let timeCall = 1;
			const summary = async () => {
				const payload = {
					...msg.payload,
					language: await getOriginalLang()
				}
				let response = await summaryContent(payload);

				if (response.waitFor && timeCall < 10) {
					setTimeout(summary, response.waitFor * timeCall);
				}

				
				
				port.postMessage({ response });

				timeCall++;

				if (timeCall === 10) {
					port.postMessage({
						status: "Error",
						msg: "Time out"
					});
				}
			};

			await summary();
			return true;
		});
	}
	if (port.name === "translateContentPipe") {
		console.log("translateContentPipe");
		port.onMessage.addListener(async function (msg) {
			let timeCall = 1;
			const translate = async () => {
				const payload = {
					...msg.payload,
					originalLang: await getOriginalLang(),
					language: await getDictLang()
				}
				let response = await translateContent(payload);

				if (response.waitFor && timeCall < 10) {
					setTimeout(translate, response.waitFor * timeCall);
				}
				port.postMessage({ response });

				timeCall++;

				if (timeCall === 10) {
					port.postMessage({
						status: "Error",
						msg: "Time out"
					});
				}
			};

			await translate();
			return true;
		});
	}
	if (port.name === "relationContentPipe") {
		console.log("relationContentPipe");
		port.onMessage.addListener(async function (msg) {
			let timeCall = 1;
			const relation = async () => {
				const payload = {
					...msg.payload,
					language: await getOriginalLang()
				}
				let response = await relationContent(payload);

				if (response.waitFor && timeCall < 10) {
					setTimeout(relation, response.waitFor * timeCall);
				}
				port.postMessage({ response });

				timeCall++;

				if (timeCall === 10) {
					port.postMessage({
						status: "Error",
						msg: "Time out"
					});
				}
			};

			await relation();
			return true;
		});
	}
});
