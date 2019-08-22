const axios = require('axios')
const cheerio = require('cheerio')
const mailer = require('./lib/mail/mailer')

const mailTo = 'guqiang180@gmail.com'
const baseURL = 'http://www.ttzmz.vip/meiju'
const inputName = "Agents of S H I E L D"
const season = 6

const concateRequestURL = (inputName, season) => {
	let formatedName = inputName
	formatedName = formatedName.replace(' ', '.')
	if (season) {
		return `${baseURL}/${formatedName}/${season}.html`
	} else {
		return `${baseURL}/${formatedName}.html`
	}
}

const index = async () => {
	const url = concateRequestURL(inputName, season)
	const res = await axios.get(url)
	const $ = cheerio.load(res.data)

	const updateTimeRaw = $('div.seedlink span:nth-child(4)').text()
	const updateTime = new Date(updateTimeRaw.split('：').pop())

	const seedlist = $('tbody#seedlist').children().map((i, el) => {
		const tds = $(el).children()
		const fileName = tds.eq(1).find('font').text()

		const downloads = tds.eq(2).children().map((i, el) => {
			const title = $(el).attr('title')
			let link = $(el).attr('href')
			if (title.includes('迅雷')) {
				link = $(el).attr('data-url')
			}
			return {
				title,
				link
			}
		}).get()

		const baiduCode = tds.eq(4).text()
		const size = tds.eq(5).text()
		const format = tds.eq(6).text()
		const zimu = tds.eq(7).children().text()
		const updateAt = tds.eq(8).text()
		return {
			fileName,
			downloads,
			baiduCode,
			size,
			format,
			zimu,
			updateAt
		}
	}).get()

	mailer(inputName, seedlist, mailTo)
}

index().catch(console.error)