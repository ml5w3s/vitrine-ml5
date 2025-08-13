<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!--./js/ui/components/header.html -->
<header class="container">
  <a href="/mlab5">
      <img src="/mlab5/images/logo_mobile.png">
  </a>
    <nav>
        <a href="/index.php">Início</a> |
        <a href="/sobre.php">Sobre</a> |
        <a href="/contato.php">Contato</a> |
        <a href="/mlab5/formularios/form_cadastro.php">Cadastre-se</a> |

        <?php if (!empty($_SESSION['usuario'])): ?>
            <span>👤 Olá, <?php echo htmlspecialchars($_SESSION['usuario']); ?>!</span>
            <a href="/logout.php">Sair</a>
        <?php else: ?>
            <a href="/mlab5/formularios/form_login.php">Entrar</a>
        <?php endif; ?>
    </nav>
</header>
