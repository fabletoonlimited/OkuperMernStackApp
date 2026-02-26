/**
 * SSE (Server-Sent Events) connection store
 *
 * Singleton in-memory map that tracks all active SSE connections per conversation.
 * Key: conversationId (string)
 * Value: Set of ReadableStreamDefaultController instances (one per connected client)
 *
 * Note: This works on a single server instance. If the app is ever scaled
 * horizontally (multiple servers), replace this with Redis pub/sub.
 */

const globalStore = global;

if (!globalStore._sseConnections) {
  globalStore._sseConnections = new Map();
}

const sseConnections = globalStore._sseConnections;

const encoder = new TextEncoder();

/**
 * Register a new SSE connection for a conversation
 */
export const registerConnection = (conversationId, controller) => {
  const key = conversationId.toString();
  if (!sseConnections.has(key)) {
    sseConnections.set(key, new Set());
  }
  sseConnections.get(key).add(controller);
};

/**
 * Remove an SSE connection when the client disconnects
 */
export const removeConnection = (conversationId, controller) => {
  const key = conversationId.toString();
  const connections = sseConnections.get(key);
  if (!connections) return;
  connections.delete(controller);
  if (connections.size === 0) {
    sseConnections.delete(key);
  }
};

/**
 * Emit a read receipt event to all clients in a conversation
 */
export const emitReadReceipt = (conversationId, readerId) => {
  const key = conversationId.toString();
  const connections = sseConnections.get(key);
  if (!connections || connections.size === 0) return;

  const payload = encoder.encode(
    `data: ${JSON.stringify({ type: "messagesRead", readerId })}\n\n`
  );

  for (const controller of connections) {
    try {
      controller.enqueue(payload);
    } catch {
      connections.delete(controller);
    }
  }
};

/**
 * Emit a typing indicator event to all clients in a conversation
 */
export const emitTyping = (conversationId, senderName) => {
  const key = conversationId.toString();
  const connections = sseConnections.get(key);
  if (!connections || connections.size === 0) return;

  const payload = encoder.encode(
    `data: ${JSON.stringify({ type: "typing", senderName })}\n\n`
  );

  for (const controller of connections) {
    try {
      controller.enqueue(payload);
    } catch {
      connections.delete(controller);
    }
  }
};

/**
 * Send the initial keep-alive ping to a newly connected client
 */
export const sendPing = (controller) => {
  controller.enqueue(encoder.encode(": connected\n\n"));
};

/**
 * Emit a new message event to all clients connected to a conversation
 */
export const emitToConversation = (conversationId, message) => {
  const key = conversationId.toString();
  const connections = sseConnections.get(key);
  if (!connections || connections.size === 0) return;

  const payload = encoder.encode(
    `data: ${JSON.stringify({ type: "newMessage", message })}\n\n`
  );

  for (const controller of connections) {
    try {
      controller.enqueue(payload);
    } catch {
      // Controller is closed — remove it
      connections.delete(controller);
    }
  }
};
