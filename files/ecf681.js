/*
 Script Murni Buatan Rullz X Hokma Dilarang Keras Recode/Rename Tanpa Izin Silahkan Izin Kalau Rename Ni Sc Awas Aja lu Kalau Ketahuan Rename. No enc 20K aja 6282266777590 atau 6283892787563
*/
const fs = require('fs')
const axios = require('axios')
const { createSticker } = require('./database/exif')
const { sendText } = require('./database/function')
const setting = require('./setting')
const os = require('os')

const handleCommand = async (m, Rullz) => {
  try {
    const from = m.key.remoteJid
    const sender = m.key.participant || m.key.remoteJid
    const senderNumber = sender.split('@')[0]

    let body = m.message?.conversation || m.message?.extendedTextMessage?.text || ''
    const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body)
      ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi)[0]
      : '.'
    const isCmd = body.startsWith(prefix)
    const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : ''
    const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : []
    const text = args.join(" ")
    const isGroup = from.endsWith('@g.us')
    const quotedFake = {
      key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: from },
      message: { conversation: setting.botName }
    }
    const reply = (txt) => sendText(Rullz, from, txt, quotedFake)
    const isOwner = setting.ownerNumber.includes(senderNumber)
    const isPrivate = !isGroup
    const premiumList = fs.existsSync('./all/premium.json') ? JSON.parse(fs.readFileSync('./all/premium.json')) : []
    const isPremium = premiumList.includes(sender)

        // Greeting based on time
    let timeNow = moment.tz('Asia/Jakarta').format('HH')
    let greeting = 'Halo'
    if (timeNow >= 4 && timeNow < 10) greeting = '🌄 Selamat pagi'
    else if (timeNow >= 10 && timeNow < 15) greeting = '🌅 Selamat siang'
    else if (timeNow >= 15 && timeNow < 18) greeting = '🌆 Selamat sore'
    else greeting = '🌌 Selamat malam'

    const reply = (txt) => sendText(Rullz, from, txt, quotedFake)

    if (!isCmd) return

    switch (command) {
      case 'menu':
        await Rullz.sendMessage(from, {
          text: `${greeting} ${isGroup ? `grup *${groupName}*` : 'pengguna pribadi'}!\n\n` +
            `➤ Bot Name: ${botName}\n` +
            `➤ Mode: ${isOwner ? 'Owner' : isDeveloper ? 'Developer' : isPrivate ? 'Private User' : 'User'}\n\n` +
            `📌 Fitur tersedia:\n` +
            `- .menu\n- .ping\n- .owner\n- dll`,
          footer: footerText
        }, { quoted: m })
        break
        
        case 'thanks'
         await Rullz.sendMessage(from, {
          text: `Thanks To\nRullz (Supported Script)\nDenzz (Ga tau Ubah sendiri)`
          break
          
      case 'ping':
        const start = new Date()
        const end = new Date() - start
        await Rullz.sendMessage(from, {
          text: `🏓 Pong!! ${end}ms`,
          footer: footerText
        }, { quoted: m })
        break
        
         case 'dev':
        await Rullz.sendMessage(from, {
          text: `Nih Nomor Developer Ku Kalau Ada Error Hubungi Dev ku yah 🥰 Jangan di bug juga 🙄:\n${devNumber.map(v => `• @${v.split('@')[0]}`).join('\n')}`,
          mentions: devNumber
        }, { quoted: m })
        break
        
      case 'owner':
        await Rullz.sendMessage(from, {
          text: `Nih Nomor Owner Kuh Jangan Macem Macem loh ya 🙄:\n${ownerNumber.map(v => `• @${v.split('@')[0]}`).join('\n')}`,
          mentions: ownerNumber
        }, { quoted: m })
        break

      default:
        break
    }

  } catch (err) {
    console.log('Error di case.js:', err)
  }
}

module.exports = handleCommand