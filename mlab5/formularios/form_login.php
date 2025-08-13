<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="icon" type="image/x-icon" href="../images/ml5w3s.ico">
  <title>Cadastro</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  
  <!-- CSS  -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="../css/base.css" type="text/css" rel="stylesheet" media="screen,projection"/>
  <link href="../css/admin.css" type="text/css" rel="stylesheet" media="screen,projection"/>

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Cursos Online e Vagas de Emprego | [ML5Lab]">
  <meta name="twitter:description" content="Cursos práticos, projetos reais e vagas de emprego em tecnologia. Comece agora!">
  <meta name="twitter:image" content="http://ml5w3s.com.br/images/banner_barramento.png">
</head>

<body>

<!-- CABEÇALHO -->
<div id="header-placeholder"></div>
<h2>Login</h2>
<form action="../controle/login_usuario.php" method="post">
    Usuário: <input type="text" name="txt_user" required><br>
    Senha: <input type="password" name="txt_pass" required><br>
    <button type="submit">Entrar</button>
</form>

<div id="footer-placeholder"></div>

<!-- SCRIPTS -->
<script>
  async function loadComponent(placeholderId, url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro ao carregar ${url}`);
      const html = await response.text();
      document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
      console.error(error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', '../js/ui/components/header.html')
      .then(() => {
        const script = document.createElement('script');
        script.src = '../js/ui/components/navbar.js';
        document.body.appendChild(script);
      })
      .catch(error => {
        console.error("Erro ao carregar o header:", error);
      });

    loadComponent('footer-placeholder', '../js/ui/components/footer.html');
  });
</script>

</body>
</html>
