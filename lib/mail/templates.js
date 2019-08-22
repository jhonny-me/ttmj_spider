

const newEpsoild = (inputName, jsonArr) => {
	const message = jsonArr.map(json => {
		const downloads = json.downloads.map(d => {
			return `<li><span>${d.title}:</span><span><a href="${d.link}">下载连接</a></span><span> ${d.title.includes('百度') ? json.baiduCode : ''}</span></li>`
		}).join('')
		return `<div><div>${json.fileName} ===> 制式: ${json.format} ===> 大小: ${json.size}</div><ul>${downloads}</ul></div>`
	}).join('')

	return {
		subject: `有更新 ${inputName}`,
		message
	}
}

module.exports = {
	newEpsoild
}