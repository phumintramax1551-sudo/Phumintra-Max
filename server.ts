import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

// In-Memory Multiplayer Room State
export interface RoomMember {
  id: string;
  nickname: string;
  characterId: string;
  isReady: boolean;
  isHost: boolean;
  avatar: string;
  ws?: WebSocket;
}

export interface MultiplayerRoom {
  code: string;
  partyType: 'solo' | 'duo' | 'squad';
  mapType: string;
  gameMode: string;
  maxPlayers: number;
  members: RoomMember[];
  isInGame: boolean;
}

const rooms = new Map<string, MultiplayerRoom>();

// WebSocket real-time handling
wss.on('connection', (ws: WebSocket) => {
  let currentRoomCode: string | null = null;
  let currentMemberId: string | null = null;

  ws.on('message', (data: string) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'create_room') {
        const { roomCode, nickname, characterId, partyType, mapType, gameMode, avatar } = msg;
        const maxPlayers = partyType === 'solo' ? 1 : partyType === 'duo' ? 2 : 4;
        const memberId = `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const newRoom: MultiplayerRoom = {
          code: roomCode,
          partyType,
          mapType: mapType || 'classic',
          gameMode: gameMode || 'tdm',
          maxPlayers,
          isInGame: false,
          members: [
            {
              id: memberId,
              nickname,
              characterId: characterId || 'eva',
              isReady: true,
              isHost: true,
              avatar: avatar || '🎖️',
              ws,
            },
          ],
        };

        rooms.set(roomCode, newRoom);
        currentRoomCode = roomCode;
        currentMemberId = memberId;

        ws.send(
          JSON.stringify({
            type: 'room_joined',
            roomCode,
            memberId,
            room: sanitizeRoom(newRoom),
          })
        );
      } else if (msg.type === 'join_room') {
        const { roomCode, nickname, characterId, avatar } = msg;
        const room = rooms.get(roomCode);

        if (!room) {
          ws.send(JSON.stringify({ type: 'error', message: 'ไม่พบห้องนี้ (Room not found)' }));
          return;
        }

        if (room.members.length >= room.maxPlayers) {
          ws.send(JSON.stringify({ type: 'error', message: 'ห้องเต็มแล้ว (Room is full)' }));
          return;
        }

        const memberId = `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const member: RoomMember = {
          id: memberId,
          nickname,
          characterId: characterId || 'eva',
          isReady: false,
          isHost: false,
          avatar: avatar || '🎖️',
          ws,
        };

        room.members.push(member);
        currentRoomCode = roomCode;
        currentMemberId = memberId;

        // Broadcast updated room state to all members
        broadcastToRoom(room, {
          type: 'room_updated',
          room: sanitizeRoom(room),
        });

        ws.send(
          JSON.stringify({
            type: 'room_joined',
            roomCode,
            memberId,
            room: sanitizeRoom(room),
          })
        );
      } else if (msg.type === 'toggle_ready') {
        if (!currentRoomCode || !currentMemberId) return;
        const room = rooms.get(currentRoomCode);
        if (!room) return;

        const member = room.members.find((m) => m.id === currentMemberId);
        if (member) {
          member.isReady = !member.isReady;
          broadcastToRoom(room, {
            type: 'room_updated',
            room: sanitizeRoom(room),
          });
        }
      } else if (msg.type === 'start_match') {
        if (!currentRoomCode) return;
        const room = rooms.get(currentRoomCode);
        if (!room) return;

        room.isInGame = true;
        broadcastToRoom(room, {
          type: 'match_started',
          mapType: room.mapType,
          gameMode: room.gameMode,
        });
      } else if (msg.type === 'team_chat') {
        if (!currentRoomCode) return;
        const room = rooms.get(currentRoomCode);
        if (!room) return;

        broadcastToRoom(room, {
          type: 'chat_message',
          sender: msg.sender,
          text: msg.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else if (msg.type === 'player_sync') {
        // Sync position, hp, and dance state between teammates
        if (!currentRoomCode) return;
        const room = rooms.get(currentRoomCode);
        if (!room) return;

        room.members.forEach((m) => {
          if (m.ws && m.ws !== ws && m.ws.readyState === WebSocket.OPEN) {
            m.ws.send(
              JSON.stringify({
                type: 'teammate_sync',
                memberId: currentMemberId,
                pos: msg.pos,
                rotY: msg.rotY,
                hp: msg.hp,
                isDancing: msg.isDancing,
              })
            );
          }
        });
      }
    } catch (e) {
      console.error('WebSocket message parsing error:', e);
    }
  });

  ws.on('close', () => {
    if (currentRoomCode && currentMemberId) {
      const room = rooms.get(currentRoomCode);
      if (room) {
        room.members = room.members.filter((m) => m.id !== currentMemberId);
        if (room.members.length === 0) {
          rooms.delete(currentRoomCode);
        } else {
          // If host left, assign new host
          if (!room.members.some((m) => m.isHost)) {
            room.members[0].isHost = true;
          }
          broadcastToRoom(room, {
            type: 'room_updated',
            room: sanitizeRoom(room),
          });
        }
      }
    }
  });
});

function sanitizeRoom(room: MultiplayerRoom) {
  return {
    code: room.code,
    partyType: room.partyType,
    mapType: room.mapType,
    gameMode: room.gameMode,
    maxPlayers: room.maxPlayers,
    isInGame: room.isInGame,
    members: room.members.map((m) => ({
      id: m.id,
      nickname: m.nickname,
      characterId: m.characterId,
      isReady: m.isReady,
      isHost: m.isHost,
      avatar: m.avatar,
    })),
  };
}

function broadcastToRoom(room: MultiplayerRoom, payload: any) {
  const jsonStr = JSON.stringify(payload);
  room.members.forEach((m) => {
    if (m.ws && m.ws.readyState === WebSocket.OPEN) {
      m.ws.send(jsonStr);
    }
  });
}

// REST endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size, timestamp: Date.now() });
});

// Mount Vite or Serve Static
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`Server running on port ${port} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
