const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// ฐานข้อมูลร้านอาหารแบบจำลอง (หลังมอ & กังสดาล)
const allRestaurants = [
    // ฝั่งหลังมอ
    "ส้มตำหลังมอ", "แจ่วฮ้อนหลังมอ", "ชาบูชิลล์", "ก๋วยเตี๋ยวดู๋ดี๋", "สเต็กหลังมอ", 
    "ยำมะม่วง", "เครปไส้ทะลัก", "หมูกระทะเฮียเปียว", "ข้าวมันไก่", "บิงซูหลังมอ",
    "หม่าล่าเสียบไม้", "อาหารตามสั่งเจ๊พร", "ไก่ย่างจีระพันธ์", "ร้านนมหลังมอ",
    // ฝั่งกังสดาล
    "ก๋วยเตี๋ยวเรือกังสดาล", "หม่าล่าหม้อไฟ", "คาเฟ่กังสดาล", "ซูชิสายพาน", 
    "ปิ้งย่างเกาหลี", "ไก่ทอดเกาหลี", "ร้านยำกังสดาล", "ขนมจีนน้ำยา",
    "ข้าวหมูแดงหมูกรอบ", "น้ำเต้าหู้กังสดาล", "เบอร์เกอร์", "พิซซ่าโฮมเมด"
];

// ฟังก์ชันสุ่มเมนู 10 อย่าง
function getRandomItems(array, num) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

const rooms = {};

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomCode) => {
        socket.join(roomCode);
        
        // ถ้าเป็นคนแรกที่เข้าห้อง ให้สร้างห้องและสุ่ม 10 ร้านประจำห้องนี้
        if (!rooms[roomCode]) {
            const selectedItems = getRandomItems(allRestaurants, 10);
            rooms[roomCode] = { 
                users: 0, 
                votes: {}, 
                items: selectedItems, // เก็บ 10 ร้านที่สุ่มได้
                finishedUsers: 0 
            };
        }
        
        rooms[roomCode].users++;
        // ส่งรายการ 10 ร้านที่สุ่มแล้วไปให้คนที่เพิ่งเข้าห้อง
        socket.emit('startGame', rooms[roomCode].items);
    });

    socket.on('swipeRight', ({ roomCode, item }) => {
        if (!rooms[roomCode]) return;
        if (!rooms[roomCode].votes[item]) rooms[roomCode].votes[item] = 0;
        rooms[roomCode].votes[item]++;
    });

    socket.on('finishVoting', (roomCode) => {
        if (!rooms[roomCode]) return;
        rooms[roomCode].finishedUsers++;

        // ถ้าทุกคนโหวตเสร็จแล้ว ค่อยสรุปผล
        if (rooms[roomCode].finishedUsers === rooms[roomCode].users) {
            const votes = rooms[roomCode].votes;
            // หาร้านที่คะแนนเยอะสุด
            let winner = "ไม่มีใครอยากกินอะไรเลย!";
            let maxVotes = 0;
            
            if (Object.keys(votes).length > 0) {
                winner = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
                maxVotes = votes[winner];
            }
            
            io.to(roomCode).emit('result', { winner, maxVotes });
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});