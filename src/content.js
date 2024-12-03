//content.js

const DOMPurify = require('dompurify');

let actionButton;
let popup;
let additionalPopup;
let activeAction = null;

let isHiddenActionButton = true
let isHiddenPopup = true
let isHiddenAdditionalPopup = true

let isShowAction = true

document.addEventListener('mouseup', async () => {
	const currentSelection = window.getSelection();
	const selectedText = currentSelection.toString().trim();
	const currentUrl = window.location.href;

	if (selectedText) {
		const range = currentSelection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		if (!actionButton) {
			actionButton = document.createElement("button");
			actionButton.id = "text-action-button";
			actionButton.innerHTML = "Show Actions";
			actionButton.style.position = "absolute";
			actionButton.style.zIndex = 1000;
			actionButton.style.background = "#007bff";
			actionButton.style.color = "#fff";
			actionButton.style.padding = "1px 5px";
			actionButton.style.borderRadius = "5px";
			actionButton.style.height = "25px";
			actionButton.style.cursor = "pointer";
			actionButton.style.border = "none";
			document.body.appendChild(actionButton);
		}

		if (isHiddenActionButton) {
			isHiddenActionButton = false
		}

		isShowAction = false

		actionButton.style.top = `${rect.bottom + window.scrollY + 5}px`;
		actionButton.style.left = `${rect.left + window.scrollX}px`;
		actionButton.style.display = 'block';
		actionButton.dataset.selectedText = selectedText;

		actionButton.addEventListener('click', async () => {
			const freshText = actionButton.dataset.selectedText;

			if (!freshText) {
				alert("Please select some text to perform actions.");
				return;
			}

			isShowAction = !isShowAction ? true : false

			if (!isShowAction) {
				if (popup) {
					popup.style.display = 'none';
				}
				activeAction = null;
				actionButton.innerHTML = "Show Actions";
			} else {
				actionButton.innerHTML = "Hidden Actions";
				togglePopup(freshText, rect);
			}
		});
	} else {
		cleanupUI();
	}
});

document.addEventListener('selectionchange', () => {
	const selectedText = window.getSelection().toString().trim();
	if (!selectedText) {
		if (actionButton && actionButton?.dataset) {
			actionButton.dataset.selectedText = '';
		}
		cleanupUI();
	}
});

function cleanupUI() {
	isHiddenActionButton = true;
	isHiddenPopup = true;
	isShowAction = false;
	if (actionButton) {
		actionButton.style.display = 'none';
		actionButton.innerHTML = "Show Actions";
	}
	if (popup) {
		popup.remove();
		popup = null;
	}
	if (additionalPopup) {
		additionalPopup.remove();
		additionalPopup = null;
	}
	activeAction = null;
}

function togglePopup(selectedText, rect) {
	isHiddenPopup = isHiddenPopup ? false : true;

	if (isHiddenPopup) {
		popup.style.display = 'none';
		activeAction = null;
		actionButton.innerHTML = "Show Actions";
		return;
	}

	if (!isHiddenActionButton && !isHiddenPopup && !popup) {
		popup = document.createElement("div");
		popup.id = "text-action-popup";
		popup.style.position = "absolute";
		popup.style.backgroundColor = "#fff";
		popup.style.border = "1px solid #ccc";
		popup.style.padding = "15px";
		popup.style.zIndex = "1001";
		popup.style.width = "200px";
		popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
		popup.style.borderRadius = "5px";

		const analyzeButton = createActionButton("Analyze", "💡", 'analyze', selectedText);
		const summaryButton = createActionButton("Summary", "📝", 'summary', selectedText);
		const translateButton = createActionButton("Translate", "🌐", 'translate', selectedText);
		const relatedKnowledgeButton = createActionButton("Related content", "🔍", 'related_knowledge', selectedText);
		const saveContentButton = createActionButton("Save content", "📥", 'save_content', selectedText);

		popup.appendChild(analyzeButton);
		popup.appendChild(summaryButton);
		popup.appendChild(translateButton);
		popup.appendChild(relatedKnowledgeButton);
		popup.appendChild(saveContentButton);

		document.body.appendChild(popup);
	}

	const buttonRect = actionButton.getBoundingClientRect();
	const popupWidth = 200;
	const offset = 0;

	let popupTop = buttonRect.bottom + window.scrollY + offset;
	let popupLeft = buttonRect.left + window.scrollX;

	if (popupLeft + popupWidth > window.innerWidth) {
		popupLeft = window.innerWidth - popupWidth - offset;
	}

	popup.style.top = `${popupTop}px`;
	popup.style.left = `${popupLeft}px`;
	popup.style.display = 'block';
	activeAction = "show";
	actionButton.innerHTML = "Hide Actions";
}

