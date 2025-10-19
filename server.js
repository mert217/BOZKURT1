const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Öğrenilen bilgiler
let bilgiler = {};
const dosya = 'bozkurt_bilgiler.json';

// Eğer dosya varsa yükle
if (fs.existsSync(dosya)) {
    bilgiler = JSON.parse(fs.readFileSync(dosya));
}

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Mesaj gönderildiğinde
app.post('/ogren', (req, res) => {
    const mesaj = (req.body.bilgi || "").trim().toLowerCase();
    const ogret = req.body.ogret;
    const cevap = req.body.cevap;

    if (ogret && cevap) {
        // Öğrenme
        bilgiler[ogret.toLowerCase()] = cevap;
        fs.writeFileSync(dosya, JSON.stringify(bilgiler, null, 2));
        res.send("Tamam, öğrendim!");
    } else if (bilgiler[mesaj]) {
        // Daha önce öğrenilmiş
        res.send(bilgiler[mesaj]);
    } else {
        // Bilgi yok
        res.send("Bilmiyorum, öğretir misin?");
    }
});

app.listen(8080, () => console.log('Bozkurt 8080 portunda çalışıyor.'));
