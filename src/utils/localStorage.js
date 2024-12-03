function setItemWithExpiry(key, value, expiryInMinutes) {
	const now = new Date();
	const item = {
		value: value,
		expiry: now.getTime() + expiryInMinutes * 60000,
	};
	localStorage.setItem(key, JSON.stringify(item));
}

function getItemWithExpiry(key) {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) {
		return null;
	}
	const item = JSON.parse(itemStr);
	const now = new Date();

	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key);
		return null;
	}
	return item.value;
}

module.exports = {
	setItemWithExpiry,
	getItemWithExpiry
}