function createActionButton(label, icon, actionType, selectedText) {
	const button = document.createElement("button");
	button.style.display = "flex";
	button.style.alignItems = "center";
	button.style.justifyContent = "flex-start";
	button.style.marginBottom = "10px";
	button.style.width = "100%";
	button.style.padding = "5px";
	button.style.border = "none";
	button.style.backgroundColor = "transparent";
	button.style.cursor = "pointer";

	button.dataset.selectedText = selectedText;
	const iconElement = document.createElement("span");
	iconElement.style.marginRight = "10px";
	iconElement.innerHTML = icon;

	const labelElement = document.createElement("span");
	labelElement.innerHTML = label;

	button.appendChild(iconElement);
	button.appendChild(labelElement);

	button.addEventListener('click', async () => {
		const freshText = button.dataset.selectedText;
		if (!freshText) {
			alert("Please select some text to perform actions.");
			return;
		}

		if (additionalPopup && additionalPopup.style.display === 'block') {
			additionalPopup.remove();
			additionalPopup = null;
		} else {
			await openAdditionalPopup(label, actionType, freshText);
		}
	});

	return button;
}

async function openAdditionalPopup(label, actionType, selectedText) {
	if (isHiddenActionButton || isHiddenPopup) {
		additionalPopup.remove();
		additionalPopup = null;
	}
	if (additionalPopup) {
		additionalPopup.remove();
		additionalPopup = null;
	}

	additionalPopup = document.createElement("div");
	additionalPopup.style.position = "absolute";
	additionalPopup.style.backgroundColor = "#ffffff";
	additionalPopup.style.border = "1px solid #e0e0e0";
	additionalPopup.style.padding = "20px";
	additionalPopup.style.zIndex = "1002";
	additionalPopup.style.width = "500px";
	additionalPopup.style.height = "350px";
	additionalPopup.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
	additionalPopup.style.borderRadius = "8px";
	additionalPopup.style.fontFamily = "Arial, sans-serif";
	additionalPopup.style.color = "#333";
	additionalPopup.style.fontSize = "14px";
	additionalPopup.style.lineHeight = "1.5";

	const titleElement = document.createElement("h3");
	titleElement.innerText = label;
	titleElement.style.margin = "0 0 10px";
	titleElement.style.fontSize = "16px";
	titleElement.style.color = "#007BFF";
	additionalPopup.appendChild(titleElement);

	const loadingElement = document.createElement("div");
	loadingElement.className = "d-flex justify-content-center align-items-center";
	loadingElement.style.height = "250px";

	const spinner = document.createElement("div");
	spinner.className = "spinner-border text-primary";
	spinner.role = "status";
	spinner.style.width = "3rem";
	spinner.style.height = "3rem";

	const spinnerText = document.createElement("span");
	spinnerText.className = "sr-only";
	spinnerText.innerText = "Loading...";

	spinner.appendChild(spinnerText);
	loadingElement.appendChild(spinner);
	additionalPopup.appendChild(loadingElement);

	const popupRect = popup.getBoundingClientRect();
	const offset = 1;
	let additionalPopupTop = popupRect.top + window.scrollY;
	let additionalPopupLeft = popupRect.right + window.scrollX + offset;

	if (additionalPopupLeft + 500 > window.innerWidth) {
		additionalPopupLeft = window.innerWidth - 500 - offset;
	}

	additionalPopup.style.top = `${additionalPopupTop}px`;
	additionalPopup.style.left = `${additionalPopupLeft}px`;

	document.body.appendChild(additionalPopup);

	const content = await getContentFromAPI(actionType, selectedText);

	if (content) {
		const contentElement = document.createElement("div");
		contentElement.style.height = '250px';
		contentElement.style.overflowY = 'auto';
		const sanitizedContent = DOMPurify.sanitize(content);
		contentElement.innerHTML = sanitizedContent;
		additionalPopup.appendChild(contentElement);

		loadingElement.remove();
	}

	// const copyButton = document.createElement("button");
	// copyButton.innerText = "Copy";
	// copyButton.style.marginRight = "10px";
	// copyButton.style.padding = "5px 10px";
	// copyButton.style.border = "1px solid #ccc";
	// copyButton.style.backgroundColor = "#007BFF";
	// copyButton.style.color = "#fff";
	// copyButton.style.borderRadius = "4px";
	// copyButton.style.cursor = "pointer";
	// copyButton.addEventListener("click", () => {
	// 	const tempTextArea = document.createElement("textarea");
	// 	tempTextArea.value = selectedText;
	// 	document.body.appendChild(tempTextArea);
	// 	tempTextArea.select();
	// 	document.execCommand("copy");
	// 	document.body.removeChild(tempTextArea);
	// 	alert("Content copied!");
	// });
	// additionalPopup.appendChild(copyButton);

	// const editButton = document.createElement("button");
	// editButton.innerText = "Edit";
	// editButton.style.padding = "5px 10px";
	// editButton.style.border = "1px solid #ccc";
	// editButton.style.backgroundColor = "#28A745";
	// editButton.style.color = "#fff";
	// editButton.style.borderRadius = "4px";
	// editButton.style.cursor = "pointer";
	// editButton.addEventListener("click", () => {
	// 	const editableContent = document.createElement("textarea");
	// 	editableContent.style.width = "100%";
	// 	editableContent.style.height = "200px";
	// 	editableContent.style.marginTop = "10px";
	// 	editableContent.value = selectedText;
	// 	additionalPopup.appendChild(editableContent);
	// 	editButton.disabled = true;
	// });
	// additionalPopup.appendChild(editButton);
}

