let ioInstance = null;

export function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 [WebSocket] Client connected: ${socket.id}`);

    // Allow client to request immediate sync
    socket.on('request:sync', () => {
      socket.emit('sync:ack', { timestamp: new Date().toISOString() });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [WebSocket] Client disconnected: ${socket.id}`);
    });
  });
}

export function broadcastSensorUpdate(data) {
  if (ioInstance) {
    ioInstance.emit('sensor:update', data);
  }
}

export function broadcastAlertNew(alert) {
  if (ioInstance) {
    ioInstance.emit('alert:new', alert);
  }
}

export function broadcastAlertResolved(alert) {
  if (ioInstance) {
    ioInstance.emit('alert:resolved', alert);
  }
}

export function broadcastNodeStatus(node) {
  if (ioInstance) {
    ioInstance.emit('node:status', node);
  }
}

export function getIO() {
  return ioInstance;
}
