<?php
function conectar() {
    $host = "localhost";
    $user = "root"; // seu usuário
    $pass = "BrownSeal74"; // sua senha
    $db   = "portal_cursos"; // nome do banco

    $conn = new mysqli($host, $user, $pass, $db);

    if ($conn->connect_error) {
        die("Falha na conexão: " . $conn->connect_error);
    }

    return $conn;
}
?>