async function getContentFromAPI(actionType, selectedText) {
	const currentUrl = window.location.href;
	switch (actionType) {
		case 'analyze':
			try {
				return new Promise((resolve, reject) => {
					const port = chrome.runtime.connect({ name: "analyzerContentPipe" });
					port.postMessage({
						action: "analyzerContent",
						payload: {
							url: currentUrl,
							originalText: selectedText
						}
					});
					port.onMessage.addListener(function (msg) {
						if (msg.response) {
							if ("done" === msg.response.status) {
								const contentElement = document.createElement("div");
								contentElement.className = "d-flex justify-content-center align-items-center";
								const ulElement = document.createElement("ul");
								// Create li elements and add them to the ul
								const liTitle = document.createElement("li");
								liTitle.textContent = `Title: ${msg.response.result.title}`;
								ulElement.appendChild(liTitle);

								const liLang = document.createElement("li");
								liLang.textContent = `Language: ${msg.response.result.language}`;
								ulElement.appendChild(liLang);

								const liTopic = document.createElement("li");
								liTopic.textContent = `Topic: ${msg.response.result.topic}`;
								ulElement.appendChild(liTopic);

								contentElement.appendChild(ulElement);

								resolve(contentElement);
							}
						} else {
							reject("No response received.");
						}
					});
					// Optional: Handle disconnection
					port.onDisconnect.addListener(() => {
						reject("Connection to background script was lost.");
					});
				});
			} catch (error) {
				console.error(error);
				return createErrorElement("Error");
			}
		case 'summary':
			try {
				return new Promise((resolve, reject) => {
					const port = chrome.runtime.connect({ name: "summaryContentPipe" });
					port.postMessage({
						action: "summaryContent",
						payload: {
							url: currentUrl,
							originalText: selectedText
						}
					});
					port.onMessage.addListener(function (msg) {
						if (msg.response) {
							if ("done" === msg.response.status) {
								const contentElement = document.createElement("div");
								contentElement.className = "d-flex justify-content-center align-items-center";
								const ideas = msg.response.result.ideas
								const ulElement = document.createElement("ul");
								const liLang = document.createElement("li");
								liLang.textContent = `Language: ${msg.response.result.language}`;
								ulElement.appendChild(liLang);
								for (const idea of ideas) {
									const liIdea = document.createElement("li");
									liIdea.textContent = `${idea}`;
									ulElement.appendChild(liIdea);
								}
								contentElement.appendChild(ulElement);

								resolve(contentElement);
							}
						} else {
							reject("No response received.");
						}
					});
					port.onDisconnect.addListener(() => {
						reject("Connection to background script was lost.");
					});
				});
			} catch (error) {
				console.error(error);
				return createErrorElement("Error");
			}
		case 'translate':
			try {
				return new Promise((resolve, reject) => {
					const port = chrome.runtime.connect({ name: "translateContentPipe" });
					port.postMessage({
						action: "translateContent",
						payload: {
							url: currentUrl,
							originalText: selectedText
						}
					});
					port.onMessage.addListener(function (msg) {
						if (msg.response) {
							if ("done" === msg.response.status) {
								const contentElement = document.createElement("div");
								contentElement.className = "d-flex justify-content-center align-items-center";
								const result = msg.response.result
								const ulElement = document.createElement("ul");

								const liLang = document.createElement("li");
								liLang.textContent = `Language: ${result.language}`;
								ulElement.appendChild(liLang);

								const liITranslation = document.createElement("li");
								liITranslation.textContent = `${result.translation}`;
								ulElement.appendChild(liITranslation);
								contentElement.appendChild(ulElement);

								resolve(contentElement);
							}
						} else {
							reject("No response received.");
						}
					});
					port.onDisconnect.addListener(() => {
						reject("Connection to background script was lost.");
					});
				});
			} catch (error) {
				console.error(error);
				return createErrorElement("Error");
			}
		case 'related_knowledge':
			try {
				return new Promise((resolve, reject) => {
					const port = chrome.runtime.connect({ name: "relationContentPipe" });
					port.postMessage({
						action: "relationContentPipe",
						payload: {
							url: currentUrl,
							originalText: selectedText
						}
					});

					port.onMessage.addListener(function (msg) {
						if (msg.response) {
							if ("done" === msg.response.status) {
								const contentElement = document.createElement("div");
								contentElement.className = "d-flex justify-content-center align-items-center";

								const result = msg.response.result;
								const articles = result.articles;

								if (articles && articles.length > 0) {
									const ulElement = document.createElement("ul");
									const liLang = document.createElement("li");
									liLang.textContent = `Language: ${msg.response.result.language}`;

									articles.forEach(article => {
										const liElement = document.createElement("li");
										liElement.style.marginBottom = "15px";

										const titleElement = document.createElement("h4");
										titleElement.innerText = article.title;
										titleElement.style.margin = "0 0 5px";
										liElement.appendChild(titleElement);

										const descriptionElement = document.createElement("p");
										descriptionElement.innerText = article.description;
										descriptionElement.style.margin = "0 0 5px";
										liElement.appendChild(descriptionElement);

										const hardLevelElement = document.createElement("span");
										hardLevelElement.innerText = `Level: ${article.hardLevel}`;
										hardLevelElement.style.fontStyle = "italic";
										liElement.appendChild(hardLevelElement);

										ulElement.appendChild(liElement);
									});

									contentElement.appendChild(ulElement);
								} else {
									const noResultsElement = document.createElement("p");
									noResultsElement.innerText = "No related articles found.";
									contentElement.appendChild(noResultsElement);
								}

								resolve(contentElement); // Trả về nội dung đã được xử lý
							}
						} else {
							reject("No response received.");
						}
					});

					port.onDisconnect.addListener(() => {
						reject("Connection to background script was lost.");
					});
				});
			} catch (error) {
				console.error(error);
				return createErrorElement("Error");
			}
		case 'save_content':
			try {
				new Promise((resolve, reject) => {
					chrome.runtime.sendMessage({
						action: "saveContent",
						payload: {
							url: currentUrl,
							originalText: selectedText
						}
					}, (response) => {
						console.log(response);
						if (response.meta.status !== 201 && response.meta.status !== 200) {
							reject('Failed to save content');
						}

						resolve(createSuccessElement("Save content successful"))
					});
				});

				return createSuccessElement("Save content successful")
			} catch (error) {
				console.error(error);
				return createErrorElement("Error");
			}

	}
}


function createErrorElement(message) {
	const errorElement = document.createElement('div');
	errorElement.className = 'error-result';
	errorElement.textContent = `Error: ${message}`;
	return errorElement;
}

function createSuccessElement(message) {
	const successElement = document.createElement('div');
	successElement.className = 'success-result';
	successElement.textContent = `Success: ${message}`;
	return successElement;
}