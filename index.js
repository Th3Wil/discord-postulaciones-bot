/**
 * ============================================================
 * BOT DE POSTULACIONES – DISCORD
 * ============================================================
 * - Detecta tickets creados por Ticket Tool
 * - Valida categoría específica
 * - Envía embed automático con instrucciones
 * - Menciona rol de reclutadores
 * - Evita mensajes duplicados usando el topic del canal
 * - Maneja errores para evitar caídas del bot
 * ============================================================
 */
require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  EmbedBuilder
} = require('discord.js');

/**
 * ------------------------------------------------------------
 * Inicialización del cliente de Discord
 * Solo usamos el intent necesario: Guilds
 * ------------------------------------------------------------
 */
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  sweepers: {
    messages: {
      interval: 300,
      lifetime: 60
    },
    users: {
      interval: 300,
      filter: () => true
    },
    guildMembers: {
      interval: 300,
      filter: () => true
    }
  }
});

/**
 * ------------------------------------------------------------
 * CONFIGURACIÓN GENERAL
 * ------------------------------------------------------------
 */
const CATEGORIA_POSTULACIONES = '🧪 - POSTULACIONES - 🧪';
const ROL_RECLUTADORES_ID = '1440328309178236980';
const TOPIC_FLAG = 'postulacion_embed_enviado';

/**
 * ------------------------------------------------------------
 * Evento: Bot listo
 * ------------------------------------------------------------
 */
client.once('clientReady', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

/**
 * ------------------------------------------------------------
 * Evento: Creación de canal
 * ------------------------------------------------------------
 */
client.on('channelCreate', async (channel) => {

  // ================= VALIDACIONES BÁSICAS =================

  // Solo procesar canales de texto
  if (channel.type !== ChannelType.GuildText) return;

  // Solo procesar tickets (ticket-000X)
  if (!channel.name.startsWith('ticket-')) return;

  // Validar que pertenezca a la categoría correcta
  const categoria = channel.parent;
  if (!categoria || categoria.name !== CATEGORIA_POSTULACIONES) return;

  // Evitar duplicados: si ya se envió el embed, salir
  if (channel.topic === TOPIC_FLAG) return;

  // ================= CREAR EMBED =================

  const embed = new EmbedBuilder()
    .setColor(0x5865F2) // Azul Discord
    .setTitle('🧪 Postulación al Gremio – Información requerida')
    .setDescription(
      '**Por favor responde TODAS las preguntas y adjunta las imágenes solicitadas.**\n' +
      'Las postulaciones incompletas no serán revisadas.\n\n' +

      '**Responde lo siguiente:**\n\n' +

      '**1)** ¿Cuál era tu gremio anterior?\n' +
      '**2)** ¿Cómo nos conociste?\n' +
      '**3)** ¿Por qué quieres entrar al gremio?\n' +
      '**4)** ¿Qué roles juegas en ZvZ?\n' +
      '**5)** ¿En qué dispositivo juegas?\n' +
      '**6)** ¿Cuál es tu horario de juego?\n' +
      '**7)** ¿Puedes grabar VODs?\n\n' +

      '**Adjunta las siguientes imágenes:**\n\n' +
      '📸 **8)** Foto del lobby *(que se vea completamente)*\n' +
      '📊 **9)** Foto de tus estadísticas\n\n' +

      '⏳ **Tiempo estimado de respuesta:** 24–48 hrs'
    )
    .setFooter({ text: 'Equipo de Reclutamiento' })
    .setTimestamp();

  // ================= ENVÍO SEGURO =================

  try {
    // Enviar embed + mención al rol
    await channel.send({
      content: `<@&${ROL_RECLUTADORES_ID}>`,
      embeds: [embed],
      allowedMentions: {
        roles: [ROL_RECLUTADORES_ID]
      }
    });

    // Marcar el canal para evitar reenvíos
    await channel.setTopic(TOPIC_FLAG);

    console.log(`📨 Embed enviado correctamente en ${channel.name}`);

  } catch (error) {
    // Manejo de errores: el bot NO se cae
    console.error(
      `❌ Error al procesar el canal ${channel.name}:`,
      error
    );
  }
});

/**
 * ------------------------------------------------------------
 * Inicio del bot
 * ------------------------------------------------------------
 */
client.login(process.env.DISCORD_TOKEN);
