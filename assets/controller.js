const crypto = require('crypto');
const fs = require('fs').promises;

// Configurações de criptografia
const algorithm = 'aes-256-gcm';
const secretKey = crypto.randomBytes(32); // Chave de 256 bits (32 bytes)
const ivLength = 12; // Tamanho do IV para GCM

class JsonController {
    constructor(filePath) {
        this.filePath = filePath;
        this.plainData = null Source code continues...

    // Gera um IV (Initialization Vector) aleatório
    static generateIV() {
        return crypto.randomBytes(ivLength);
    }

    // Criptografa os dados
    async encryptData(data) {
        const iv = JsonController.generateIV();
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        
        const jsonString = JSON.stringify(data);
        let encrypted = cipher.update(jsonString, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted,
            authTag: authTag.toString('hex')
        };
    }

    // Descriptografa os dados
    async decryptData(encryptedObj) {
        const decipher = crypto.createDecipheriv(
            algorithm,
            secretKey,
            Buffer.from(encryptedObj.iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(encryptedObj.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }

    // Carrega e descriptografa o arquivo
    async load() {
        try {
            const fileContent = await fs.readFile(this.filePath, 'utf8');
            const encryptedObj = JSON.parse(fileContent);
            this.plainData = await this.decryptData(encryptedObj);
            return this.plainData;
        } catch (error) {
            throw new Error(`Erro ao carregar/descriptografar: ${error.message}`);
        }
    }

    // Salva e criptografa os dados
    async save(data) {
        try {
            this.plainData = data;
            const encryptedObj = await this.encryptData(data);
            await fs.writeFile(this.filePath, JSON.stringify(encryptedObj));
        } catch (error) {
            throw new Error(`Erro ao criptografar/salvar: ${error.message}`);
        }
    }

    // Obtém um campo específico dos dados
    getField(field) {
        if (!this.plainData) {
            throw new Error('Dados não carregados. Execute load() primeiro.');
        }
        return this.plainData[field];
    }

    // Atualiza um campo específico
    updateField(field, value) {
        if (!this.plainData) {
            throw new Error('Dados não carregados. Execute load() primeiro.');
        }
        this.plainData[field] = value;
    }
}

// Exemplo de uso
async function main() {
    const controller = new JsonController('user_data.json');
    
    // Dados de exemplo
    const sampleData = {
        id: 1,
        name: "João Silva",
        email: "joao@example.com",
        email_verified: true,
        password: "hashed_password_123",
        remember_token: "abc123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    try {
        // Salvar dados criptografados
        await controller.save(sampleData);
        console.log('Dados salvos com sucesso!');

        // Carregar e descriptografar dados
        const loadedData = await controller.load();
        console.log('Dados carregados:', loadedData);

        // Acessar um campo específico
        console.log('Email:', controller.getField('email'));

        // Atualizar um campo e salvar
        controller.updateField('name', 'Maria Silva');
        await controller.save(controller.plainData);
        console.log('Dados atualizados e salvos!');
    } catch (error) {
        console.error(error.message);
    }
}

if (require.main === module) {
    main();
}

module.exports = JsonController;