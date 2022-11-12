const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Configuração do Multer para salvar os arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/products') // Pasta onde os arquivos serão salvos
    },
    filename: function (req, file, cb) {
        const uuid =  uuidv4() // Gera um nome único para o arquivo
        const timestamp = Date.now() // Gera um timestamp para o arquivo
        const extension = path.extname(file.originalname).toLowerCase() // Pega a extensão do arquivo
        cb(null, uuid + '_' + timestamp + extension) // Salva o arquivo com o nome: nome_unico_timestamp.extensão
    }
})

// Configuração do Multer para filtrar os arquivos
const storage_user = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/user') // Pasta onde os arquivos serão salvos
    },
    
    filename: function (req, file, cb) {
        const uuid =  uuidv4() // Gera um nome único para o arquivo
        const timestamp = Date.now() // Gera um timestamp para o arquivo
        const extension = path.extname(file.originalname).toLowerCase() // Pega a extensão do arquivo
        cb(null, uuid + '_' + timestamp + extension) // Salva o arquivo com o nome: nome_unico_timestamp.extensão
    }
})

const upload_user = multer({ storage: storage_user }) // Utiliza a configuração do multer para salvar os arquivos
const upload = multer({ storage: storage,  fileFilter: (req, file, callback) => {
    const acceptableExtensions = ['png', 'jpg', 'jpeg', 'jpg']
    if (!(acceptableExtensions.some(extension => 
        path.extname(file.originalname).toLowerCase() === `.${extension}`)
    )) {
        return callback(new Error(`Erro ao salvar imagem, verifique se as extensões são: ${acceptableExtensions.join(',')}.`))
    }
    callback(null, true)
} }); // Utiliza a configuração do multer para salvar os arquivos e filtrar extensões.

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
})

app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/user.html');
})

// Rota para salvar os arquivos
app.post('/saveImage/products', function (req, res) {upload.single('file')(req, res, function (err) {
    if (err) {
        return res.status(500).json({ auth : 'ok', message:'Erro ao salvar imagem, verifique se as extensões são: png,jpg,jpeg,jpg'})
    }
    res.status(200).json({  auth : 'ok', message: 'Imagem salva com sucesso', image_id: req.file.filename.replace(/\.[^/.]+$/, "").replace(/\_[^/_]+$/, "")});
})});

app.post('/saveImage/users', function (req, res) {upload.single('file')(req, res, function (err) {
    if (err) {
        return res.status(500).json({ auth : 'ok', message:'Erro ao salvar imagem, verifique se as extensões são: png,jpg,jpeg,jpg'})
    }
    res.status(200).json({  auth : 'ok', message: 'Imagem salva com sucesso', image_id: req.file.filename.replace(/\.[^/.]+$/, "").replace(/\_[^/_]+$/, "")});
})});


// Rota para Visualizar os arquivos baseado no nome
app.get('/getImage/products/:id', (req, res) => {
    let id = req.params.id  // Pega o nome do arquivo

    // Procura o arquivo na pasta baseado no id
    fs.readdir('./uploads/products', (err, files) => {
        if (err) {
            console.log(err)
        }
        files.forEach(file => {
            // Verifica se o começo do nome do arquivo é igual ao id
            if(file.startsWith(id)){
                // Retorna o arquivo
                res.sendFile(__dirname + '/uploads/products/' + file)
            }
        })
    })
    
})

app.get('/getImage/users/:id', (req, res) => {
    let id = req.params.id // Pega o nome do arquivo

    // Procura o arquivo na pasta baseado no id
    fs.readdir('./uploads/user', (err, files) => {
        if (err) {
            console.log(err)
        }
        files.forEach(file => {
            // Verifica se o começo do nome do arquivo é igual ao id
            if(file.startsWith(id)){
                // Retorna o arquivo
                res.sendFile(__dirname + '/uploads/user/' + file)
            }
        })
    })
    
})

// Inicia o servidor
app.listen(5000, () => {
    console.log(`Servidor Iniciado na porta 5000`); 
});