const fetch = require('node-fetch')

async function HtmlToImage(html) {
    const response = await fetch('https://img-gen.uibun.dev/api/htmltoimg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://www.uibun.dev/htmltopng'
        },
        body: JSON.stringify({ html })
    })

    return await response.buffer()
}

(async () => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dasar Hytam</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: white;
                    color: black;
                    font-family: Arial, sans-serif;
                    font-size: 24px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div>This is example</div>
        </body>
        </html>
    `

    const imageBuffer = await HtmlToImage(htmlContent)
    require('fs').writeFileSync('./Gambar.png', imageBuffer)
    vioo.sendMessage(m.chat, { image: fs.readFileSync('./Gambar.png') })
})()