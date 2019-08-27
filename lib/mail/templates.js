
const singleSeries = (seriesUpdate) => {
	return seriesUpdate.newEpsoids.map(json => {
		const downloads = json.downloads.map(d => {
			return `<li><span>${d.title}:</span><span><a href="${d.link}">下载连接</a></span><span> ${d.title.includes('百度') ? json.baiduCode : ''}</span></li>`
		}).join('')
		return `<div><div>${json.fileName} ===> 制式: ${json.format} ===> 大小: ${json.size}</div><ul>${downloads}</ul></div>`
	}).join('')
}

const newEpisodes = (updates) => {
	const message = updates.map(singleSeries).join('')
	const titleUpdates = updates.map(u => u.original.name).join(' ')
	const subject = `有更新 ${titleUpdates}`

	return {subject, message}
}

module.exports = {
	newEpisodes
}