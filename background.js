let currentJumpPosition = 0
let tabJumpList = []

function fillEmptyList() {
	if (tabJumpList.length == 0) {
		chrome.tabs.query({ active: true }, (results) => {
			for (let result of results) {
				tabJumpList.push({tabId: result.id, windowId: result.windowId})
			}
		})
		currentJumpPosition = tabJumpList.length - 1
	}
}

const tabActivationHandler = (activeInfo) => {
	fillEmptyList()
	tabJumpList = tabJumpList.slice(0, currentJumpPosition + 1)
	tabJumpList.push(activeInfo)
	currentJumpPosition = tabJumpList.length - 1
	if (tabJumpList.length > 50) {
		tabJumpList.shift()
	}
	console.log(`Active tab info - tabid: ${activeInfo.tabId}, windowid: ${activeInfo.windowId}, currentPos: ${currentJumpPosition}`)
	console.log(tabJumpList)
}

async function switchToTab(currentTab) {
	let retrievedTab
	try {
		retrievedTab = await chrome.tabs.get(currentTab.tabId)
	} catch {
		return false
	}
	console.log(retrievedTab)
	await chrome.tabs.update(retrievedTab.id, { active: true })
	chrome.tabs.onActivated.addListener(tabActivationHandler)
	return true
}

async function jumpForwardTab() {
	chrome.tabs.onActivated.removeListener(tabActivationHandler)
	currentJumpPosition++
	if (currentJumpPosition >= tabJumpList.length) {
		currentJumpPosition = tabJumpList.length - 1
	}
	let currentTab = tabJumpList[currentJumpPosition]
	console.log(currentJumpPosition)
	console.log(currentTab.tabId)
	while(!(await switchToTab(currentTab))) {
		tabJumpList.splice(currentJumpPosition, 1)
		if (currentJumpPosition >= tabJumpList.length) {
			currentJumpPosition = tabJumpList.length - 1
		}
		currentTab = tabJumpList[currentJumpPosition]
	}
}

async function jumpBackwardTab() {
	chrome.tabs.onActivated.removeListener(tabActivationHandler)
	currentJumpPosition--
	if (currentJumpPosition <= 0) {
		currentJumpPosition = 0
	}
	let currentTab = tabJumpList[currentJumpPosition]
	console.log(currentJumpPosition)
	console.log(currentTab.tabId)
	while(!(await switchToTab(currentTab))) {
		tabJumpList.splice(currentJumpPosition, 1)
		currentJumpPosition--
		if (currentJumpPosition < 0) {
			currentJumpPosition = tabJumpList.length - 1
		}
		currentTab = tabJumpList[currentJumpPosition]
	}
}

chrome.commands.onCommand.addListener(async (cmd) => {
	fillEmptyList()
	if (tabJumpList.length == 1) {
		return
	}
	switch(cmd) {
		case "jump-tab-list-forward":
			await jumpForwardTab()
			break
		case "jump-tab-list-backward":
			await jumpBackwardTab()
			break
	}
})

chrome.tabs.onActivated.addListener(tabActivationHandler)

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
	if (tabJumpList.length == 1) {
		return
	}
	if (removeInfo.isWindowClosing) {
		return
	}
	if (tabId === (tabJumpList[currentJumpPosition]).tabId) {
		chrome.tabs.onActivated.removeListener(tabActivationHandler)
		tabJumpList.splice(currentJumpPosition, 1)
		currentJumpPosition = tabJumpList.length - 1
		switchToTab(tabJumpList[currentJumpPosition])
	}
})

fillEmptyList()
