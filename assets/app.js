const JsonController = require('./controller.js');

async function main() {
    // Inicializa o controlador com o arquivo perfil.json
    const controller = new JsonController('perfil.json');

    // Dados de exemplo para perfil.json
    const perfilData = {
        id: 1,
        name: "Ana Costa",
        email: "ana.costa@example.com",
        email_verified: false,
        password: "hashed_password_456",
        remember_token: "xyz789",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    try {
        // Salvar dados criptografados em perfil.json
        await controller.save(perfilData);
        console.log('Dados salvos em perfil.json com sucesso!');

        // Carregar e descriptografar dados de perfil.json
        const loadedData = await controller.load();
        console.log('Dados carregados de perfil.json:', loadedData);

        // Acessar um campo específico
        console.log('Nome:', controller.getField('name'));

        // Atualizar um campo e salvar novamente
        controller.updateField('email', 'ana.novo@example.com');
        await controller.save(controller.plainData);
        console.log('Dados atualizados e salvos em perfil.json!');
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

main();