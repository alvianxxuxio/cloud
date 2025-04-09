const { generateWAMessageFromContent, generateMessageID,  generateMessageIDV2 } = require('@vnzzkkj/baileys');


/**
 * Envia uma mensagem com botões interativos.
 * 
 * @param {string} from - O ID do destinatário.
 * @param {object} ayla - Instância do cliente Ayla.
 * @param {string} text - Texto da mensagem principal.
 * @param {string} footer - Rodapé da mensagem.
 * @param {Array} buttons - Array de botões personalizados.
 * @param {object} quoted - Mensagem que será citada (opcional).
 */
async function EnvButton(from, ayla, text, footer, buttons, quoted = null) { /* Verifica Se O Padrão Recebido É Uma Array */
    if (!Array.isArray(buttons)) {
        throw new TypeError("O parâmetro 'buttons' deve ser um array.");
    }
    
    await ayla.sendMessage(from, {
        text,
        footer,
        buttons: buttons.map(button => ({
            buttonId: button.id,
            buttonText: { displayText: button.displayText }
        })),
        viewOnce: true,
        headerType: 6
    }, { quoted });
}

//module.exports = { EnvButton };


/**
 * Envia uma mensagem interativa com botões avançados e seções.
 * 
 * @param {string} from - O ID do destinatário.
 * @param {object} ayla - Instância do cliente Ayla.
 * @param {string} title - Título principal da mensagem.
 * @param {string} subtitle - Subtítulo da mensagem.
 * @param {string} bodyText - Texto principal da mensagem.
 * @param {Array} buttons - Array de botões avançados.
 * @param {Array} sections - Array de seções para a lista.
 * @param {object} quoted - Mensagem citada (opcional).
 */
async function EnvInteractiveMessage(from, ayla, title, subtitle, bodyText, buttons, sections, imageUrl = null, quoted = null) {
    const gen = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        hasMediaAttachment: !!imageUrl,
                        title,
                        subtitle
                    },
                    body: {
                        text: bodyText
                    },
                    nativeFlowMessage: {
                        messageVersion: 1,
                        buttons: buttons.map(button => ({
                            name: button.name,
                            buttonParamsJson: JSON.stringify(button.params)
                        })),
                        messageParamsJson: ""
                    }
                }
            }
        }
    };

    // Se houver uma imagem, adicionamos ao conteúdo da mensagem
    if (imageUrl) {
        gen.viewOnceMessage.message.interactiveMessage.header.mediaAttachment = {
            richPreviewType: 1,
            url: imageUrl
        };
    }

    const genv2 = generateWAMessageFromContent(from, gen, { userJid: ayla.user?.id });
    await ayla.relayMessage(from, genv2.message, { messageId: generateMessageID() }, { quoted });
}


module.exports = { EnvButton, EnvInteractiveMessage };

