<?php
include("conexao.php");
session_start();
$conn = conectar();

$user = trim($_POST["txt_user"]);
$pass = $_POST["txt_pass"];

// Busca usuário pelo nome
$sql = "SELECT id, email, password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // Verifica senha
    if (password_verify($pass, $row['password'])) {
        
        session_regenerate_id(true);
        $_SESSION['usuario_id'] = $row['id'];
        $_SESSION['usuario_nome'] = $row['email'];
        echo "<script>alert('Login realizado com sucesso'); window.location.href='../index.html';</script>";
    } else {
        echo "<script>alert('Usuário ou senha incorretos'); window.history.back();</script>";
    }
} else {
    echo "<script>alert('Usuário ou senha incorretos'); window.history.back();</script>";
}

$stmt->close();
$conn->close();
?>
